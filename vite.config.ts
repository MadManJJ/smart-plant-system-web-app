import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The configuration is wrapped in a function to gain access to the 'mode'
export default defineConfig(({ mode }) => { 
  
  // 1. Load Environment Variables
  // We use loadEnv(mode, process.cwd(), '')
  // - mode: 'development' or 'production'
  // - process.cwd(): The root directory where .env files are located
  // - '': The prefix to look for. Using '' loads all variables, including those without 'VITE_'
  const env = loadEnv(mode, process.cwd(), ''); 

  // 2. Access the desired variable
  const stream_url = env.VITE_CAMERA_STREAM_URL;

  if (env.VITE_CAMERA_STREAM_URL) {
    console.log("Proxying /camera-api to stream URL:", stream_url);
  } else {
    // This console will show up if VITE_CAMERA_STREAM_URL is missing,
    // and it will fall back to the hardcoded IP, preventing a broken build.
    console.error("VITE_CAMERA_STREAM_URL not found in .env. Falling back to:", stream_url);
  }

  // 3. Return the main configuration object
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      proxy: {
        '/camera-api': {
          // Use the dynamic URL loaded from the environment
          target: stream_url, 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/camera-api/, ''),
        },
      },
    }, 
  };
});