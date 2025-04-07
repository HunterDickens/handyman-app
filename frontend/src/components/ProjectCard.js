import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import EditProjectModal from "./editProjectModal";
import ConfirmationModal from "./confirmationModal"; // Import the new modal
import Button from "@mui/material/Button";

import styles from "./projectCard.module.css";

// ✅ Load API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

const ProjectCard = ({ list, setProjects }) => {
  const navigate = useNavigate();
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
        `${API_URL}/api/projects/${updatedProject.id}`,
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
        `${API_URL}/api/projects/${projectToDelete.id}`,
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
    <>
      {list.map((project) => (
        <div className={styles["project-box"]}>
          <Card
            key={project.id}
            sx={{ maxWidth: 345 }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <CardMedia
              sx={{ height: 100 }}
              // image="/static/images/cards/contemplative-reptile.jpg"
              title={project.title}
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {project.title}
              </Typography>
              <Typography variant="body2" className={styles.secondary}>
                {project.description}
              </Typography>
            </CardContent>
            <CardActions onClick={(e) => e.stopPropagation()}>
              <EditProjectModal
                title={"Edit Project"}
                data={project}
                onUpdateProject={handleUpdateProject}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteClick(project);
                }}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </div>
      ))}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </>
  );
};

export default ProjectCard;
