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

export type { SensorData };