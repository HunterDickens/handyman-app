import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Spinner, Alert, ListGroup, Row, Col } from "react-bootstrap";
import AddSubprojectForm from "../components/AddSubprojectForm";
import UploadImage from "../components/UploadImage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SlideGallery from "../components/SlideGallery";
import CheckboxList from "../components/CheckBoxList";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [subprojects, setSubprojects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

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
    setActiveStep((prev) => prev?.images?.length || 0);
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
    <div className="container-fluid mt-5 ps-5 pe-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4} lg={3} className="border-end border-primary border-2 pe-4">
          <div className="sticky-top" style={{ top: "20px" }}>
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {project.title}
            </h1>
            <div className="mb-3">
              {project?.images?.length > 0 ? (
                <SlideGallery images={project.images} height={400} />
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
                      <p className="mt-2 text-muted">Click to upload images</p>
                    </div>
                  }
                  buttonText="Add Project Image"
                  buttonVariant="outline-primary"
                  hideDefaultButton={true}
                />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
          </div>
        </Col>

        <Col md={8} lg={9}>
          <div className="ps-md-4">
            <h3>Description</h3>
            <p>{project?.description}</p>
            <h3>Materials</h3>
            {project?.materials.length === 0 ? (
              <p>You don't need materials for this project</p>
            ) : (
              <CheckboxList
                items={project?.materials}
                showIcons={true}
                // TO-DO: change material structure to object so it can store entries and their state (checked or not)
              />
            )}
            <h4 className="mt-4">Subprojects:</h4>
            {subprojects?.length > 0 ? (
              <ListGroup className="mb-3">
                {subprojects.map((sp) => (
                  <ListGroup.Item
                    key={sp.id}
                    className="d-flex flex-column mb-3"
                  >
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

            <h4 className="mt-4">Add a Subproject:</h4>
            <AddSubprojectForm projectId={id} setSubprojects={setSubprojects} />

            <Button className="mt-3" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDetails;
