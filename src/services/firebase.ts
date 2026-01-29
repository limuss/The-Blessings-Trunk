import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TEMP",
  authDomain: "TEMP",
  projectId: "TEMP",
  storageBucket: "TEMP",
  messagingSenderId: "TEMP",
  appId: "TEMP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
