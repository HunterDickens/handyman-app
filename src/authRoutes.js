const express = require("express");
const fetch = require("node-fetch");
const { db, auth } = require("./firebaseAdmin");  // ✅ Use Firebase Admin SDK

const router = express.Router();

// Load Firebase API Key from .env file
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// **User Signup (Register)**
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    res.status(201).json({ message: "User created successfully", user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// **User Login (Firebase ID Token)**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate using Firebase REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Return Firebase ID Token
    res.status(200).json({ idToken: data.idToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Middleware to Verify Firebase ID Token**
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token.split(" ")[1]);
    req.user = decodedToken; // Attach Firebase user data to request
    next();
  } catch (error) {
    console.error("Firebase Token Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// **Protected Route Example (Profile)**
router.get("/profile", verifyFirebaseToken, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
