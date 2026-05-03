import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/tasks">Tasks</Link>
      <button onClick={logout} style={{ marginLeft: "auto", background: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" }}>
        Logout
      </button>
    </nav>
  );
}
