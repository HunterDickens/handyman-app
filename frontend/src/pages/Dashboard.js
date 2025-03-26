import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          setProjects(response.data.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
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

  // display a name 
  const userName = user?.email || "User";

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="menu-icon">≡</div>
          <h2 className="dashboard-title">Welcome, {userName}</h2>
          <p className="dashboard-subtitle">Here's a quick look at your projects</p>
        </div>

        {/* Removed the View Projects button, kept only logout */}
        <div className="dashboard-buttons">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h3 className="projects-heading">Repair Projects</h3>
        <div className="project-grid">
          {/* New Project "+" box goes to /projects */}
          <div
            className="project-box new-project"
            onClick={() => navigate("/projects")}
          >
            +
          </div>

          {projects.length > 0 ? (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="project-box"
                onClick={() => navigate(`/projects/${proj.id}`)}
                title={proj.title}
              >
                {proj.title}
              </div>
            ))
          ) : (
            <p style={{ color: "#9ca3af" }}>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
