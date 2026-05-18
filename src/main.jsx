import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. Import Firebase tools
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

// 2. PASTE YOUR EXACT FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyApRbsa87PVIfYMeIRnhwQ9lq2eTPyERWw",
  authDomain: "macro-tracker-9ff62.firebaseapp.com",
  projectId: "macro-tracker-9ff62",
  storageBucket: "macro-tracker-9ff62.firebasestorage.app",
  messagingSenderId: "438771836260",
  appId: "1:438771836260:web:04d24eea1a7b4b4561c671"
};

// 3. Start Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. The Magic Polyfill: Routes your existing app logic directly to the cloud
window.storage = {
  get: async (key) => {
    try {
      const docRef = doc(db, "user_data", key);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { value: docSnap.data().value } : null;
    } catch (e) {
      console.error("Error loading data:", e);
      return null;
    }
  },
  set: async (key, value) => {
    try {
      await setDoc(doc(db, "user_data", key), { value: value });
    } catch (e) {
      console.error("Error saving data:", e);
    }
  },
  delete: async (key) => {
    try {
      await deleteDoc(doc(db, "user_data", key));
    } catch (e) {
      console.error("Error deleting data:", e);
    }
  }
};

// 5. Render the App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)