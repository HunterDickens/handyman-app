import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import "./Dashboard.css";

// ✅ Load API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("❌ REACT_APP_API_URL is not defined. Backend connection required.");
}

const PublicDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Ensure user is logged in
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      if (!user) {
        setError("You must be logged in to view public projects.");
        setLoadingProjects(false);
        return;
      }

      try {
        const idToken = await user.getIdToken(); // Get the user's ID token
        const response = await axios.get(`${API_URL}/api/projects/public`, {
          headers: { Authorization: `Bearer ${idToken}` }, // Pass the token
        });
        setProjects(response.data.projects);
        setLoadingProjects(false);
      } catch (error) {
        console.error("Error fetching public projects:", error);
        setError("Failed to load public projects.");
        setLoadingProjects(false);
      }
    };

    fetchPublicProjects();
  }, [user]); // Fetch public projects when the user is available

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="menu-icon">≡</div>
          <h2 className="dashboard-title">Public Projects</h2>
          <p className="dashboard-subtitle">
            Explore projects shared by others
          </p>
        </div>
        {loading || loadingProjects ? (
          <p className="text-center">Loading public projects...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : projects.length > 0 ? (
          <div className="projects-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>
                  <strong>Owner:</strong> {project.ownerEmail || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No public projects available.</p>
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;