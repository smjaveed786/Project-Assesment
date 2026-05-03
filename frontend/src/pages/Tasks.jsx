import { useEffect, useState } from 'react';
import api from '../api/axios';

const StatusBadge = ({ status }) => {
  const normalized = status.toLowerCase();
  return <span className={`badge ${normalized}`}>{status.toUpperCase()}</span>;
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        <button>+ New Task</button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 0, flex: 2 }}
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginBottom: 0, flex: 1 }}
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.length === 0 ? (
          <p>No tasks match your filters.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
                <p style={{ fontSize: '0.875rem' }}>Project: {task.projectId?.name || 'N/A'}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <StatusBadge status={task.status} />
                <button style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)' }}>
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
