import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ProjectList from "./projectsList";
import axios from "axios";
import { auth } from "../firebase";

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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="In Progress" value="1" />
            <Tab label="Completed" value="2" />
            <Tab label="Abandoned" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ProjectList list={inProgressList} setProjects={setProjects} />
        </TabPanel>
        <TabPanel value="2">
          <ProjectList list={completedList} setProjects={setProjects} />
        </TabPanel>
        <TabPanel value="3">
          <ProjectList list={abandonedList} setProjects={setProjects} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProjectTabs;
