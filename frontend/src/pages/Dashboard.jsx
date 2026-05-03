import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card glass" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.totalTasks}</p>
        </div>
        <div className="card glass" style={{ borderTop: '4px solid var(--success)' }}>
          <h3>Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.completedTasks}</p>
        </div>
        <div className="card glass" style={{ borderTop: '4px solid var(--warning)' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.pendingTasks}</p>
        </div>
        <div className="card glass" style={{ borderTop: '4px solid var(--danger)' }}>
          <h3>Overdue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.overdueTasks}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
