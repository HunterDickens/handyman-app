import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWM_4NXb9Uzoch0XzkB5KTP2w04agbenU",
  authDomain: "handymanapp-b6e50.firebaseapp.com",
  projectId: "handymanapp-b6e50",
  storageBucket: "handymanapp-b6e50.firebasestorage.app",
  messagingSenderId: "1012114745538",
  appId: "1:1012114745538:web:2d9be1171af707ec2bf35b",
  measurementId: "G-HE0GCLKDY3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
