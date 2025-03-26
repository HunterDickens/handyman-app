import React from "react";
import { Button } from "@mui/material";
import CreateProjectModal from "./createProjectModal";

const CreateProjectButton = ({
  isOpen,
  onOpen,
  onClose,
  title,
  onProjectCreated,
}) => {
  return (
    <>
      <Button variant="contained" color="primary" onClick={onOpen}>
        {title}
      </Button>

      <CreateProjectModal
        open={isOpen}
        onClose={onClose}
        title={title}
        onProjectCreated={onProjectCreated}
      />
    </>
  );
};

export default CreateProjectButton;
