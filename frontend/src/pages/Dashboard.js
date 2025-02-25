import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          uid: currentUser.uid,
        });

        try {
          const idToken = await currentUser.getIdToken();
          const response = await axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          setProjects(response.data.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      } else {
        navigate("/login"); // ✅ Redirect to login if not authenticated
      }

      setLoading(false); // ✅ Stop loading once auth state is determined
    });

    return () => unsubscribe(); // ✅ Cleanup listener
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Welcome to Your Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading user data...</p>
      ) : user ? (
        <p className="text-center">Logged in as: <strong>{user.email}</strong></p>
      ) : (
        <p className="text-center text-danger">Error fetching user data</p>
      )}

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/projects")}>
          View Projects
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mt-4">
        <h4>Your Repair Projects</h4>
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map((project) => (
              <li key={project.id} className="list-group-item">
                <strong>{project.title}</strong> - {project.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found. <button className="btn btn-link" onClick={() => navigate("/projects")}>Create one?</button></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
