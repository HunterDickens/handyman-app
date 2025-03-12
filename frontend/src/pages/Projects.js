import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Form, Button, Modal } from "react-bootstrap"; // ✅ Bootstrap Components

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description: "", materials: "" });
  const [loading, setLoading] = useState(true); // ✅ Show loading state
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ✅ Fetch Projects when User is Authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          setProjects(response.data.projects);
        } catch (err) {
          console.error("Error fetching projects:", err);
          setError("Failed to load projects.");
        } finally {
          setLoading(false); // ✅ Stop loading once data is fetched
        }
      } else {
        setLoading(false);
        navigate("/login"); // ✅ Redirect if no user
      }
    });

    return () => unsubscribe(); // ✅ Clean up listener
  }, [navigate]);

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // ✅ Create New Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:5000/api/projects",
        { ...newProject, materials: newProject.materials.split(",") },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setProjects([...projects, { ...newProject, id: response.data.id, status: "in-progress" }]);
      setNewProject({ title: "", description: "", materials: "" });
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open Status Update Modal
  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  // ✅ Update Project Status
  const handleUpdateStatus = async (status) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      await axios.patch(
        `http://localhost:5000/api/projects/${selectedProject.id}`,
        { status },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? { ...p, status } : p))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project.");
    }
  };

  // ✅ Delete Project
  const handleDeleteProject = async (projectId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Repair Projects</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      {/* ✅ Show Loading Message */}
      {loading ? (
        <p className="text-center">Loading projects...</p>
      ) : (
        <>
          {/* ✅ New Project Form */}
          <Form onSubmit={handleCreateProject} className="mb-4">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Project title"
                value={newProject.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                placeholder="Project description"
                value={newProject.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Materials (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="materials"
                placeholder="Wood, nails, glue"
                value={newProject.materials}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button type="submit" className="mt-3 w-100" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </Form>

      {/* ✅ Project List */}
      <ul className="list-group">
        {projects.map((project) => (
          <li 
             key={project.id} 
             className="list-group-item d-flex justify-content-between align-items-center"
             //onClick={() => navigate(`/projects/${project.id}`)}
             //style={{ cursor: "pointer" }}
          >
            <div> 
              <h5>{project.title}</h5>
              <p>{project.description}</p>
              <span className={`badge ${project.status === "completed" ? "bg-success" : "bg-warning"}`}>
                {project.status}
              </span>
            </div>
            <div>
              <Button variant="info" className="me-2" onClick={() => handleOpenModal(project)}>
                Update Status
              </Button>
              <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ Status Update Modal */}
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

      {/* ✅ Return to Dashboard Button */}
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </Button>
\      </div>
    </>
  )}
</div>
);
}


export default Projects;
