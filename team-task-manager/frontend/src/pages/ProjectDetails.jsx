import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import { TableSkeleton } from "../components/Skeleton";
import AddTaskModal from "../components/AddTaskModal";
import { AppContext } from "../context/AppContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const { tasks, setTasks } = useContext(AppContext);
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get(`/projects/${id}`),
      API.get(`/tasks?projectId=${id}`)
    ])
      .then(([projRes, taskRes]) => {
        setProject(projRes.data);
        setProjectTasks(taskRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleTaskCreated = (newTask) => {
    setProjectTasks(prev => [newTask, ...prev]);
    // Also update global tasks if they exist
    if (tasks) {
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const updateStatus = (taskId, status) => {
    API.put(`/tasks/${taskId}/status`, { status })
      .then(() => {
        setProjectTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
        if (tasks) {
          setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
        }
      });
  };

  if (loading) return <Layout><TableSkeleton /></Layout>;
  if (!project) return <Layout><div style={{ padding: '2rem' }}>Project not found.</div></Layout>;

  return (
    <Layout>
      <div className="page-fade-in">
        <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link to="/projects" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Projects
            </Link>
            <h1 className="greeting">{project.name}</h1>
            <p className="subtitle">{project.description}</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Task
          </button>
        </div>

        <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="overview-card">
            <div className="section-title">Tasks</div>
            {projectTasks.length > 0 ? (
              <div className="task-list">
                {projectTasks.map(t => (
                  <div key={t._id} className="task-item">
                    <div 
                      className="task-checkbox" 
                      style={{ 
                        background: t.status === 'done' ? 'var(--success)' : 'none',
                        borderColor: t.status === 'done' ? 'var(--success)' : 'var(--text-muted)'
                      }}
                      onClick={() => updateStatus(t._id, t.status === 'done' ? 'todo' : 'done')}
                    >
                      {t.status === 'done' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div className="task-content">
                      <div className="task-title" style={{ textDecoration: t.status === 'done' ? 'line-through' : 'none', color: t.status === 'done' ? 'var(--text-muted)' : 'inherit' }}>
                        {t.title}
                      </div>
                      <div className="task-meta">
                        {t.dueDate ? `Due ${new Date(t.dueDate).toLocaleDateString()}` : 'No due date'}
                      </div>
                    </div>
                    <div className={`priority-badge ${t.priority}`}>
                      {t.priority}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No tasks in this project yet.</p>
            )}
          </div>

          <div className="overview-card">
            <div className="section-title">Team Members</div>
            <div className="user-selection-list" style={{ border: 'none', padding: 0 }}>
              {project.members?.map(member => (
                <div key={member._id} className="user-select-item" style={{ cursor: 'default' }}>
                  <div className="avatar" style={{ width: '32px', height: '32px' }}>{member.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          projectId={id}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    </Layout>
  );
}
