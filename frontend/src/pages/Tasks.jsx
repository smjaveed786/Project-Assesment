import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import { TableSkeleton } from "../components/Skeleton";
import { AppContext } from "../context/AppContext";
import AddTaskModal from "../components/AddTaskModal";
import { 
  Search, 
  Flag, 
  Calendar, 
  ExternalLink, 
  AlertTriangle, 
  Trash2, 
  ChevronDown,
  Inbox,
  Plus
} from "lucide-react";

export default function Tasks() {
  const { tasks, setTasks } = useContext(AppContext);
  const [loading, setLoading] = useState(!tasks);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!tasks) {
      setLoading(true);
      API.get("/tasks")
        .then(res => {
          setTasks(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [tasks, setTasks]);

  const updateStatus = (id, status) => {
    API.put(`/tasks/${id}/status`, { status })
      .then(() => {
        setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      });
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      API.delete(`/tasks/${id}`)
        .then(() => {
          setTasks(tasks.filter(t => t._id !== id));
        })
        .catch(err => console.error("Failed to delete task", err));
    }
  };

  const handleTaskCreated = (newTask) => {
    API.get("/tasks").then(res => setTasks(res.data));
  };

  const allTasks = tasks || [];
  const filteredTasks = allTasks.filter(t => {
    const matchesStatus = filters.status === "" || t.status === filters.status;
    const matchesPriority = filters.priority === "" || t.priority === filters.priority;
    const matchesSearch = t.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const todoCount = allTasks.filter(t => t.status === 'todo').length;
  const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length;
  const doneCount = allTasks.filter(t => t.status === 'done').length;
  const overdueCount = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <Layout>
      <div className="page-fade-in">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>All Tasks</h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>{filteredTasks.length} of {allTasks.length} tasks</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'var(--primary)' }}>
            <Plus size={20} strokeWidth={3} /> New Task
          </button>
        </div>

        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onTaskCreated={handleTaskCreated} 
        />

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: '#334155' }}>{todoCount}</div>
             <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>To Do</div>
          </div>
          <div style={{ background: '#f0f7ff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e0f2fe', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>{inProgressCount}</div>
             <div style={{ color: '#0284c7', fontSize: '0.95rem', fontWeight: 600 }}>In Progress</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '16px', border: '1px solid #dcfce7', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>{doneCount}</div>
             <div style={{ color: '#16a34a', fontSize: '0.95rem', fontWeight: 600 }}>Done</div>
          </div>
          <div style={{ background: '#fff1f2', padding: '1.5rem', borderRadius: '16px', border: '1px solid #ffe4e6', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: '#e11d48' }}>{overdueCount}</div>
             <div style={{ color: '#e11d48', fontSize: '0.95rem', fontWeight: 600 }}>Overdue</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white', 
          padding: '1.25rem 1.5rem', 
          borderRadius: '20px', 
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          marginBottom: '2rem'
        }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.95rem', fontWeight: 500 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
                style={{ appearance: 'none', padding: '0.85rem 3rem 0.85rem 1.25rem', borderRadius: '14px', border: '2.5px solid #6366f1', background: 'white', minWidth: '150px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', color: '#1e293b' }}
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6366f1' }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <select 
                value={filters.priority}
                onChange={e => setFilters({ ...filters, priority: e.target.value })}
                style={{ appearance: 'none', padding: '0.85rem 3rem 0.85rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', minWidth: '150px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', color: '#1e293b' }}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(t => (
                <div key={t._id} className="stat-card" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1.75rem 2rem',
                  height: 'auto',
                  borderRadius: '24px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={t.status}
                        onChange={(e) => updateStatus(t._id, e.target.value)}
                        style={{ 
                          appearance: 'none',
                          padding: '8px 32px 8px 16px',
                          borderRadius: '99px',
                          border: 'none',
                          background: getStatusStyle(t.status).bg,
                          color: getStatusStyle(t.status).color,
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="todo">to do</option>
                        <option value="in-progress">in progress</option>
                        <option value="done">done</option>
                      </select>
                      <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', letterSpacing: '-0.2px' }}>{t.title}</h4>
                      {t.description && <p style={{ margin: '4px 0 12px', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>{t.description}</p>}
                      
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        {t.projectId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1' }}>
                            <ExternalLink size={16} /> {t.projectId.name}
                          </div>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: getPriorityColor(t.priority).text }}>
                          <Flag size={16} strokeWidth={2.5} /> {t.priority}
                        </span>
                        
                        <span style={{ color: '#94a3b8' }}>→ {t.assignedTo?.name || 'Jane Member'}</span>
                        
                        {t.dueDate && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48' }}>
                            <Calendar size={16} /> {new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48' }}>
                            <AlertTriangle size={16} /> overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(t._id)}
                    style={{ background: 'transparent', border: 'none', color: '#fda4af', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.color = '#e11d48'; e.currentTarget.style.background = '#fff1f2'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#fda4af'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <Inbox size={64} style={{ color: '#cbd5e1', marginBottom: '1.5rem' }} />
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>No tasks found matching your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function getPriorityColor(p) {
  if (p === 'high') return { text: '#e11d48', bg: '#fff1f2' };
  if (p === 'medium') return { text: '#f59e0b', bg: '#fffbeb' };
  return { text: '#10b981', bg: '#f0fdf4' };
}

function getStatusStyle(s) {
  if (s === 'todo') return { bg: '#f1f5f9', color: '#64748b' };
  if (s === 'in-progress') return { bg: '#e0f2fe', color: '#0284c7' };
  if (s === 'done') return { bg: '#dcfce7', color: '#16a34a' };
  return { bg: '#f1f5f9', color: '#64748b' };
}
