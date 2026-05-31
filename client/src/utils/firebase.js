import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewapp-6bcb9.firebaseapp.com",
  projectId: "interviewapp-6bcb9",
  storageBucket: "interviewapp-6bcb9.firebasestorage.app",
  messagingSenderId: "884577019816",
  appId: "1:884577019816:web:d2aecbfe5cd31d72a81f9d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export { auth, provider };
