import React, { useState } from "react";
import { Button } from "@mui/material";
import CreateProjectModal from "./createProjectModal";

const CreateProjectButton = ({
  title,
  onProjectCreated,
  projectId,
  variant = "contained",
  color = "primary",
  card,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {card ? (
        <div></div>
      ) : (
        <Button variant={variant} color={color} onClick={handleOpen}>
          {title}
        </Button>
      )}

      <CreateProjectModal
        open={isOpen}
        onClose={handleClose}
        title={title}
        onProjectCreated={() => {
          onProjectCreated?.();
          handleClose();
        }}
        projectId={projectId}
      />
    </>
  );
};

export default CreateProjectButton;
