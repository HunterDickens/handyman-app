import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { Form, Button, Image } from "react-bootstrap";

const UploadImage = ({ projectId, project, setProject }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await axios.post(`http://localhost:5000/api/uploads/${id}`, formData, {
        headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "multipart/form-data" }
      });      

      setProject((prev) => ({
        ...prev,
        images: [...(prev?.images || []), response.data.imageUrl],
      }));
      setImage(null);
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <h4>Uploaded Images:</h4>
      {project?.images?.length > 0 && (
        <div className="mb-3 d-flex flex-wrap">
          {project.images.map((img, i) => (
            <Image key={i} src={img} alt={`Project Image ${i}`} fluid rounded className="m-2" style={{ maxWidth: "300px" }} />
          ))}
        </div>
      )}

      <Form onSubmit={handleUploadImage} className="mb-3">
        <Form.Group>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" className="mt-2" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Form>
    </>
  );
};

export default UploadImage;
