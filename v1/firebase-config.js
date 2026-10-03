// Copy this to firebase-config.js only after creating your Firebase project.
// Then import it from your Firebase data layer.
// Do NOT commit real production credentials to public repositories without
// understanding Firebase's client-side configuration and, most importantly,
// configure Firestore/Storage security rules.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
