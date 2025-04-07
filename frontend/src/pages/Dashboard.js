import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import ProjectTabs from "../components/projectsTabs";
import CreateProjectButton from "../components/CreateProjectButton";
import "./Dashboard.css";

// ✅ Load API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await axios.get(`${API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      }
    };

    if (user) {
      fetchProjects();
    } else if (!loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const refreshProjects = async () => {
    try {
      const idToken = await user?.getIdToken();
      const response = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error refreshing projects:", error);
      setError("Failed to refresh projects.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="menu-icon">≡</div>
          <h2 className="dashboard-title">Welcome, {user?.email || "User"}</h2>
          <p className="dashboard-subtitle">
            Here's a quick look at your projects
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading user data...</p>
        ) : user ? (
          <p className="text-center">
            Logged in as: <strong>{user.email}</strong>
          </p>
        ) : (
          <p className="text-center text-danger">Error fetching user data</p>
        )}

        <div className="dashboard-buttons">
          <button className="btn-logout" onClick={handleLogout}>
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
            mode="project"
          />
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <h3 className="projects-heading">Repair Projects</h3>

        <ProjectTabs key={projects.length} projectsData={projects} />
      </div>
    </div>
  );
};

export default Dashboard;
