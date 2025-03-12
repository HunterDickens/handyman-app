import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ProjectList from "./projectsList";

const ProjectTabs = (projectsData) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const inProgressList = Object.entries(projectsData.projectsData)
    .filter(([key, project]) => project.status === "in-progress")
    .map(([key, project]) => project);

  const completedList = Object.entries(projectsData.projectsData)
    .filter(([key, project]) => project.status === "completed")
    .map(([key, project]) => project);

  const abandonedList = Object.entries(projectsData.projectsData)
    .filter(([key, project]) => project.status === "abandoned")
    .map(([key, project]) => project);

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
          <ProjectList list={inProgressList} />
        </TabPanel>
        <TabPanel value="2">
          <ProjectList list={completedList} />
        </TabPanel>
        <TabPanel value="3">
          <ProjectList list={abandonedList} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProjectTabs;
