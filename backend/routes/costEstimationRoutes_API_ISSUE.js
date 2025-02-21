require("dotenv").config();
const express = require("express");
const axios = require("axios"); // ✅ Use axios for API requests

const router = express.Router();

const fetchHomeDepotPrice = async (material) => {
    try {
      console.log(`Fetching price for: ${material}`); // ✅ Debugging output
  
      const response = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "google", // ✅ Use Google Search API
          q: material + " site:homedepot.com", // ✅ Restrict search to Home Depot
          tbm: "shop", // ✅ Search in Shopping Tab
          hl: "en",
          gl: "us",
          api_key: process.env.SERPAPI_API_KEY, // ✅ Ensure API key is passed
        },
      });
  
      console.log("SerpApi Full Response:", JSON.stringify(response.data, null, 2)); // ✅ Log full response
  
      if (!response.data.shopping_results || response.data.shopping_results.length === 0) {
        console.error(`No price data found for ${material}`);
        return null;
      }
  
      const product = response.data.shopping_results[0]; // ✅ Get the first product result
      const price = product?.price ? parseFloat(product.price.replace(/[^0-9.]/g, "")) : null;
  
      if (price) {
        console.log(`Price for ${material}: $${price}`); // ✅ Debugging output
      }
  
      return price || null;
    } catch (error) {
      console.error(`Error fetching price for ${material}:`, error.response?.data || error.message);
      return null;
    }
  };
  

// ✅ Calculate total DIY cost based on Home Depot prices
const calculateDIYCost = async (materials) => {
  let totalCost = 0;
  for (const material of materials) {
    const price = await fetchHomeDepotPrice(material);
    if (price) totalCost += price;
  }
  return totalCost;
};

// ✅ Estimate contractor cost
const getContractorEstimate = (detectedIssues) => {
  const baseCost = 100;
  const complexityMultiplier = detectedIssues.length * 25;
  return baseCost + complexityMultiplier;
};

// ✅ Route: Estimate repair costs with real-time Home Depot pricing
router.post("/estimate-cost", async (req, res) => {
  try {
    console.log("Received request:", req.body); // ✅ Debugging output

    const { detectedIssues, materials } = req.body;

    if (!detectedIssues || !materials || !Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ error: "Missing or invalid detected issues or materials" });
    }

    const diyCost = await calculateDIYCost(materials);
    const contractorCost = getContractorEstimate(detectedIssues);

    res.json({
      message: "Cost estimation successful",
      diyCost: diyCost || "Could not estimate DIY cost",
      contractorCost,
    });
  } catch (error) {
    console.error("Error estimating cost:", error);
    res.status(500).json({ error: "Failed to estimate cost" });
  }
});

module.exports = router;
