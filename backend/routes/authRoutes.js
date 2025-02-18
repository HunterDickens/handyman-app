const express = require("express");
const fetch = require("node-fetch");
const { db, auth } = require("../firebase/firebaseAdmin"); // ✅ Correct path

const router = express.Router();

// Load Firebase API Key from .env file
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

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

// **User Signup (Register)**
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Create a user in Firebase Auth
    const userRecord = await auth.createUser({ email, password });

    // Store user profile in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name: name || "New User",
      email: userRecord.email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User created successfully", user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// **User Login (Firebase ID Token)**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Authenticate using Firebase REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Return Firebase ID Token and User Data
    res.status(200).json({
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      email: data.email,
      userId: data.localId,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Update User Profile (No Picture Required)**
router.post("/update-profile", verifyFirebaseToken, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.uid;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Update Firestore user profile
    await db.collection("users").doc(userId).set(
      {
        name: name,
        email: req.user.email,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// **Get User Profile**
router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
