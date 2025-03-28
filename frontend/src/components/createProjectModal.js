import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { auth } from "../firebase";
import styles from "./modal.module.css";

const CreateProjectModal = ({
  open,
  onClose,
  parentProjectId = null,
  onProjectCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [error, setError] = useState("");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const newProject = {
        title,
        description,
        materials: materials.split(","),
        parentProjectId,
      };

      const response = await axios.post(
        "http://localhost:5000/api/projects",
        newProject,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      console.log("Project created successfully:", response.data);
      resetForm();
      onClose();
      if (onProjectCreated) {
        onProjectCreated(); // Call the refresh function
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMaterials("");
    setError("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={styles.modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {parentProjectId ? "Create Subproject" : "Create New Project"}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleCreateProject}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Materials (comma-separated)"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {parentProjectId ? "Create Subproject" : "Create Project"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
