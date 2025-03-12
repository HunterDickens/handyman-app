import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔹 Added Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDWM_4NXb9Uzoch0XzkB5KTP2w04agbenU",
  authDomain: "handymanapp-b6e50.firebaseapp.com",
  projectId: "handymanapp-b6e50",
  storageBucket: "handymanapp-b6e50.appspot.com",
  messagingSenderId: "1012114745538",
  appId: "1:1012114745538:web:2d9be1171af707ec2bf35b",
  measurementId: "G-HE0GCLKDY3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🔹 Added Firestore export

export { app, auth, db };
