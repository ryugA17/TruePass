// src/components/layout/firebase.tsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdhrHlyLqkn4kMQadw7QxcOLz29jReWo4",
  authDomain: "truepass-6d376.firebaseapp.com",
  projectId: "truepass-6d376",
  storageBucket: "truepass-6d376.firebasestorage.app",
  messagingSenderId: "401588023543",
  appId: "1:401588023543:web:33ece7598e3e6410e7e3f2",
  measurementId: "G-H30YM862FS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
