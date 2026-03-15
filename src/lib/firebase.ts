import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoVvlVOLUABm-uLB9gvR3qe1PgdG-HOGo",
  authDomain: "pigeonz-72578.firebaseapp.com",
  projectId: "pigeonz-72578",
  storageBucket: "pigeonz-72578.firebasestorage.app",
  messagingSenderId: "1058290500880",
  appId: "1:1058290500880:web:19ee18dbc3ab4ec5fbd195",
  measurementId: "G-GM1WC8H2D4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export default app;
