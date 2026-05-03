import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, Users, LogOut, CheckSquare } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "My Tasks", path: "/tasks", icon: ListTodo },
  { name: "Team", path: "/team", icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ 
          background: "var(--primary)", 
          padding: "6px", 
          borderRadius: "8px", 
          display: "flex",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
        }}>
          <CheckSquare size={20} color="white" strokeWidth={3} />
        </div>
        TaskFlow
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((Item) => (
          <li key={Item.path} className="menu-item">
            <Link
              to={Item.path}
              className={`menu-link ${location.pathname === Item.path ? "active" : ""}`}
            >
              <Item.icon size={20} strokeWidth={location.pathname === Item.path ? 2.5 : 2} />
              {Item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user.name?.charAt(0) || "A"}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || "Admin User"}
            </div>
            <div className="role-badge">
               <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }}></div>
               {user.role || "Admin"}
            </div>
          </div>
        </div>
        <button className="sign-out" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
