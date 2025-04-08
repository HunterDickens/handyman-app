import React, { useState } from "react";
import axios from "axios";

const RepairInstructionForm = () => {
  const [image, setImage] = useState(null);
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [newIssue, setNewIssue] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddIssue = () => {
    if (newIssue && !detectedIssues.includes(newIssue)) {
      setDetectedIssues([...detectedIssues, newIssue]);
      setNewIssue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || detectedIssues.length === 0) {
      alert("Please upload an image and add at least one issue.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("detectedIssues", JSON.stringify(detectedIssues));

    setLoading(true);
    try {
      const res = await axios.post("/generate-instructions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInstructions(res.data.repairInstructions);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Fix-It AI Assistant 🛠️</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Upload an Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Detected Issues</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="e.g. water damage"
            />
            <button
              type="button"
              onClick={handleAddIssue}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          <ul className="mt-2 text-sm list-disc ml-6">
            {detectedIssues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Get Repair Instructions"}
        </button>
      </form>

      {instructions && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <pre className="whitespace-pre-wrap">{instructions}</pre>
        </div>
      )}
    </div>
  );
};

export default RepairInstructionForm;
