import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Spinner, Alert, ListGroup, Row, Col } from "react-bootstrap";
import AddSubprojectForm from "../components/AddSubprojectForm";
import UploadImage from "../components/UploadImage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [subprojects, setSubprojects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();

        const response = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );

        setProject(response.data.project);
        setSubprojects(response.data.project.subprojects || []);
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleProjectImageUpload = (imageUrl) => {
    setProject((prev) => ({
      ...prev,
      images: [...(prev?.images || []), imageUrl],
    }));
  };

  const handleSubprojectImageUpload = (subprojectId, imageUrl) => {
    setSubprojects((prev) =>
      prev.map((sp) =>
        sp.id === subprojectId
          ? { ...sp, images: [...(sp.images || []), imageUrl] }
          : sp
      )
    );
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <div className="container mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <h2>{project?.title}</h2>
      <p>{project?.description}</p>

      {/* Project Image Upload */}
      <div className="mb-4">
        <h4>Project Images</h4>
        <div className="mb-3">
          {project?.images?.length > 0 ? (
            <Row>
              {project.images.map((img, index) => (
                <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                  <img
                    src={img}
                    alt={`Project ${index}`}
                    className="img-thumbnail"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <UploadImage
              targetId={id}
              uploadEndpoint={`http://localhost:5000/api/uploads/projects/${id}/upload`}
              onUploadSuccess={handleProjectImageUpload}
              existingImages={project?.images}
              customTrigger={
                <div
                  className="text-center py-4"
                  style={{
                    border: "1px dashed #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    ":hover": {
                      backgroundColor: "#f8f9fa",
                      borderColor: "#adb5bd",
                    },
                  }}
                >
                  <AddPhotoAlternateIcon
                    style={{ fontSize: "3rem", color: "#6c757d" }}
                  />
                  <p className="mt-2 text-muted">
                    This project does not have images
                    <br />
                    Click to upload images
                  </p>
                </div>
              }
              buttonText="Add Project Image"
              buttonVariant="outline-primary"
              hideDefaultButton={true}
            />
          )}
        </div>
        {project?.images?.length > 0 && (
          <UploadImage
            targetId={id}
            uploadEndpoint={`http://localhost:5000/api/uploads/projects/${id}/upload`}
            onUploadSuccess={handleProjectImageUpload}
            existingImages={project?.images}
            buttonText="Add More Images"
            buttonVariant="outline-primary"
          />
        )}
      </div>

      {/* Add Subproject */}
      <h4>Add a Subproject:</h4>
      <AddSubprojectForm projectId={id} setSubprojects={setSubprojects} />

      {/* Subprojects */}
      <h4>Subprojects:</h4>
      {subprojects.length > 0 ? (
        <ListGroup className="mb-3">
          {subprojects.map((sp) => (
            <ListGroup.Item key={sp.id} className="d-flex flex-column">
              <h6>{sp.title}</h6>
              <p>{sp.description}</p>

              <UploadImage
                targetId={sp.id}
                uploadEndpoint={`http://localhost:5000/api/uploads/projects/${id}/subprojects/${sp.id}/upload`}
                onUploadSuccess={(imageUrl) =>
                  handleSubprojectImageUpload(sp.id, imageUrl)
                }
                existingImages={sp.images}
                buttonText="Add Subproject Image"
                buttonVariant="outline-secondary"
                buttonSize="sm"
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No subprojects yet.</p>
      )}

      <Button className="mt-3" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ProjectDetails;
