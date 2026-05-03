import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      showToast('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Signup failed';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="auth-form glass">
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
      </p>
    </div>
  );
}

export default Signup;
