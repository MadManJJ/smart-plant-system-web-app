// src/helpers/urlToGenerativePart.ts
import type { Part } from "@google/genai";

async function urlToGenerativePart(url: string): Promise<Part> {
  let response;
  try {
    // 1. Fetch the image from the URL
    console.log(`Fetching image from URL: ${url}`);
    response = await fetch(url);
  } catch (error) {
    // Catch network errors (like the TypeError from CORS/Failed to fetch)
    throw new Error(`Network/Fetch failed for URL: ${url}. Check Vite proxy and ESP32 status.`);
  }
  
  console.log(`Received response with status: ${response.status} from URL: ${url}`);
  if (!response.ok) {
    // Catch HTTP errors (404, 500, etc.)
    throw new Error(`HTTP Error ${response.status} fetching image from ${url}.`);
  }
  
  // 2. Convert the response to a Blob object
  const blob = await response.blob();
  console.log(`Fetched blob of type: ${blob.type} and size: ${blob.size} bytes from URL: ${url}`);
  // 3. Convert the Blob to a Base64 string using FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('FileReader failed to convert blob to Base64.'));
    reader.onloadend = () => {
      const result = reader.result;
      if (!result || typeof result !== 'string') {
        return reject(new Error('Failed to convert blob to Base64 (empty result).'));
      }
      // reader.result is a Data URL (e.g., "data:image/jpeg;base64,...")
      const base64Data = result.split(',')[1];
      
      resolve({
        inlineData: {
          data: base64Data, // The Base64 encoded content
          mimeType: blob.type, // The MIME type (e.g., 'image/jpeg')
        },
      } as Part);
    };
    reader.readAsDataURL(blob);
  });
}

export { urlToGenerativePart };