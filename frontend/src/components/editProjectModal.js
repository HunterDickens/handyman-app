import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import UpdateProjectDetails from "./updateProjectDetails"; // Import new component
import styles from "./modal.module.css";

const ProjectModal = ({ data, onUpdateProject }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="success"
        style={{ minWidth: "88px" }}
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Project
          </Typography>
          <UpdateProjectDetails
            project={data}
            onUpdateProject={onUpdateProject}
            onClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ProjectModal;
