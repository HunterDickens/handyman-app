const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { OpenAI } = require("openai");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp upload dir

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /repair/generate-instructions
router.post(
  "/generate-instructions",
  upload.single("image"),
  async (req, res) => {
    try {
      const { detectedIssues } = req.body;
      const imageFile = req.file;

      if (!detectedIssues || !imageFile) {
        return res
          .status(400)
          .json({ error: "Image or detected issues missing." });
      }

      // Convert image to base64
      const imagePath = imageFile.path;
      const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });

      // Construct prompt
      const prompt = `You are a home repair expert. A user uploaded an image of a household issue with the following problems: ${detectedIssues}.
Identify the problem in the image, and provide a detailed, step-by-step repair guide including tools and materials needed. Be clear and beginner-friendly.`;

      console.log("Sending request to OpenAI...");

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
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      fs.unlinkSync(imagePath); // Clean up uploaded file

      if (!response.choices || response.choices.length === 0) {
        return res.status(500).json({ error: "No response from OpenAI." });
      }

      const repairInstructions = response.choices[0].message.content.trim();

      res.json({
        message: "Repair instructions generated successfully",
        repairInstructions,
      });
    } catch (error) {
      console.error("Error generating repair instructions:", error);
      res.status(500).json({ error: "Failed to generate instructions" });
    }
  }
);

module.exports = router;
