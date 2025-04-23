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

    if (!detectedIssues) {
      console.error("Missing detected issues");
      return res.status(400).json({ error: "Detected issues are required" });
    }
    
    console.log("Sending request to OpenAI...");

    // Build the prompt with or without the image
    const prompt = `Generate step-by-step repair instructions for fixing a ${detectedIssues.join(", ")}.${
      imageUrl ? ` The user uploaded an image of the problem here: ${imageUrl}.` : ""
    } Provide detailed instructions including required tools and materials.`;
    

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response received:", JSON.stringify(response, null, 2));

if (!response.choices || response.choices.length === 0) {
  console.error("Invalid response from OpenAI", response);
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

// Generate specific repair instructions for a project
router.post("/generate-instructions/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid
    console.log("Request received:", req.body); 
    console.log("From: ", userId);

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();
    const { detectedIssues, imageUrl } = req.body;

    if (!detectedIssues) {
      console.error("Missing detected issues");
      return res.status(400).json({ error: "Detected issues are required" });
    }

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.visibility !== "public") {
      if (projectData.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized access." });
      }
    }
    
    console.log("Sending request to OpenAI...");

    // Build the prompt with or without the image
    const prompt = `Generate step-by-step repair instructions for the project titled "${projectData.title}". 
    The project description is: "${projectData.description}". 
    The materials provided are: ${projectData.materials.join(", ")}. 
    Provide detailed instructions including required tools, materials, and steps.`;
    

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response received:", JSON.stringify(response, null, 2));

if (!response.choices || response.choices.length === 0) {
  console.error("Invalid response from OpenAI", response);
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
