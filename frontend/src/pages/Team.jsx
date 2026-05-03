import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { TableSkeleton } from "../components/Skeleton";
import { AppContext } from "../context/AppContext";
import { Crown, Users, Mail, Calendar, Shield, ShieldCheck } from "lucide-react";

export default function Team() {
  const { team, setTeam } = useContext(AppContext);
  const [loading, setLoading] = useState(!team);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!team) {
      setLoading(true);
      API.get("/auth/users")
        .then((res) => {
          setTeam(res.data);
        })
        .catch((err) => {
          setError("Failed to fetch team members");
          console.error(err);
          // Fallback for demo
          setTeam([
            { _id: "6634d0000000000000000002", name: "Admin User", email: "admin@demo.com", role: "admin", createdAt: "2026-05-03" },
            { _id: "6634d0000000000000000003", name: "Jane Member", email: "jane@demo.com", role: "member", createdAt: "2026-05-03" },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [team, setTeam]);

  const handleMakeAdmin = (userId) => {
    // API call to update role
    API.put(`/auth/users/${userId}/role`, { role: 'admin' })
      .then(() => {
        setTeam(team.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
      })
      .catch(err => console.error("Failed to update role", err));
  };

  if (loading) return <Layout><TableSkeleton /></Layout>;

  const users = team || [];
  const adminCount = users.filter(u => u.role === 'admin').length;
  const memberCount = users.filter(u => u.role === 'member').length;

  return (
    <Layout>
      <div className="page-fade-in">
        <div className="header-section">
          <h1 className="greeting">Team Members</h1>
          <p className="subtitle">{users.length} users — {adminCount} admin, {memberCount} member</p>
        </div>

        {/* Summary Cards */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: '#f5f7ff', border: '1px solid #e0e7ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6366f1', marginBottom: '1rem' }}>
              <Crown size={20} />
              <span style={{ fontWeight: 600 }}>Admins</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b' }}>{adminCount}</div>
          </div>
          
          <div className="stat-card" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginBottom: '1rem' }}>
              <Users size={20} />
              <span style={{ fontWeight: 600 }}>Members</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b' }}>{memberCount}</div>
          </div>
        </div>

        {/* User List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map((user) => (
            <div key={user._id} className="stat-card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '1.25rem 1.5rem',
              height: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div className="avatar" style={{ 
                  margin: 0, 
                  width: '48px', 
                  height: '48px', 
                  fontSize: '1.2rem',
                  background: user.role === 'admin' ? '#e0e7ff' : '#f1f5f9',
                  color: user.role === 'admin' ? '#6366f1' : '#64748b'
                }}>
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user.name}</span>
                    {user.email === currentUser.email && (
                      <span style={{ background: '#eef2ff', color: '#6366f1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>You</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={14} /> {user.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user.role === 'admin' ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#eef2ff', 
                    color: '#6366f1', 
                    padding: '6px 12px', 
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}>
                    <ShieldCheck size={16} /> admin
                  </div>
                ) : (
                  <>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>member</span>
                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn-secondary" 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '0.85rem', 
                          border: '1px solid #e2e8f0',
                          background: 'white',
                          color: '#6366f1'
                        }}
                      >
                        Make Admin
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
