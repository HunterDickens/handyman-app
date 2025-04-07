import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { ListGroup, Button, Form, Image } from "react-bootstrap";

// ✅ Load API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("❌ REACT_APP_API_URL is not defined. Backend connection required.");
}

const SubprojectList = ({ projectId, subprojects, setSubprojects }) => {
  const [subprojectImages, setSubprojectImages] = useState({});

  const handleUploadSubprojectImage = async (e, subprojectId) => {
    e.preventDefault();
    if (!subprojectImages[subprojectId]) return;

    const formData = new FormData();
    formData.append("image", subprojectImages[subprojectId]);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `${API_URL}/api/projects/${projectId}/subprojects/${subprojectId}/upload`,
        formData,
        { headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "multipart/form-data" } }
      );

      setSubprojects((prev) =>
        prev.map((sp) =>
          sp.id === subprojectId ? { ...sp, images: [...(sp.images || []), response.data.imageUrl] } : sp
        )
      );
    } catch (err) {
      console.error("Failed to upload image.");
    }
  };

  return (
    <>
      <h4>Subprojects:</h4>
      <ListGroup className="mb-3">
        {subprojects.map((sp) => (
          <ListGroup.Item key={sp.id}>
            <h6>{sp.title}</h6>
            {sp.images?.length > 0 && (
              <div className="mb-2">
                {sp.images.map((img, i) => (
                  <Image key={i} src={img} alt={`Subproject ${i}`} fluid rounded className="m-1" style={{ maxWidth: "150px" }} />
                ))}
              </div>
            )}
            <Form onSubmit={(e) => handleUploadSubprojectImage(e, sp.id)} className="mb-2">
              <Form.Group>
                <Form.Control type="file" onChange={(e) => setSubprojectImages({ ...subprojectImages, [sp.id]: e.target.files[0] })} />
              </Form.Group>
              <Button type="submit" className="mt-2">Upload Image</Button>
            </Form>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default SubprojectList;
