import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Instructions = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="text-center">Project Instructions</h2>
      <p className="text-muted text-center">Instructions for project ID: {id}</p>
      <p className="text-center">This page is under development. Instructions will be available soon.</p>
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate("/projects")}>← Back to Projects</Button>
      </div>
    </div>
  );
};

export default Instructions;
