import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

// loading the api base URL from .env file
const API_URL = process.env.REACT_APP_API_URL;

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      console.log("✅ Firebase Auth User Logged In:", user);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
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
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <h2 className={styles["login-title"]}>Login</h2>
        {error && <p className={styles["login-error"]}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className={styles["login-input-group"]}>
            <label>Email</label>
            <input
              type="email"
              className={styles["login-input"]}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["login-input-group"]}>
            <label>Password</label>
            <input
              type="password"
              className={styles["login-input"]}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles["login-button"]} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles["login-footer"]}>
          Don't have an account?
          <button
            onClick={() => navigate("/signup")}
            className={styles["login-signup-link"]}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
