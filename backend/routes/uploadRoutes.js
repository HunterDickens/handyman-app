const express = require("express");
const multer = require("multer");
const { bucket } = require("../firebase/firebaseAdmin");

const router = express.Router();

// ✅ Configure Multer to accept PNG, JPG, JPEG images
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

// ✅ Image Upload Route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Received request for file upload"); // ✅ Log request

    if (!req.file) {
      console.error("No file received"); // ✅ Log missing file
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname, req.file.mimetype);

    const file = req.file;
    const filename = `uploads/${Date.now()}-${file.originalname}`;

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
      await fileRef.makePublic(); // Make the file public

      // Generate public download URL
      const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      console.log("File uploaded successfully:", downloadURL);

      res.json({ message: "File uploaded successfully", imageUrl: downloadURL });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
