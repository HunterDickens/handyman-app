import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";  // Importing the useAuth hook
import axios from "axios";
import ProjectTabs from "../components/projectsTabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();  // Accessing the user, loading, and logout from the context
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
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout(); // Use the logout method from the AuthContext
    navigate("/login");
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
      <ProjectTabs projectsData={projects} />
    </div>
  );
};

export default Dashboard;
