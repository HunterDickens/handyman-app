import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      console.log("✅ Firebase Auth User Logged In:", user);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" } }
      );

      console.log("✅ Server Response:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to log in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="login-footer">
          Don't have an account? 
          <button 
            onClick={() => navigate("/signup")} 
            className="login-signup-link"
          >Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;