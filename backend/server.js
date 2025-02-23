require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // ✅ Import Upload Routes
const projectRoutes = require("./routes/projectRoutes"); 
const diagnoseRoutes = require("./routes/diagnoseRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // ✅ Ensure Upload Routes are registered
app.use("/api/projects", projectRoutes); 
app.use("/api/diagnose", diagnoseRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Handyman API is running...");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
