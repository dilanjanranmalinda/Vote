// config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCD8DZtKNeaHyFHOB55G3ONtbZa_C3fs8o",
  authDomain: "vote-9919f.firebaseapp.com",
  projectId: "vote-9919f",
  storageBucket: "vote-9919f.appspot.com",
  messagingSenderId: "270515183468",
  appId: "1:270515183468:web:cd5d88535a911a1a681d49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Named exports
export { firebaseConfig, app, db };
