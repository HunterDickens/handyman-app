import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

// ✅ Require backend URL to be defined in .env
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("❌ REACT_APP_API_URL is not defined. Backend connection required.");
}

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      await axios.post(
        `${API_URL}/api/auth/signup`,
        { email, password, name },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Sign up successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.error || err.message || "Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-left">
          <h2>Handyman</h2>
          <p>DIY at your fingertips.</p>
          <ul>
            <li>✔ Reliable Advice</li>
            <li>✔ Verified Professionals</li>
            <li>✔ Secure Accounts</li>
          </ul>
        </div>

        <div className="signup-right">
          <h2>Sign Up</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
