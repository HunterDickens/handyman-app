import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
      <div className="text-center">
        <h1 className="display-3 fw-bold text-warning">Welcome to Handyman</h1>
        <p className="lead text-light">
          Your ultimate DIY repair assistant. Get step-by-step guides and the right tools for every fix.
        </p>
        
        {/* Buttons */}
        <div className="mt-4">
          <button className="btn btn-warning btn-lg mx-2" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-primary btn-lg mx-2" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
