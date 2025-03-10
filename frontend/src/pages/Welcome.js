import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center position-relative text-white">
      
      {/* Background Video Container */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
        <video 
          className="w-100 h-100" 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ objectFit: "cover" }} // Covers the entire screen
        >
          <source src="/videos/handyman-promo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to Improve Text Readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}></div>
      </div>

      {/* Main Content (Ensuring It Stays Visible Above Video) */}
      <div className="text-center position-relative" style={{ zIndex: "1" }}>
        {/* Logo */}
            <img 
          src="/Handyman.png" 
          alt="Handyman Logo" 
          className="position-absolute" 
             style={{ 
                maxWidth: "180px", 
               bottom: "-250px", 
              left: "50%", 
            transform: "translateX(-50%)", 
             zIndex: "2"
            }}  
          />



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
