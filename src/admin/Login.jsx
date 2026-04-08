import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/admin');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '100%', maxWidth: 400, padding: 40, borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center', color: '#10B981' }}>Admin Portal</h1>
        <p style={{ fontSize: 14, color: 'rgba(248, 250, 252, 0.5)', marginBottom: 32, textAlign: 'center' }}>Sign in to manage your portfolio</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'rgba(248, 250, 252, 0.4)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'rgba(248, 250, 252, 0.4)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none'
              }}
            />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px', borderRadius: 12, background: '#10B981', color: '#020617',
              border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: 8, transition: 'all 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
