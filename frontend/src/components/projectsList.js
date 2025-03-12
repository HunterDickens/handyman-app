import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ProjectList = ({ list }) => {
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>

      <Demo>
        <List>
          {list.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Demo>
    </Box>
  );
};

export default ProjectList;
