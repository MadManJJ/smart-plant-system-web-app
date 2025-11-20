import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { ref, onValue, query, limitToLast } from "firebase/database";

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

  if (loading) return <h2>Loading Sensor Data...</h2>;
  if (!data) return <h2>No Data Found</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 Smart Plant Monitor</h1>
      <p>Last Updated: {new Date(data.timestamp).toLocaleString()}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Temperature Card */}
        <Card title="Temperature" value={`${data.temp.toFixed(1)} °C`} />

        {/* Humidity Card */}
        <Card title="Humidity" value={`${data.humidity.toFixed(1)} %`} />

        {/* Soil Card */}
        <Card title="Soil Moisture" value={data.soil_moisture.toString()} />

        {/* Light Card */}
        <Card title="Light Level" value={data.light_level.toString()} />

        {/* Status Cards */}
        <Card
          title="Rain Status"
          value={data.rain_detected ? "RAINING 🌧️" : "Dry ☀️"}
          color={data.rain_detected ? "red" : "green"}
        />

        <Card
          title="Motion"
          value={data.motion_detected ? "Detected 🏃" : "None"}
        />
      </div>
    </div>
  );
};

// Simple Helper Component for UI Cards
const Card = ({
  title,
  value,
  color = "#333",
}: {
  title: string;
  value: string;
  color?: string;
}) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      backgroundColor: "white",
    }}
  >
    <h3 style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}>
      {title}
    </h3>
    <div style={{ fontSize: "24px", fontWeight: "bold", color: color }}>
      {value}
    </div>
  </div>
);

export default PlantDashboard;
