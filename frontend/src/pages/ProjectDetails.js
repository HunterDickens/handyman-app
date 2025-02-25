/* import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button } from "react-bootstrap";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();

        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to fetch project.");
      }
    };

    fetchProject();
  }, [projectId]);

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (!project) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">{project.title}</h2>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Materials: {project.materials.join(", ")}</p>
      <div>
        {project.images.map((image, index) => (
          <img key={index} src={image} alt={`Project ${index}`} className="img-fluid" />
        ))}
      </div>
      <Button variant="primary" onClick={() => window.history.back()}>Back</Button>
    </div>
  );
};

export default ProjectDetails; */