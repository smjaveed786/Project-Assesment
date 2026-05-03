import { useState, useEffect } from "react";
import API from "../api/axios";
import { X } from "lucide-react";

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({ name: "", description: "", members: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return setError("Project name is required");

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/projects", formData);
      onProjectCreated(res.data);
      setFormData({ name: "", description: "", members: [] });
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(10px)' }}>
      <div 
        className="modal-content page-fade-in" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '550px', 
          padding: '2.5rem', 
          borderRadius: '32px', 
          border: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>New Project</h2>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-alert" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Project Name *</label>
            <input
              type="text"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ 
                padding: '1rem 1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid #e2e8f0', 
                fontSize: '1rem',
                fontWeight: 500
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Description</label>
            <textarea
              placeholder="What's this project about?"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              style={{ 
                padding: '1rem 1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid #e2e8f0', 
                fontSize: '1rem',
                fontWeight: 500,
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              style={{ 
                padding: '1rem', 
                borderRadius: '16px', 
                background: 'white', 
                border: '1.5px solid #e2e8f0',
                color: '#475569',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ 
                padding: '1rem', 
                borderRadius: '16px', 
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
