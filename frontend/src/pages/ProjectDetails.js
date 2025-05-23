import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import { auth } from "../firebase";
import {
  Spinner,
  Alert,
  ListGroup,
  Row,
  Col,
  Button,
  Image,
} from "react-bootstrap";
import UploadImage from "../components/UploadImage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SlideGallery from "../components/SlideGallery";
import CheckboxList from "../components/CheckBoxList";

import styles from "./ProjectDetails.module.css";
import CreateProjectButton from "../components/CreateProjectButton";

// Require backend URL to be defined in .env
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("❌ REACT_APP_API_URL is not defined. Backend connection required.");
}

const ProjectDetails = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [subprojects, setSubprojects] = useState([]);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();

        const response = await axios.get(`${API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        setProject(response.data.project);
        setSubprojects(
          response.data.project.subprojects?.map((sp) => ({
            ...sp,
            images: Array.isArray(sp.images) ? sp.images : [],
          })) || []
        );
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details.");
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
          ? {
              ...sp,
              images: Array.isArray(sp.images)
                ? [...sp.images, imageUrl]
                : [imageUrl],
            }
          : sp
      )
    );
  };

  const refreshProjects = async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const response = await axios.get(`${API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setProject(response.data.project);
        setSubprojects(
          response.data.project.subprojects?.map((sp) => ({
            ...sp,
            images: Array.isArray(sp.images) ? sp.images : [],
          })) || []
        );
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project.");
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <div className={`container-fluid pt-5 ps-5 pe-5 ${styles.body}`}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4} lg={3} className="border-end border-2 pe-4">
          <div className="sticky-top" style={{ top: "20px" }}>
            <h1 className={styles.projectTitle}>{project?.title}</h1>
            <div className="mb-3">
              {project?.images?.length > 0 ? (
                <SlideGallery images={project?.images} height={400} />
              ) : (
                <UploadImage
                  targetId={id}
                  uploadEndpoint={`${API_URL}/api/uploads/projects/${id}/upload`}
                  onUploadSuccess={handleProjectImageUpload}
                  existingImages={project?.images}
                  customTrigger={
                    <div className={`text-center py-4 ${styles.imageText}`}>
                      <AddPhotoAlternateIcon className={styles.imageIcon} />
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
                  uploadEndpoint={`${API_URL}/api/uploads/projects/${id}/upload`}
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
              <CheckboxList items={project?.materials} showIcons={true} />
            )}

            <h4 className="mt-4">Subprojects:</h4>
            {subprojects?.length > 0 ? (
              <ListGroup className="mb-3">
                {subprojects.map((sp) => (
                  <ListGroup.Item
                    key={sp.id}
                    className="d-flex flex-column mb-3"
                  >
                    <h6>{sp?.title}</h6>
                    <p>{sp?.description}</p>
                    {sp.images?.length > 0 && (
                      <div className="mb-2">
                        {sp.images.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`Subproject ${i}`}
                            fluid
                            rounded
                            className="m-1"
                            style={{ maxWidth: "150px" }}
                          />
                        ))}
                      </div>
                    )}
                    <UploadImage
                      targetId={sp?.id}
                      uploadEndpoint={`${API_URL}/api/uploads/projects/${id}/subprojects/${sp.id}/upload`}
                      onUploadSuccess={(imageUrl) =>
                        handleSubprojectImageUpload(sp.id, imageUrl)
                      }
                      customTrigger={
                        <div className={`text-center py-4 ${styles.imageText}`}>
                          <AddPhotoAlternateIcon className={styles.imageIcon} />
                          <p className="mt-2 text-muted">
                            Click to upload images
                          </p>
                        </div>
                      }
                      hideDefaultButton={true}
                      existingImages={sp?.images}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No subprojects yet.</p>
            )}

            <CreateProjectButton
              isOpen={isCreateModalOpen}
              onOpen={() => setIsCreateModalOpen(true)}
              onClose={() => setIsCreateModalOpen(false)}
              onProjectCreated={refreshProjects}
              title={"+ New Subproject"}
              projectId={id}
            />

            {/* ✅ View Instructions Button */}
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => navigate(`/repair-instructions/${id}`)}
              >
                View Instructions
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Button className="mt-3" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ProjectDetails;
