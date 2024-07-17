// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMlG6Nk-wTFMO7EVSlWZGvvYPER5jCkOo",
  authDomain: "simplytask-e9167.firebaseapp.com",
  projectId: "simplytask-e9167",
  storageBucket: "simplytask-e9167.appspot.com",
  messagingSenderId: "158670061634",
  appId: "1:158670061634:web:008f6abd314b98b2496ddb",
  measurementId: "G-B1PSEC9CX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const db = getFirestore(app);

export { auth, db };