const express = require("express");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const { bucket } = require("../firebase/firebaseAdmin");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Initialize Google Vision Client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ensure it's correctly set in .env
});


// ✅ Configure Multer for Image Uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, and JPEG files are allowed"), false);
    }
    cb(null, true);
  },
});

// ✅ Upload Image & Diagnose Issues
router.post("/", verifyFirebaseToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Received image for diagnosis:", req.file.originalname);

    const file = req.file;
    const filename = `diagnostics/${Date.now()}-${file.originalname}`;

    // Upload file to Firebase Storage
    const fileRef = bucket.file(filename);
    const stream = fileRef.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    stream.on("error", (err) => {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: "Failed to upload image" });
    });

    stream.on("finish", async () => {
      await fileRef.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      console.log("Image uploaded successfully:", imageUrl);

      // ✅ Send Image to Google Vision API
      const [result] = await client.labelDetection(imageUrl);
      const labels = result.labelAnnotations.map((label) => label.description);

      console.log("AI Detected Issues:", labels);

      res.json({
        message: "Image analyzed successfully",
        imageUrl: imageUrl,
        detectedIssues: labels,
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("AI Diagnosis Error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

module.exports = router;
