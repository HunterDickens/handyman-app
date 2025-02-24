import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      console.log("✅ Firebase Auth User Created:", user);
      console.log("📤 Sending request to backend:", { email, name });

      // ✅ Step 2: Send user details to backend API to store in Firestore
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password, name }, // ✅ Ensure all fields are sent
        { headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" } }
      );

      console.log("✅ Server Response:", response.data);
      alert("Sign up successful! You can log in now.");
    } catch (err) {
      console.error("❌ Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
