import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Form, Spinner, Alert, ListGroup, Image } from "react-bootstrap";
import AddSubprojectForm from "../components/AddSubprojectForm";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [subprojects, setSubprojects] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingSubproject, setUploadingSubproject] = useState(false);

  // ✅ Fetch project and subprojects with images
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
        setSubprojects(response.data.project.subprojects || []);
      } catch (err) {
        console.error("🚨 Error loading project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // ✅ Upload Image for Project
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `http://localhost:5000/api/uploads/projects/${id}/upload`,
        formData,
        { headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Image uploaded successfully!");
      setImage(null);

      setProject((prev) => ({
        ...prev,
        images: [...(prev?.images || []), response.data.imageUrl],
      }));
    } catch (err) {
      console.error("🚨 Error uploading image:", err);
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Upload Image for Subproject
  const handleUploadSubprojectImage = async (e, subprojectId) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    setUploadingSubproject(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `http://localhost:5000/api/uploads/projects/${id}/subprojects/${subprojectId}/upload`,
        formData,
        { headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Subproject image uploaded successfully!");
      setImage(null);

      setSubprojects((prev) =>
        prev.map((sp) =>
          sp.id === subprojectId
            ? { ...sp, images: [...(sp.images || []), response.data.imageUrl] }
            : sp
        )
      );
    } catch (err) {
      console.error("🚨 Error uploading subproject image:", err);
      setError("Failed to upload image.");
    } finally {
      setUploadingSubproject(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <div className="container mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <h2>{project?.title}</h2>
      <p>{project?.description}</p>

      {/* ✅ Project Images */}
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

      {/* ✅ Upload Project Image */}
      <h4>Upload Project Image:</h4>
      <Form onSubmit={handleUploadImage} className="mb-3">
        <Form.Group>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" className="mt-2" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Form>
      
       {/* ✅ Add Subproject */}
       <h4>Add a Subproject:</h4>
      <AddSubprojectForm projectId={id} setSubprojects={setSubprojects} />


      {/* ✅ Subprojects */}
      <h4>Subprojects:</h4>
      {subprojects.length > 0 ? (
        <ListGroup className="mb-3">
          {subprojects.map((sp) => (
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

              {/* ✅ Upload Subproject Image */}
              <Form onSubmit={(e) => handleUploadSubprojectImage(e, sp.id)} className="mt-2">
                <Form.Group>
                  <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                </Form.Group>
                <Button type="submit" className="mt-2" disabled={uploadingSubproject}>
                  {uploadingSubproject ? "Uploading..." : "Upload"}
                </Button>
              </Form>
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
