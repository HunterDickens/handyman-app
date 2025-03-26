import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import ProjectTabs from "../components/projectsTabs";
import CreateProjectButton from "../components/CreateProjectButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState("");

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
          setError("Failed to load projects.");
        }
      }
    };

    if (user) {
      fetchProjects();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const refreshProjects = async () => {
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
        setError("Failed to load projects.");
      }
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

      <div className="mt-4 d-flex justify-content-center">
        <CreateProjectButton
          isOpen={isCreateModalOpen}
          onOpen={() => setIsCreateModalOpen(true)}
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreated={refreshProjects}
          title={"+ New Project"}
        />
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/projects")}
        >
          View Projects
        </button>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="mt-4">
        <h4>Your Repair Projects</h4>
      </div>
      <ProjectTabs key={projects.length} projectsData={projects} />
    </div>
  );
};

export default Dashboard;
