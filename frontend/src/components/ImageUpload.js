import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { auth } from "../firebase";

const ImageUpload = ({ projectId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `http://localhost:5000/api/upload/${projectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Image uploaded successfully:", response.data);
      onUploadSuccess(response.data.imageUrl);
    } catch (err) {
      console.error("❌ Upload Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleUpload}>
      <Form.Group>
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      {error && <p className="text-danger">{error}</p>}
      <Button type="submit" className="mt-2" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </Form>
  );
};

export default ImageUpload;