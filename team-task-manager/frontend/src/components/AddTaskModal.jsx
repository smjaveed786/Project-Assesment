import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AppContext } from "../context/AppContext";

export default function AddTaskModal({ isOpen, onClose, projectId: initialProjectId, onTaskCreated }) {
  const { projects, fetchProjects } = useContext(AppContext);
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    priority: "medium", 
    dueDate: "",
    assignedTo: "",
    projectId: initialProjectId || ""
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Sync projectId if it changes via props
      setFormData(prev => ({ ...prev, projectId: initialProjectId || prev.projectId }));
      
      // Load users
      API.get("/auth/users")
        .then(res => setUsers(res.data))
        .catch(() => setError("Failed to load users"));
      
      // Ensure projects are loaded
      if (!projects || projects.length === 0) {
        fetchProjects();
      }
    }
  }, [isOpen, initialProjectId, projects, fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validate Title Length
    if (!formData.title || formData.title.trim().length < 3) {
      return setError("Task title must be at least 3 characters long.");
    }

    // 2. Validate Project ID
    if (!formData.projectId) {
      return setError("Please select a project.");
    }

    // 3. Validate Due Date (Optional but recommended)
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return setError("Due date cannot be in the past.");
      }
    }

    setLoading(true);
    setError("");

    try {
      console.log("ProjectId sending:", formData.projectId); // Debugging exact problem
      const res = await API.post("/tasks", formData);
      onTaskCreated(res.data);
      setFormData({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "", projectId: initialProjectId || "" });
      onClose();
    } catch (err) {
      console.error("Backend Task Creation Error:", err.response?.data); // Following tip
      setError(err.response?.data?.msg || err.response?.data || "Failed to create task. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content page-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-alert" style={{ marginBottom: '1.5rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}

          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Design Login Page"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {!initialProjectId && (
            <div className="form-group">
              <label>Project *</label>
              <select 
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }}
                required
              >
                <option value="">Select Project</option>
                {projects?.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Task details..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="2"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                style={{ background: 'white' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assign To</label>
            <select 
              value={formData.assignedTo}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '0.8rem 1.5rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem 2rem' }}>
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
