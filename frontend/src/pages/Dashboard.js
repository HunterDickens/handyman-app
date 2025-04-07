import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import ProjectTabs from "../components/projectsTabs";
import CreateProjectButton from "../components/CreateProjectButton";
import SideBar from "../components/SideBar";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [projects, setProjects] = useState([]);
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

  const refreshProjects = async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const response = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      }
    }
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-card"]}>
        <div className={styles["dashboard-header"]}>
          <div className={styles.iconContainer}>
            <SideBar />
          </div>
          <h2 className={styles["dashboard-title"]}>
            Welcome, {user?.email || "User"}
          </h2>
          <p className={styles["dashboard-subtitle"]}>
            Here's a quick look at your projects
          </p>
        </div>
        {loading ? (
          <p className={styles["text-center"]}>Loading user data...</p>
        ) : user ? (
          <p className={styles["text-center"]}>
            Logged in as: <strong>{user.email}</strong>
          </p>
        ) : (
          <p className={styles["text-center text-danger"]}>
            Error fetching user data
          </p>
        )}
        <div className="mt-4 d-flex justify-content-center">
          <CreateProjectButton
            onProjectCreated={refreshProjects}
            title="+ New Project"
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
