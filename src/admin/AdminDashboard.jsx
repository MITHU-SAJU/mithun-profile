import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Zap, User, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
      else setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin/login');
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!session) return null;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: '#020617', color: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: 'rgba(255, 255, 255, 0.02)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', flexDirection: 'column', padding: '32px 16px'
      }}>
        <div style={{ padding: '0 16px', marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 10 }}>
            <LayoutDashboard size={24} /> Admin
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(248, 250, 252, 0.4)', marginTop: 4 }}>Control Center</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NavItem to="/admin" icon={<LayoutDashboard size={18} />} label="Overview" end />
          <NavItem to="/admin/projects" icon={<FolderKanban size={18} />} label="Projects" />
          <NavItem to="/admin/skills" icon={<Zap size={18} />} label="Skills" />
          <NavItem to="/admin/profile" icon={<User size={18} />} label="Profile" />
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderRadius: 12, color: '#ef4444', background: 'transparent',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 48, overflowY: 'auto', maxHeight: '100vh' }}>
        <Header />
        <section style={{ marginTop: 40 }}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        borderRadius: 12, color: isActive ? '#10B981' : 'rgba(248, 250, 252, 0.5)',
        textDecoration: 'none', background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        fontSize: 14, fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
      })}
    >
      {icon} {label}
    </NavLink>
  );
}

function Header() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Dashboard</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: 13, color: 'rgba(248, 250, 252, 0.4)' }}>Real-time synchronization active</span>
        </div>
      </div>
    </div>
  );
}
