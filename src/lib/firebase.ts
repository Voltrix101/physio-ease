
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: This config is now correct and fetched from the server.
const firebaseConfig = {
  "projectId": "physioease",
  "appId": "1:709140659977:web:db791975eb6d098b935dd8",
  "storageBucket": "physioease.firebasestorage.app",
  "apiKey": "AIzaSyBrihfkVqqN-RchiYjaoqr-jFwROVnuAFM",
  "authDomain": "physioease.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "709140659977"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
