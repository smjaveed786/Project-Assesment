import { useEffect, useState } from 'react';
import api from '../api/axios';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <button>+ New Project</button>
      </div>
      <div className="dashboard-grid">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="card glass">
              <h3>{project.name}</h3>
              <p>{project.description || 'No description provided.'}</p>
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created by: {project.createdBy?.name || 'Unknown'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;
