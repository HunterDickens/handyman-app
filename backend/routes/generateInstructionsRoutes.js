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
    const { detectedIssues, imageUrl } = req.body;

    // Validate that necessary data is provided
    if (!detectedIssues || !imageUrl) {
      return res.status(400).json({ error: "Detected issues or image URL is missing" });
    }

    // Construct the prompt for instruction generation
    const prompt = `Generate step-by-step repair instructions for fixing a ${detectedIssues.join(", ")}. The user uploaded an image of the problem here: ${imageUrl}. Provide detailed instructions that a homeowner can follow, including required tools and materials.`;

    // Make a request to OpenAI to generate the instructions
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Choose the model here, gpt-4o-mini for cost-effectiveness
      messages: [{ role: "user", content: prompt }],
    });

    const repairInstructions = response.choices[0].message.content.trim();

    res.json({
      message: "Repair instructions generated successfully",
      repairInstructions: repairInstructions,
    });
  } catch (error) {
    console.error("Error generating repair instructions:", error);
    res.status(500).json({ error: "Failed to generate instructions" });
  }
});

module.exports = router;
