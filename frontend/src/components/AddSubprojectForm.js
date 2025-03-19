import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { Button, Form } from "react-bootstrap";

const AddSubprojectForm = ({ projectId, setSubprojects }) => {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setAdding(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/subprojects`,
        { title },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // ✅ Update the subprojects list immediately
      setSubprojects((prev) => [...prev, response.data.subproject]);

      setTitle(""); // ✅ Clear input field after adding
    } catch (err) {
      console.error("🚨 Failed to add subproject:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Form onSubmit={handleAdd} className="mb-3">
      <Form.Group>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New subproject title"
          required
        />
      </Form.Group>
      <Button type="submit" className="mt-2" disabled={adding}>
        {adding ? "Adding..." : "Add Subproject"}
      </Button>
    </Form>
  );
};

export default AddSubprojectForm;
