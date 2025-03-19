import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditProjectModal from "./editProjectModal";
import ConfirmationModal from "./confirmationModal"; // Import the new modal
import axios from "axios";
import { auth } from "../firebase";
import Button from "@mui/material/Button";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ProjectList = ({ list, setProjects }) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState(null);

  if (typeof setProjects !== "function") {
    console.error("setProjects is undefined or not a function.");
    return null; // Prevent rendering if setProjects is missing
  }

  const handleUpdateProject = async (updatedProject) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const payload = {
        title: updatedProject.title,
        description: updatedProject.description,
        status: updatedProject.status,
      };

      const response = await axios.patch(
        `http://localhost:5000/api/projects/${updatedProject.id}`,
        payload,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      console.log("Update successful:", response.data.project);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === updatedProject.id ? { ...p, ...response.data.project } : p
        )
      );
    } catch (err) {
      console.error(
        "Error updating project:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      await axios.delete(
        `http://localhost:5000/api/projects/${projectToDelete.id}`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Remove the deleted project from the local state
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));

      // Close the modal and reset the project to delete
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error(
        "Error deleting project:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Demo>
        <List>
          {list.map((project) => (
            <ListItem key={project.id}>
              <ListItemText primary={project.title} />
              <ListItemText secondary={project.description} />
              <ListItemText secondary={project.materials} />
              <EditProjectModal
                data={project}
                onUpdateProject={handleUpdateProject}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteClick(project)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </Demo>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </Box>
  );
};

export default ProjectList;
