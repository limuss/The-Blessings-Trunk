import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// New Firebase configuration for The Blessings Trunk
const firebaseConfig = {
  apiKey: "AIzaSyDDeWgHJ3HF0gKJ8mS6z_nl8vMuQtG48aI",
  authDomain: "the-blessings-trunk.firebaseapp.com",
  projectId: "the-blessings-trunk",
  storageBucket: "the-blessings-trunk.firebasestorage.app",
  messagingSenderId: "695595089738",
  appId: "1:695595089738:web:060d3e09476ee1e65ecbb3",
  measurementId: "G-LMESVPBF6M"
};

// Initialize Firebase using compat mode
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;