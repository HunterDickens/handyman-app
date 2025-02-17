const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // Ensure .env is loaded

const { db, auth, bucket } = require("./firebaseAdmin"); // ✅ Correct for backend
const authRoutes = require("./authRoutes"); // Ensure correct path
const uploadRoutes = require("./uploadRoutes"); // ✅ Load after initializing `app`

const app = express(); // ✅ Initialize `app` first

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow form submissions
app.use(cors());
app.use(morgan("dev"));

// ✅ Ensure routes are correctly loaded AFTER initializing `app`
app.use("/auth", authRoutes);
app.use("/api", uploadRoutes); // ✅ Move this after initializing `app`

// Test Route
app.get("/", (req, res) => {
  res.send("Handyman API is running...");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
