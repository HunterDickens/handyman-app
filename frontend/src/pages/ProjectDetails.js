import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Container, Row, Col, Card, Badge, Modal } from "react-bootstrap";
import ImageUpload from "../components/ImageUpload";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleUpdateStatus = async (status) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      await axios.patch(
        `http://localhost:5000/api/projects/${projectId}`,
        { status },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setProject((prev) => ({ ...prev, status }));
      setShowModal(false);
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project.");
    }
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setProject((prev) => ({
      ...prev,
      images: [...(prev.images || []), imageUrl],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center">Project Details</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {project && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{project.title}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <Card.Text>
              <strong>Materials:</strong> {project.materials.join(", ")}
            </Card.Text>
            <Badge bg={project.status === "completed" ? "success" : "warning"}>
              {project.status}
            </Badge>
            {project.images && project.images.length > 0 && (
              <div className="mt-3">
                <h5>Images</h5>
                <Row className="justify-content-center">
                  {project.images.map((image, index) => (
                    <Col key={index} md={4} className="mb-3 d-flex justify-content-center ">
                      <Card.Img variant="top" src={image} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col>
          <Button variant="info" className="w-100 mb-2" onClick={() => setShowModal(true)}>
            Update Status
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" className="w-100 mb-2" onClick={() => navigate("/projects")}>
            ← Back to Projects
          </Button>
        </Col>
      </Row>

      <ImageUpload projectId={projectId} onUploadSuccess={handleImageUploadSuccess} />

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Project Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" className="w-100 mb-2" onClick={() => handleUpdateStatus("in-progress")}>
            In Progress
          </Button>
          <Button variant="success" className="w-100 mb-2" onClick={() => handleUpdateStatus("completed")}>
            Completed
          </Button>
          <Button variant="danger" className="w-100" onClick={() => handleUpdateStatus("abandoned")}>
            Abandoned
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProjectDetails;