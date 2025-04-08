const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// POST endpoint for generating repair instructions
app.post("/generate-instructions", upload.single("image"), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    if (!req.body.detectedIssues) {
      return res.status(400).json({ error: "Detected issues are required" });
    }

    // Parse detected issues
    let detectedIssues;
    try {
      detectedIssues = JSON.parse(req.body.detectedIssues);
    } catch (err) {
      return res.status(400).json({ error: "Invalid detected issues format" });
    }

    if (!Array.isArray(detectedIssues) || detectedIssues.length === 0) {
      return res.status(400).json({ error: "At least one issue is required" });
    }

    // Process image
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Generate prompt
    const prompt = `You are a home repair expert. Analyze this image showing: ${detectedIssues.join(
      ", "
    )}.
Provide detailed, step-by-step repair instructions including:
1. Tools needed
2. Materials required
3. Safety precautions
4. Detailed repair steps
Format your response clearly for beginners.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Validate response
    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const repairInstructions = response.choices[0].message.content.trim();

    // Send success response
    res.json({
      success: true,
      repairInstructions,
      detectedIssues,
    });
  } catch (error) {
    console.error("Error in /generate-instructions:", error);

    // Clean up file if it exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    res.status(500).json({
      error: "Failed to generate instructions",
      details: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

