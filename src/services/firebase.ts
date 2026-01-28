
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Firebase configuration for the boutique app
const firebaseConfig = {
  apiKey: "AIzaSyB5Vyck3p7QVOBEAjotDedHU4ku65P8Lpg",
  authDomain: "kashmir-visual-arts.firebaseapp.com",
  projectId: "kashmir-visual-arts",
  storageBucket: "kashmir-visual-arts.firebasestorage.app",
  messagingSenderId: "1067165945416",
  appId: "1:1067165945416:web:771af05dda9ec00a19d27d",
  measurementId: "G-0NR3QY0XD7"
};

// Initialize Firebase using compat mode to avoid named export issues in restricted environments
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
