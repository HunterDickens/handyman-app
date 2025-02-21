const express = require("express");
const router = express.Router();

// Mock data for material costs (Replace with real API in future)
const materialCosts = {
  "Adjustable wrench": 15,
  "Screwdriver": 5,
  "Pliers": 7,
  "O-rings": 3,
  "Plumber's grease": 5,
  "Teflon tape": 2,
  "Pipe sealant": 8,
  "Copper pipe": 20,
  "PVC pipe": 10,
  "Electrical tape": 3,
  "Wire connectors": 4,
  "Light switch": 12,
  "Drywall patch": 10,
  "Spackle": 7,
};

// Helper function to calculate DIY cost
const calculateDIYCost = (materials) => {
  let totalCost = 0;
  materials.forEach((material) => {
    if (materialCosts[material]) {
      totalCost += materialCosts[material];
    }
  });
  return totalCost;
};

// Generate contractor estimate (simple mock pricing)
const getContractorEstimate = (detectedIssues) => {
  // Base cost + complexity multiplier
  const baseCost = 100;
  const complexityMultiplier = detectedIssues.length * 20;
  return baseCost + complexityMultiplier;
};

// Route to estimate repair costs
router.post("/estimate-cost", async (req, res) => {
  try {
    const { detectedIssues, materials } = req.body;

    if (!detectedIssues || !materials) {
      return res.status(400).json({ error: "Missing detected issues or materials" });
    }

    const diyCost = calculateDIYCost(materials);
    const contractorCost = getContractorEstimate(detectedIssues);

    res.json({
      message: "Cost estimation successful",
      diyCost,
      contractorCost,
    });
  } catch (error) {
    console.error("Error estimating cost:", error);
    res.status(500).json({ error: "Failed to estimate cost" });
  }
});

module.exports = router;
