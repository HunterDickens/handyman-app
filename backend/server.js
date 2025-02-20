require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); 
const projectRoutes = require("./routes/projectRoutes"); 
const diagnoseRoutes = require("./routes/diagnoseRoutes");
const generateInstructionsRoutes = require("./routes/generateInstructionsRoutes"); // Import the new route

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); 
app.use("/api/projects", projectRoutes); 
app.use("/api/diagnose", diagnoseRoutes);
app.use("/api", generateInstructionsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Handyman API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
