const express = require("express");
const { db, admin } = require("../firebase/firebaseAdmin");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Create a New Project
 */
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, description, materials } = req.body;
    const userId = req.user.uid;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const formattedMaterials = Array.isArray(materials)
      ? materials.map((m) => m.trim())
      : typeof materials === "string"
      ? materials.split(",").map((m) => m.trim())
      : [];

    const newProject = {
      title,
      description,
      materials: formattedMaterials,
      userId,
      createdAt: admin.firestore.Timestamp.now(),
      subprojects: [], // ✅ Ensure subprojects is an array at creation
        subprojects: [], // Store references to subprojects here
    };

    const projectRef = await db.collection("projects").add(newProject);
    const project = await projectRef.get();

    console.log("✅ Project Created:", project.id);
    res.status(201).json({ id: project.id, ...project.data() });
  } catch (error) {
    console.error("🔥 Error creating project:", error);
    res.status(500).json({ error: "Failed to create project." });
  }
});

/**
 * ✅ Update a Project (Change Status or Edit Details)
 */
/**
 * ✅ Update a Project (Change Status or Edit Details)
 */
router.patch("/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;
    const updateData = req.body; // Can include status, title, description, etc.

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    // ✅ Only update fields that are provided in the request
    await projectRef.update(updateData);

    console.log(`✅ Project Updated: ${projectId}`);
    res.status(200).json({ message: "Project updated successfully." });
  } catch (error) {
    console.error("🔥 Error updating project:", error);
    res.status(500).json({ error: "Failed to update project." });
  }
});
/**
 * ✅ Delete a Project
 */
router.delete("/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    // ✅ Delete the project
    await projectRef.delete();

    console.log(`✅ Project Deleted: ${projectId}`);
    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("🔥 Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project." });
  }
});


/**
 * ✅ Add a Subproject
 */
router.post("/:projectId/subprojects", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;
    const userId = req.user.uid;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Subproject title is required." });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      console.log("🚨 Project not found:", projectId);
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    // ✅ Ensure subprojects field exists
    if (!Array.isArray(projectData.subprojects)) {
      await projectRef.update({ subprojects: [] });
    }

    // ✅ Create subproject object
    const subproject = {
      id: new Date().getTime().toString(),
      title,
      status: "in-progress",
      createdAt: admin.firestore.Timestamp.now(),
    };

    // ✅ Update Firestore with new subproject
    await projectRef.update({
      subprojects: admin.firestore.FieldValue.arrayUnion(subproject),
    });

    console.log("✅ Subproject Added:", subproject);
    res.status(201).json({ message: "Subproject added.", subproject });
  } catch (error) {
    console.error("🔥 Error adding subproject:", error);
    res.status(500).json({ error: "Failed to add subproject." });
  }
});

// **Add a Subproject to an Existing Project**
router.post("/:projectId/subprojects", verifyFirebaseToken, async (req, res) => {
  
});

/**
 * ✅ Get All Projects for a User
 */
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const projectsSnapshot = await db
      .collection("projects")
      .where("userId", "==", userId)
      .get();

    if (projectsSnapshot.empty) {
      return res.status(200).json({ projects: [] });
    }

    const projects = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ projects });
  } catch (error) {
    console.error("🔥 Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});
/**
 * ✅ Update a Subproject (e.g., Mark as Completed)
 */
router.patch("/:projectId/subprojects/:subprojectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId, subprojectId } = req.params;
    const { title, status } = req.body; // Accept updates to title or status
    const userId = req.user.uid;

    if (!["in-progress", "completed", "abandoned"].includes(status)) {   //** Need to have this as a pop up so that user can update project */
      return res.status(400).json({ error: "Invalid status" });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    let subprojects = projectData.subprojects || [];
    const subprojectIndex = subprojects.findIndex((sp) => sp.id === subprojectId);

    if (subprojectIndex === -1) {
      return res.status(404).json({ error: "Subproject not found." });
    }

    // ✅ Update subproject fields only if provided in the request
    if (title) subprojects[subprojectIndex].title = title;
    if (status) subprojects[subprojectIndex].status = status;

    await projectRef.update({ subprojects });

    console.log(`✅ Subproject Updated: ${subprojectId}`);
    res.status(200).json({ message: "Subproject updated successfully.", subprojects });
  } catch (error) {
    console.error("🔥 Error updating subproject:", error);
    res.status(500).json({ error: "Failed to update subproject." });
  }
});

/**
 * ✅ Get a Single Project by ID
 */
router.get("/:projectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    res.status(200).json({ project: { id: project.id, ...projectData } });
  } catch (error) {
    console.error("🔥 Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project details." });
  }
});

/**
 * ✅ Delete a Subproject
 */
router.delete("/:projectId/subprojects/:subprojectId", verifyFirebaseToken, async (req, res) => {
  try {
    const { projectId, subprojectId } = req.params;
    const userId = req.user.uid;

    const projectRef = db.collection("projects").doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = project.data();
    if (projectData.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    const updatedSubprojects = projectData.subprojects
      ? projectData.subprojects.filter((sp) => sp.id !== subprojectId)
      : [];

    await projectRef.update({
      subprojects: updatedSubprojects,
    });

    console.log("✅ Subproject Deleted:", subprojectId);
    res.status(200).json({ message: "Subproject deleted.", subprojects: updatedSubprojects });
  } catch (error) {
    console.error("🔥 Error deleting subproject:", error);
    res.status(500).json({ error: "Failed to delete subproject." });
  }
});

module.exports = router;
