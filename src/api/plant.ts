import type { SensorData } from "../types/SensorData";
import { sendLineNotification } from "./notification";

const EXPRESS_API_URL = import.meta.env.VITE_EXPRESS_API_URL || "http://localhost:3000";

const fetchWater = async (data: SensorData) => {
  console.log("Fetching water endpoint...");
  try {
    console.log("Sending request to /water...");

    const endpoint = `${EXPRESS_API_URL}/api/water`;
    // Send a POST request to the /water endpoint with the sensor data
    const response = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Send the sensor data in the request body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Send a notification with the sensor data
    console.log("Sending notification with sensor data...");
    await sendLineNotification(data);
    console.log("Watering request sent successfully.");
  } catch (error) {
    console.error("Error fetching water endpoint:", error);
  }
}
  
export { fetchWater };