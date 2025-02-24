import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Welcome to Your Dashboard</h2>
      <p className="text-center">Manage your handyman tasks here.</p>
      
      <div className="d-flex justify-content-center">
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
