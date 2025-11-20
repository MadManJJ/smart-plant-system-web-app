import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// --- ERROR CHECKING ---
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error("🚨 FIREBASE CONFIG ERROR: Missing API Key or Database URL.");
}

// Define variables with their Types
let app: FirebaseApp;
let db: Database;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("🔥 CRITICAL FIREBASE ERROR:", error);
  throw new Error("Firebase failed to initialize.");
}

export { db, auth };
