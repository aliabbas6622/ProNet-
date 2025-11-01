import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Updated with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-ZGvYq-53t4ti1Vbn2YRa_Q8GGzNkomA",
  authDomain: "gen-lang-client-0431873711.firebaseapp.com",
  projectId: "gen-lang-client-0431873711",
  storageBucket: "gen-lang-client-0431873711.firebasestorage.app",
  messagingSenderId: "396850291256",
  appId: "1:396850291256:web:981a1406f463ada897bccd",
  measurementId: "G-TEXREBV52M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);