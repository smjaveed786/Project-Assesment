import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import { GridSkeleton } from "../components/Skeleton";
import NewProjectModal from "../components/NewProjectModal";
import { AppContext } from "../context/AppContext";
import { Plus, MoreVertical, ListTodo, Users, LayoutGrid } from "lucide-react";
import ProjectMenu from "../components/ProjectMenu";

export default function Projects() {
  const { projects, setProjects } = useContext(AppContext);
  const [loading, setLoading] = useState(!projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!projects) {
      setLoading(true);
      API.get("/projects")
        .then(res => {
          setProjects(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [projects, setProjects]);

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...(prev || [])]);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      API.delete(`/projects/${id}`)
        .then(() => setProjects(projects.filter(p => p._id !== id)))
        .catch(err => console.error("Failed to delete project", err));
    }
  };

  const handleUpdateStatus = (id, status) => {
    API.put(`/projects/${id}/status`, { status })
      .then(() => setProjects(projects.map(p => p._id === id ? { ...p, status } : p)))
      .catch(err => console.error("Failed to update status", err));
  };

  const projectList = projects || [];

  return (
    <Layout>
      <div className="page-fade-in">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Projects</h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>{projectList.length} projects</p>
          </div>
          {user.role === 'admin' && (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'var(--primary)' }}>
              <Plus size={20} strokeWidth={3} /> New Project
            </button>
          )}
        </div>

        <NewProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProjectCreated={handleProjectCreated}
        />

        {loading ? (
          <GridSkeleton />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {projectList.length > 0 ? (
              projectList.map(p => (
                <div key={p._id} className="stat-card" style={{ 
                  padding: '2rem', 
                  borderRadius: '24px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{p.name}</h3>
                      <span style={{ 
                        display: 'inline-block', 
                        marginTop: '8px',
                        padding: '4px 12px', 
                        borderRadius: '99px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        background: p.status === 'completed' ? '#eff6ff' : '#f0fdf4',
                        color: p.status === 'completed' ? '#3b82f6' : '#10b981'
                      }}>
                        {p.status || 'active'}
                      </span>
                    </div>
                    <ProjectMenu 
                      onDelete={() => handleDeleteProject(p._id)}
                      onComplete={() => handleUpdateStatus(p._id, 'completed')}
                    />
                  </div>

                  <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500, margin: '0.5rem 0' }}>
                    {p.description || "A sample project"}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ListTodo size={18} /> {p.tasks?.length || 0} tasks
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={18} /> {p.members?.length || 1} members
                      </span>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                      by {p.owner?.name || "Admin User"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center', 
                padding: '6rem 2rem', 
                background: 'white', 
                borderRadius: '24px', 
                border: '2px dashed #e2e8f0'
              }}>
                <LayoutGrid size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>No projects found</h3>
                <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '2rem' }}>
                  {user.role === 'admin' 
                    ? "You haven't created any projects yet. Start by creating your first one!" 
                    : "You haven't been assigned to any projects yet."}
                </p>
                {user.role === 'admin' && (
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Create Project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
