import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDeWgHJ3HF0gKJ8mS6z_nl8vMuQtG48aI",
  authDomain: "the-blessings-trunk.firebaseapp.com",
  projectId: "the-blessings-trunk",
  storageBucket: "the-blessings-trunk.firebasestorage.app",
  messagingSenderId: "695595089738",
  appId: "1:695595089738:web:060d3e09476ee1e65ecbb3",
  measurementId: "G-LMESVPBF6M"
};

// Initialize Firebase Modular SDK
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;