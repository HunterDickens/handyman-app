const express = require("express");
const multer = require("multer");
const { bucket, db, admin } = require("../firebase/firebaseAdmin");
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

// ✅ Upload Image for a Project
router.post("/projects/:projectId/upload", verifyFirebaseToken, upload.single("image"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const filename = `projects/${userId}/${projectId}/${Date.now()}-${file.originalname}`;

    const fileRef = bucket.file(filename);
    
    await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } });
    await fileRef.makePublic();

    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists || project.data().userId !== userId) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }

    await projectRef.update({
      images: admin.firestore.FieldValue.arrayUnion(downloadURL),
    });

    res.json({ message: "Image uploaded successfully", imageUrl: downloadURL });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// ✅ Upload Image for a Subproject
router.post("/projects/:projectId/subprojects/:subprojectId/upload", verifyFirebaseToken, upload.single("image"), async (req, res) => {
  try {
    const { projectId, subprojectId } = req.params;
    const userId = req.user.uid;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const filename = `projects/${userId}/${projectId}/subprojects/${subprojectId}/${Date.now()}-${file.originalname}`;
    const fileRef = bucket.file(filename);
    
    await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } });
    await fileRef.makePublic();

    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists || project.data().userId !== userId) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }

    let updatedSubprojects = project.data().subprojects || [];
    let subprojectIndex = updatedSubprojects.findIndex(sp => sp.id === subprojectId);

    if (subprojectIndex === -1) {
      return res.status(404).json({ error: "Subproject not found." });
    }

    updatedSubprojects[subprojectIndex].images = [
      ...(updatedSubprojects[subprojectIndex].images || []),
      downloadURL,
    ];

    await projectRef.update({ subprojects: updatedSubprojects });

    res.json({ message: "Subproject image uploaded", imageUrl: downloadURL });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// **Update User Profile Picture**
router.patch("/update-profile-picture", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Get user ID from verified token
    const { profilePictureUrl } = req.body; // Get new profile picture URL from request body

    if (!profilePictureUrl) {
      return res.status(400).json({ error: "Profile picture URL is required" });
    }

    // Update the user's profile picture in Firestore
    await db.collection("users").doc(userId).set(
      {
        pfp: profilePictureUrl, // Update the 'pfp' field
      },
      { merge: true } // Merge with existing fields
    );

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Profile Picture Update Error:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});



module.exports = router;
