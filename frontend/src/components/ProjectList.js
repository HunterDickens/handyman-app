import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Button } from "@mui/material";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      ) : (
        <>
          <p>No projects found. Start by creating one!</p>
          {/*to do: implement button logic*/}
          <Button>Create Project</Button>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
