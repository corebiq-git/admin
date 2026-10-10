import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(requiredConfig).every(Boolean);

const app = firebaseConfigured ? initializeApp(requiredConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  ? getStorage(app, `gs://${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`)
  : app ? getStorage(app) : null;
