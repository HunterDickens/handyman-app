const express = require("express");
const multer = require("multer");
const { bucket, db, admin } = require("../firebase/firebaseAdmin"); // ✅ Import admin

const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const router = express.Router();

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

// ✅ Upload Image and Link to a Project
router.post("/:projectId", verifyFirebaseToken, upload.single("image"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid; // Get user ID from token

    console.log("Received request to upload image for project:", projectId);

    // Validate file
    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname, req.file.mimetype);

    const file = req.file;
    const filename = `projects/${userId}/${projectId}/${Date.now()}-${file.originalname}`;

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

      // Generate public download URL
      const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      console.log("File uploaded successfully:", downloadURL);

      // ✅ Update Firestore: Add Image URL to the Project
      const projectRef = db.collection("projects").doc(projectId);
      const project = await projectRef.get();

      if (!project.exists || project.data().userId !== userId) {
        return res.status(404).json({ error: "Project not found or unauthorized" });
      }

      // ✅ Fix: Use `admin.firestore.FieldValue.arrayUnion`
      await projectRef.update({
        images: admin.firestore.FieldValue.arrayUnion(downloadURL),
      });

      res.json({ message: "Image uploaded successfully", imageUrl: downloadURL });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
