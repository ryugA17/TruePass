// src/components/layout/firebase.tsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdhrHlyLqkn4kMQadw7QxcOLz29jReWo4",
  authDomain: "truepass-6d376.firebaseapp.com",
  projectId: "truepass-6d376",
  storageBucket: "truepass-6d376.appspot.com",
  messagingSenderId: "401588023543",
  appId: "1:401588023543:web:33ece7598e3e6410e7e3f2",
  measurementId: "G-H30YM862FS"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
