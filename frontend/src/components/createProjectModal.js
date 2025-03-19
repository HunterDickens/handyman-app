import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import styles from "./modal.module.css";

const CreateProjectModal = ({ open, onClose, onCreateProject }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { title, description, materials };
    onCreateProject(newProject, resetForm);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMaterials("");
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
          Create New Project
        </Typography>
        <form onSubmit={handleSubmit}>
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
              Create Project
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
