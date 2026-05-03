import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [team, setTeam] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Helper to refresh projects
  const fetchProjects = async (force = false) => {
    if (!projects || force) {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    }
  };

  // Helper to refresh tasks
  const fetchTasks = async (force = false) => {
    if (!tasks || force) {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    }
  };

  return (
    <AppContext.Provider value={{ 
      projects, setProjects, fetchProjects,
      tasks, setTasks, fetchTasks,
      team, setTeam,
      dashboard, setDashboard
    }}>
      {children}
    </AppContext.Provider>
  );
};
