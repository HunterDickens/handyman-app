import React, { useRef, useState } from "react";
import { Button, Alert, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { auth } from "../firebase";

const UploadImage = ({
  targetId,
  uploadEndpoint,
  onUploadSuccess,
  existingImages,
  buttonText,
  buttonVariant,
  buttonSize,
  customTrigger,
  hideDefaultButton = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(uploadEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadSuccess(response.data.imageUrl);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id={`file-upload-${targetId}`}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {customTrigger && (
        <label htmlFor={`file-upload-${targetId}`} style={{ display: "block" }}>
          {customTrigger}
        </label>
      )}

      {!hideDefaultButton && (
        <Button
          as="label"
          htmlFor={`file-upload-${targetId}`}
          variant={buttonVariant}
          size={buttonSize}
          disabled={uploading}
          className="mt-2"
        >
          {uploading ? "Uploading..." : buttonText}
        </Button>
      )}

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default UploadImage;
