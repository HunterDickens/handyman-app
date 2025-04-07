import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../authContext/authContext";
import GradeIcon from "@mui/icons-material/Grade";

import styles from "./SideBar.module.css";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const SideBarItems = [
    {
      name: "Profile",
      icon: <PersonIcon />,
      navigate: "/profile",
    },
    {
      name: "Try our new Assistant",
      icon: <GradeIcon />,
      navigate: "/assistant",
    },

    { name: "Logout", icon: <LogoutIcon />, handleLogout },
  ];
  const navigate = useNavigate();

  const DrawerList = (
    <Box
      sx={{ width: 250, color: "white" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      className={styles.box}
    >
      <Divider />
      <List>
        {SideBarItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ color: "white" }}
              onClick={
                item.handleLogout
                  ? handleLogout
                  : () => {
                      navigate(item.navigate);
                    }
              }
            >
              <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon sx={{ color: "white" }} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default SideBar;
