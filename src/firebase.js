// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaU94RuVlvWTV8EhwAAtbHV8Vs1AnP7ag",
  authDomain: "plateforme-recrutement-ia.firebaseapp.com",
  projectId: "plateforme-recrutement-ia",
  storageBucket: "plateforme-recrutement-ia.firebasestorage.app",
  messagingSenderId: "85776419215",
  appId: "1:85776419215:web:f6fb80b95f8080eaaf63fa",
  measurementId: "G-WWMR710L3R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
