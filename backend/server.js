require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const projectRoutes = require("./routes/projectRoutes");
const generateInstructionsRoutes = require("./routes/generateInstructionsRoutes");
const costEstimationRoutes = require("./routes/costEstimationRoutes");

const app = express();

const allowedOrigins = [
  "https://on-handyman.com",
  "https://www.on-handyman.com",
  "https://handymanapp-b6e50.web.app",
  "https://handymanapp-b6e50.firebaseapp.com",
  "https://localhost:5000", // ← this is your backend, not frontend
  "http://localhost:3000"   // ✅ this is the correct frontend dev origin
];


// ✅ Manual CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Middleware
app.use(express.json({ limit: "10mb", extended: true }));
app.use(morgan("dev"));

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", generateInstructionsRoutes);
app.use("/api/cost", costEstimationRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Handyman API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
