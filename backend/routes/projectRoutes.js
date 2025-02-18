const express = require("express");
const { db } = require("../firebase/firebaseAdmin");
const { verifyFirebaseToken } = require("../middleware/authMiddleware"); 

const router = express.Router();

// **1️⃣ Create a New Repair Project**
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, description, materials } = req.body;
    const userId = req.user.uid; // Get user ID from token

    if (!title) {
      return res.status(400).json({ error: "Project title is required" });
    }
    
    const newProject = {
        title,
        description: description || "",
        materials: materials || [],
        userId,
        status: "in-progress",
        createdAt: new Date(),
        images: [], // ✅ Store image URLs here
      };
      

    const projectRef = await db.collection("projects").add(newProject);

    res.status(201).json({ message: "Project created", id: projectRef.id });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// **2️⃣ Get All Projects for a User**
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const projectsSnapshot = await db
      .collection("projects")
      .where("userId", "==", userId)
      .get();

    const projects = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// **3️⃣ Update a Project Status**
router.patch("/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    const userId = req.user.uid;

    if (!["in-progress", "completed", "abandoned"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists || project.data().userId !== userId) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }

    await projectRef.update({ status });

    res.status(200).json({ message: "Project updated" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// **4️⃣ Delete a Project**
router.delete("/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists || project.data().userId !== userId) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }

    await projectRef.delete();

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
