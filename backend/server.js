require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); 
const projectRoutes = require("./routes/projectRoutes"); 
const generateInstructionsRoutes = require("./routes/generateInstructionsRoutes");
const costEstimationRoutes = require("./routes/costEstimationRoutes");

const app = express();

// ✅ Middleware
app.use(express.json({ limit: "10mb", extended: true }));  // ✅ Fix for JSON parsing
app.use(cors({
  origin: "*",  // Change to specific frontend domain for security
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);  // ✅ Projects routes
app.use("/api/uploads", uploadRoutes);    // ✅ Uploads for images only
app.use("/api/repair", generateInstructionsRoutes);
app.use("/api/cost", costEstimationRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Handyman API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
