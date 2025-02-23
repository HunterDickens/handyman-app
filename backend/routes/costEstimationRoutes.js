require("dotenv").config();
const express = require("express");

const router = express.Router();

// ✅ Predefined price list for common materials (Can be expanded)
const materialPrices = {
  "hammer": 12.99,
  "screwdriver": 7.50,
  "drywall": 15.00,
  "paint": 25.99,
  "plywood": 30.00,
  "caulk": 8.99,
  "nails": 4.50,
};

// ✅ Function to get the price of a material
const getMaterialPrice = (material) => {
  // Normalize the material name (lowercase, trim spaces)
  const normalizedMaterial = material.toLowerCase().trim();

  // Return predefined price if available
  if (materialPrices[normalizedMaterial]) {
    console.log(`Found price for ${normalizedMaterial}: $${materialPrices[normalizedMaterial]}`);
    return materialPrices[normalizedMaterial];
  }

  // ✅ If material is not found, estimate a price dynamically
  const estimatedPrice = Math.random() * (50 - 5) + 5; // Generate a random price between $5 and $50
  console.log(`Estimated price for ${normalizedMaterial}: $${estimatedPrice.toFixed(2)}`);

  // Store the new material price dynamically
  materialPrices[normalizedMaterial] = estimatedPrice;
  return estimatedPrice;
};

// ✅ Calculate total DIY cost
const calculateDIYCost = (materials) => {
  return materials.reduce((total, material) => total + getMaterialPrice(material), 0);
};

// ✅ Estimate contractor cost
const getContractorEstimate = (detectedIssues) => {
  const baseCost = 100;
  const complexityMultiplier = detectedIssues.length * 25;
  return baseCost + complexityMultiplier;
};

// ✅ Route: Estimate repair costs dynamically
router.post("/estimate-cost", (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { detectedIssues, materials } = req.body;

    if (!detectedIssues || !materials || !Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ error: "Missing or invalid detected issues or materials" });
    }

    const diyCost = calculateDIYCost(materials);
    const contractorCost = getContractorEstimate(detectedIssues);

    res.json({
      message: "Cost estimation successful",
      diyCost: parseFloat(diyCost.toFixed(2)), // Round to 2 decimal places
      contractorCost,
    });
  } catch (error) {
    console.error("Error estimating cost:", error);
    res.status(500).json({ error: "Failed to estimate cost" });
  }
});

module.exports = router;
