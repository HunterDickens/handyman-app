// routes/repairInstructionsRoutes.js
const express = require("express");
const { OpenAI } = require("openai"); // Import OpenAI
require("dotenv").config();

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key from .env
});

// Endpoint for generating repair instructions
router.post("/generate-instructions", async (req, res) => {
  try {
    console.log("Request received:", req.body); // Log request body

    const { detectedIssues, imageUrl } = req.body;

    if (!detectedIssues || !imageUrl) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "Detected issues or image URL is missing" });
    }

    console.log("Sending request to OpenAI...");

    const prompt = `Generate step-by-step repair instructions for fixing a ${detectedIssues.join(", ")}. The user uploaded an image of the problem here: ${imageUrl}. Provide detailed instructions including required tools and materials.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response received");

    if (!response.choices || response.choices.length === 0) {
      console.error("Invalid response from OpenAI");
      return res.status(500).json({ error: "Failed to generate instructions" });
    }

    const repairInstructions = response.choices[0].message.content.trim();
    console.log("Repair instructions generated:", repairInstructions);

    res.json({
      message: "Repair instructions generated successfully",
      repairInstructions,
    });
  } catch (error) {
    console.error("Error generating repair instructions:", error);
    res.status(500).json({ error: "Failed to generate instructions" });
  }
});


module.exports = router;
