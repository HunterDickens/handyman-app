const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // Ensure .env is loaded

const { db, auth, bucket } = require("./firebaseAdmin"); // ✅ Import Firebase Admin SDK
const authRoutes = require("./authRoutes"); // ✅ Import Auth Routes
const uploadRoutes = require("./uploadRoutes"); // ✅ Import Upload Routes

const app = express(); // ✅ Initialize Express

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow form submissions
app.use(cors());
app.use(morgan("dev"));

// ✅ Register Routes
app.use("/auth", authRoutes);
app.use("/api", uploadRoutes);

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
