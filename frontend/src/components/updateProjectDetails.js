import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const UpdateProjectDetails = ({ project, onUpdateProject, onClose }) => {
  const [updatedProject, setUpdatedProject] = useState({ ...project });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdateProject(updatedProject);
    onClose(); // Close the modal after updating
  };

  return (
    <Box mt={2}>
      <TextField
        label="Title"
        name="title"
        value={updatedProject.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={updatedProject.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
      />
      <Select
        name="status"
        value={updatedProject.status}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="in-progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="abandoned">Abandoned</MenuItem>
      </Select>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProjectDetails;
