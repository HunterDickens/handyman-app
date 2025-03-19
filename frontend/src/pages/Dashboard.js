import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext"; // Importing the useAuth hook
import axios from "axios";
import ProjectTabs from "../components/projectsTabs";
import { Button } from "@mui/material";
import CreateProjectModal from "../components/createProjectModal";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth(); // Accessing the user, loading, and logout from the context
  const [projects, setProjects] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.get(
            "http://localhost:5000/api/projects",
            {
              headers: { Authorization: `Bearer ${idToken}` },
            }
          );
          setProjects(response.data.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    if (user) {
      fetchProjects();
    } else {
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout(); // Use the logout method from the AuthContext
    navigate("/login");
  };

  const handleCreateProject = async (newProject, resetForm) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      // Send the new project data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        { ...newProject, materials: newProject.materials.split(",") },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Add the new project to the local state
      setProjects((prevProjects) => [
        ...prevProjects,
        { ...newProject, id: response.data.id, status: "in-progress" },
      ]);
      resetForm();
      setIsCreateModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Welcome to Your Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading user data...</p>
      ) : user ? (
        <p className="text-center">
          Logged in as: <strong>{user.email}</strong>
        </p>
      ) : (
        <p className="text-center text-danger">Error fetching user data</p>
      )}

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Add a button to open the Create Project Modal */}
      <div className="mt-4 d-flex justify-content-center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Project
        </Button>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/projects")}
        >
          View Projects
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mt-4">
        <h4>Your Repair Projects</h4>
      </div>
      <ProjectTabs key={projects.length} projectsData={projects} />

      {/* Render the Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default Dashboard;
