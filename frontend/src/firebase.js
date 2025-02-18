// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWM_4NXb9Uzoch0XzkB5KTP2w04agbenU",
  authDomain: "handymanapp-b6e50.firebaseapp.com",
  projectId: "handymanapp-b6e50",
  storageBucket: "handymanapp-b6e50.firebasestorage.app",
  messagingSenderId: "1012114745538",
  appId: "1:1012114745538:web:2d9be1171af707ec2bf35b",
  measurementId: "G-HE0GCLKDY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
