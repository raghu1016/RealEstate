// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9519a.firebaseapp.com",
  projectId: "mern-estate-9519a",
  storageBucket: "mern-estate-9519a.appspot.com",
  messagingSenderId: "1054339899638",
  appId: "1:1054339899638:web:bbe18e45cbff6106094cd7",
  measurementId: "G-DH36LDBBTJ"
};
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase

