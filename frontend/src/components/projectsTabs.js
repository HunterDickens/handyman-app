import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ProjectCard from "./ProjectCard";
import axios from "axios";
import { auth } from "../firebase";
import styles from "./projectsTabs.module.css";

const ProjectTabs = ({ projectsData }) => {
  // <-- Fix here, correctly destructure
  const [value, setValue] = useState("1");
  const [projects, setProjects] = useState(projectsData); // <-- Ensure projects state is initialized

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();

        const response = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        setProjects(response.data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const inProgressList = projects.filter(
    (project) => project.status === "in-progress"
  );
  const completedList = projects.filter(
    (project) => project.status === "completed"
  );
  const abandonedList = projects.filter(
    (project) => project.status === "abandoned"
  );

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box className={styles.contentBox}>
          <TabList
            centered
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab label="In Progress" value="1" />
            <Tab label="Completed" value="2" />
            <Tab label="Abandoned" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1" className={styles.tabPanel}>
          <div className={styles["project-grid"]}>
            <ProjectCard list={inProgressList} setProjects={setProjects} />
          </div>
        </TabPanel>
        <TabPanel value="2" className={styles.tabPanel}>
          <div className={styles["project-grid"]}>
            <ProjectCard list={completedList} setProjects={setProjects} />
          </div>
        </TabPanel>
        <TabPanel value="3" className={styles.tabPanel}>
          <div className={styles["project-grid"]}>
            <ProjectCard list={abandonedList} setProjects={setProjects} />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProjectTabs;
