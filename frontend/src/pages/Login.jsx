import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { CheckSquare, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (!form.email || !form.password) {
        return setError("All fields are required");
      }

      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#f0f4f9",
      padding: "20px"
    }}>
      <div className="page-fade-in" style={{ 
        background: "white", 
        padding: "3rem 2.5rem", 
        borderRadius: "24px", 
        width: "100%", 
        maxWidth: "480px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        textAlign: "center"
      }}>
        {/* Logo Section */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "0.5rem" }}>
          <div style={{ 
            background: "var(--primary)", 
            padding: "6px", 
            borderRadius: "8px", 
            display: "flex"
          }}>
            <CheckSquare size={24} color="white" strokeWidth={3} />
          </div>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", letterSpacing: "-1px" }}>TaskFlow</span>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: 500, marginBottom: "2.5rem" }}>Team Task Manager</p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "2rem", textAlign: "left" }}>Sign in to your account</h2>

        <form onSubmit={handleLogin}>
          {error && <div className="error-alert" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>{error}</div>}

          <div className="form-group" style={{ textAlign: "left" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ padding: '0.85rem 1rem' }}
              required
            />
          </div>

          <div className="form-group" style={{ textAlign: "left" }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ padding: '0.85rem 1rem' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{ 
              width: "100%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              padding: "1rem",
              marginTop: "1rem"
            }}
          >
            {loading ? "Signing in..." : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: "2rem", color: "#64748b", fontWeight: 500, fontSize: "0.95rem" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
