import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RepairInstructionPage.css";

function RepairInstructionPage() {
  const { projectId } = useParams(); //  useParams moved inside the component
  const navigate = useNavigate();    //  useNavigate moved inside the component

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [detectedIssues, setDetectedIssues] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      const project = res.data.project;
      setDetectedIssues(project.description);
      setImageUrl(project.imageUrl);
    };

    fetchProject();
  }, [projectId]); //  useEffect moved inside the component

  const mockUploadImage = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const uploadedUrl = await mockUploadImage(file);
      setImageUrl(uploadedUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInstructions("");

    try {
      const issuesArray = detectedIssues
        .split(",")
        .map((issue) => issue.trim())
        .filter(Boolean);

      const response = await axios.post("http://localhost:5000/api/repair/generate-instructions", {
        detectedIssues: issuesArray,
        imageUrl: imageUrl || "",
      });

      setInstructions(response.data.repairInstructions);
    } catch (err) {
      console.error(err);
      setError("Failed to generate repair instructions.");
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    { className: "dashboard-container" },
    React.createElement(
      "div",
      { className: "dashboard-card" },

      //  Back Buttons
      React.createElement("div", { className: "button-row" },
        React.createElement("button", { onClick: () => navigate("/dashboard") }, "← Back to Dashboard"),
        React.createElement("button", { onClick: () => navigate("/projects") }, "← Back to Projects")
      ),

      React.createElement("h2", { className: "dashboard-title" }, "Upload Damage Image & Get Repair Instructions"),

      React.createElement(
        "form",
        { onSubmit: handleSubmit, className: "repair-form" },
        React.createElement(
          "label",
          null,
          "Upload Image:",
          React.createElement("input", {
            type: "file",
            accept: "image/*",
            onChange: handleImageChange,
          })
        ),

        imageUrl &&
          React.createElement("img", {
            src: imageUrl,
            alt: "Preview",
            className: "preview-image",
          }),

        React.createElement(
          "label",
          null,
          "Detected Issues (comma-separated):",
          React.createElement("input", {
            type: "text",
            value: detectedIssues,
            onChange: (e) => setDetectedIssues(e.target.value),
            placeholder: "e.g., cracked drywall, hole in wall",
            required: true,
          })
        ),

        React.createElement(
          "button",
          { type: "submit", disabled: loading },
          loading ? "Generating..." : "Generate Instructions"
        )
      ),

      error && React.createElement("p", { className: "error-text" }, error),

      instructions &&
        React.createElement(
          "div",
          { className: "instructions-output" },
          React.createElement("h3", null, "Repair Instructions"),
          React.createElement("pre", null, instructions)
        )
    )
  );
}

export default RepairInstructionPage;
