import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Spinner, Alert, ListGroup, Image } from "react-bootstrap";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();

        console.log(`📡 Fetching project: /api/projects/${id}`);
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        setProject(response.data.project);
      } catch (err) {
        console.error("🚨 Error loading project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <div className="container mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <h2>{project?.title}</h2>
      <p>{project?.description}</p>

      {/* ✅ Project Images Section */}
      <h4>Project Images:</h4>
      {project?.images?.length > 0 ? (
        <div className="mb-3 d-flex flex-wrap">
          {project.images.map((img, i) => (
            <Image key={i} src={img} alt={`Project Image ${i}`} className="m-2" style={{ maxWidth: "300px", borderRadius: "10px" }} />
          ))}
        </div>
      ) : (
        <p>No images uploaded yet.</p>
      )}

      {/* ✅ Subprojects Section */}
      <h4>Subprojects:</h4>
      {project?.subprojects?.length > 0 ? (
        <ListGroup className="mb-3">
          {project.subprojects.map((sp) => (
            <ListGroup.Item key={sp.id} className="d-flex flex-column">
              <h6>{sp.title}</h6>

              {/* ✅ Subproject Images */}
              {sp.images?.length > 0 && (
                <div className="d-flex flex-wrap">
                  {sp.images.map((img, i) => (
                    <Image key={i} src={img} alt={`Subproject ${i}`} className="m-2" style={{ maxWidth: "200px", borderRadius: "10px" }} />
                  ))}
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No subprojects yet.</p>
      )}

      {/* ✅ Back to Projects */}
      <Button className="mt-3" onClick={() => navigate("/projects")}>
        Back to Projects
      </Button>
    </div>
  );
};

export default ProjectDetails;
