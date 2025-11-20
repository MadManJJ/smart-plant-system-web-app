import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { WeatherCard } from "./WeatherCard";
import { CameraCard } from "./CameraCard";
import { LoadingScreen } from "./LoadingScreen";

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

const PlantDashboard = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          <CameraCard />
        </div>
      </div>
    </div>
  );
};



export default PlantDashboard;
