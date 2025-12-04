import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { WeatherCard } from "./WeatherCard";
import { CameraCard } from "./CameraCard";
import { LoadingScreen } from "./LoadingScreen";
import { GoogleGenAI, Type } from "@google/genai";
import { urlToGenerativePart } from "../helpers/urlToGenerativePart";
import { useInterval } from '../hooks/useInterval';

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

const FIVE_MINUTES_MS =  15 * 1000;
const IMG_URL = "/camera-api/jpg"

// 1. Define the shape of your data (Must match ESP32 struct)
interface SensorData {
  board_id: number;
  temp: number;
  humidity: number; // Matches your ESP32 variable
  soil_moisture: number;
  light_level: number;
  motion_detected: boolean;
  rain_detected: boolean;
  timestamp: number; // The server timestamp
}

const getRawModelText = (response: any): string | null => {
    if (response && response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            // The raw response text is in the first part of the candidate content
            return candidate.content.parts[0].text;
        }
    }
    return null;
} 

const PlantDashboard = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: () => void; // Define variable to hold the cleanup function

    // 1. Sign In First (This works for BOTH Strict and Public modes)
    const setupListener = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously");

        // 2. Create the query
        const logsRef = query(ref(db, "logs"), limitToLast(1));

        // 3. Subscribe to real-time updates
        unsubscribe = onValue(logsRef, (snapshot) => {
          if (snapshot.exists()) {
            const rawData = snapshot.val();
            const key = Object.keys(rawData)[0];
            const latestLog = rawData[key];
            setData(latestLog);
          } else {
            console.log("No data available");
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Login or Connection failed", error);
        setLoading(false);
      }
    };

    setupListener();

    // Cleanup: Unsubscribe if the listener exists
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkPlantStatus = async () => {
    if (!isVideoActive) return;
    setIsVideoActive(false);

    try {
      if (!data) {
        console.log("No sensor data available for analysis.");
        return;
      }
      
      // Get image part from ESP32 camera stream via Vite proxy
      console.log("Preparing image part...");
      const imagePart = await urlToGenerativePart(IMG_URL);
      console.log("Image part prepared.");

      const promptParts = [
        imagePart,
        
        `Analyze the plant in the image and the provided data to determine if the plant needs water. 
        The entire response MUST be a JSON object that adheres strictly to the provided responseSchema. DO NOT include any introductory or explanatory text outside of the JSON block.

        **Sensor Data:**
        - Soil Moisture Reading: ${data.soil_moisture}%
        - Ambient Temperature: ${data.temp}°C
        - Humidity: ${data.humidity}%
        - Light Level: ${data.light_level} Lux

        Based on the image and data, what is the 'water_decision' and output it in the JSON object.?`
      ];     
      
      console.log("Preparing config...");
      const config = {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            water_decision: { 
              type: Type.STRING, 
              enum: ["Yes", "No"] 
            }
          }
        }
      };  
      
      console.log("Sending request to AI model...");
      const response: any = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptParts,
          config: config
      });     

      const rawText = getRawModelText(response);

      if (!rawText) {
        throw new Error("Failed to extract raw text from model response.");
      }

      // Use a regex to locate and extract the valid JSON block {}
      const jsonMatch = rawText.match(/\{[\s\S]*\}/); 
      if (!jsonMatch) {
          throw new Error("No valid JSON block found in model response.");
      }

      const jsonString = jsonMatch[0];      

      // Parse the clean JSON string
      const jsonResponse: { water_decision: "Yes" | "No" } = JSON.parse(jsonString);

      // Now, safely access the decision
      const decision = jsonResponse.water_decision;   

      if (decision !== "Yes" && decision !== "No") {
          throw new Error(`Invalid water_decision value: ${decision}`);
      }

      if (decision === "Yes") {
          console.log("The plant needs watering.");
      } else {
          console.log("The plant does not need watering.");
      }
    } catch (error) {
      console.error("Error checking plant status:", error);
    }
    finally {
      setIsVideoActive(true);      
    }
  }

  // Check plant status every 5 minutes
  useInterval(checkPlantStatus, FIVE_MINUTES_MS);

  if (loading) return <LoadingScreen />;
  if (!data) return <h2>No Data Found</h2>;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#2d3436",
          marginBottom: "40px",
          letterSpacing: "-0.03em",
          textAlign: "left",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto 40px auto",
        }}
      >
        Smart <span style={{ color: "#10B981" }}>Plant</span> Monitor
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "stretch",
          flex: 1,
          width: "100%",
        }}
      >
        <div style={{ flex: "6 1 0", minWidth: "300px" }}>
          <WeatherCard data={data} />
        </div>
        <div style={{ flex: "4 1 0", minWidth: "250px" }}>
        {isVideoActive ? (
              // 🟢 Renders the live stream when active
              <CameraCard isVideoActive={true} />
          ) : (
              // Renders the loading screen while stream is down and image/AI is processing
              <CameraCard isVideoActive={false} />
          )}
        </div>
      </div>
    </div>
  );
};



export default PlantDashboard;
