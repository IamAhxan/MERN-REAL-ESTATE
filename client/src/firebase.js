// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-33382.firebaseapp.com",
  projectId: "mern-estate-33382",
  storageBucket: "mern-estate-33382.firebasestorage.app",
  messagingSenderId: "584575770453",
  appId: "1:584575770453:web:5ebd0298c441d08e03d9dc",
  measurementId: "G-8LFE0C7BW1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);