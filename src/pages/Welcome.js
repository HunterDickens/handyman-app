import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1>Welcome to <span className="brand">HandyMan</span></h1>
        <p>Reliable handyman services, right at your fingertips.</p>

        <div className="btn-container">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
