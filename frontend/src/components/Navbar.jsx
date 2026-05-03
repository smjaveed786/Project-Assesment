import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <h2>ProjectHub</h2>
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        <Link to="/projects" className={isActive('/projects')}>Projects</Link>
        <Link to="/tasks" className={isActive('/tasks')}>Tasks</Link>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)' }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
