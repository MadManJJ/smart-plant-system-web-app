import type { SensorData } from "../types/SensorData";

const EXPRESS_API_URL = import.meta.env.VITE_EXPRESS_API_URL || "http://localhost:3000";

const sendLineNotification = async (data: SensorData) => {
  if (!data) {
    console.error("No sensor data provided for notification.");
    return;
  } 

    const endpoint = `${EXPRESS_API_URL}/api/line-notify`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The sensor data is sent in the body to be used by the Express server.
            body: JSON.stringify(data), 
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Backend acknowledged notification request:', result.message);
        } else {
            // This handles errors reported by your Express server (e.g., 500 status)
            console.error('Error reported by backend:', result.message);
            throw new Error(`Backend error: ${result.message}`);
        }

    } catch (error: any) {
        // This catches network errors or the error thrown in the else block above
        console.error('Network or unexpected error during notification send:', error.message);
        throw new Error('Failed to send LINE notification');
    }    
}

export { sendLineNotification };
