/*

//routes/generateInstructionsRoutes.js  /
//const express = require("express");
const { OpenAI } = require("openai"); // Correct import for OpenAI
require("dotenv").config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for generating repair instructions
router.post("/generate-instructions", async (req, res) => {
  try {
    const { detectedIssues, imageUrl } = req.body;

    if (!detectedIssues || !imageUrl) {
      return res.status(400).json({ error: "Detected issues or image URL is missing" });
    }

    const prompt = `Generate step-by-step repair instructions for fixing a ${detectedIssues.join(", ")}. The user uploaded an image of the problem here: ${imageUrl}. Provide detailed instructions that a homeowner can follow, including required tools and materials.`;

    // Make a request to OpenAI to generate the instructions
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use any available GPT model
      messages: [{ role: "system", content: prompt }],
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
*/