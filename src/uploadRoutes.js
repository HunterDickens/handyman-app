const express = require("express");
const multer = require("multer");
const { bucket } = require("./firebaseAdmin");

const router = express.Router();

// ✅ Ensure Multer accepts PNG, JPG, JPEG images
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

// **Image Upload Route**
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Received request for file upload"); // ✅ Log incoming request

    if (!req.file) {
      console.error("No file received"); // ✅ Log missing file
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname, req.file.mimetype);

    const file = req.file;
    const filename = `uploads/${Date.now()}-${file.originalname}`;

    // Upload file to Firebase Storage
    const fileRef = bucket.file(filename);
    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // Get public download URL
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    console.log("File uploaded successfully:", downloadURL);

    res.json({ message: "File uploaded successfully", imageUrl: downloadURL });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
