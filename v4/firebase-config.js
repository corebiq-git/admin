.import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js';
const firebaseConfig = {
  apiKey: "AIzaSyCXyKSTlmlzkYnH2LW408cVVWV1CPvlfBo",
  authDomain: "cmfilings-6a37c.firebaseapp.com",
  projectId: "cmfilings-6a37c",
  storageBucket: "cmfilings-6a37c.firebasestorage.app",
  messagingSenderId: "138705123778",
  appId: "1:138705123778:web:9561bff9f0f5d89bb6fe5b",
  measurementId: "G-09DM4NZF8D"
};
const firebaseReady=!Object.values(firebaseConfig).some(v=>String(v).startsWith('YOUR_'));
const app=initializeApp(firebaseConfig); const db=getFirestore(app); const auth=getAuth(app); const storage=getStorage(app);
export {app,db,auth,storage,firebaseReady};
