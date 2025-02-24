import React, { useState } from "react";
import ProjectsList from "../components/ProjectList";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const Dashboard = (props) => {
  const [value, setValue] = useState("projects");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabContent = {
    projects: <ProjectsList />,
    profile: <p>Your profile content goes here.</p>,
    materials: <p>Your materials content goes here.</p>,
  };

  return (
    <>
      <h2>Dashboard</h2>

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {Object.keys(tabContent).map((key) => (
            <Tab
              key={key}
              value={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </Tabs>
        <Box sx={{ p: 2 }}>{tabContent[value]}</Box>
      </Box>
    </>
  );
};

export default Dashboard;
