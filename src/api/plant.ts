import type { SensorData } from "../types/SensorData";
import { sendLineNotification } from "./notification";
const ESP32_API_URL = import.meta.env.VITE_ESP32_API_URL || "http://172.20.10.2";

const fetchWater = async (data: SensorData) => {
  console.log("Fetching water endpoint...");
  try {
    console.log("Sending request to /water...");
    const response = await fetch(`${ESP32_API_URL}/water`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await sendLineNotification(data);
  } catch (error) {
    console.error("Error fetching water endpoint:", error);
  }
}
  
export { fetchWater };