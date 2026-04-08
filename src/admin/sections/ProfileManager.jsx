import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, User, Clock, MapPin, Mail, Percent, BookOpen, Layers } from 'lucide-react';

export default function ProfileManager() {
  const [profile, setProfile] = useState({
    name: 'Mithun T M',
    title: 'Frontend Developer',
    description: '',
    email: '',
    location: '',
    phrases: [],
    stats: { cgpa: '8.0', projects: '10+', internship: '1' }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data } = await supabase.from('profile').select('*').single();
    if (data) {
      setProfile({
        ...data,
        phrases: Array.isArray(data.phrases) ? data.phrases.join('\n') : data.phrases,
        stats: data.stats || profile.stats
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const updatedProfile = {
      ...profile,
      phrases: typeof profile.phrases === 'string' ? profile.phrases.split('\n').filter(p => p.trim()) : profile.phrases
    };

    const { error } = await supabase.from('profile').upsert(updatedProfile);
    if (!error) setMessage({ type: 'success', text: 'Profile updated successfully!' });
    else setMessage({ type: 'error', text: 'Failed to update profile.' });
    
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div style={{ maxWidth: 800 }}>
      {message && (
        <div style={{
          padding: '16px 24px', borderRadius: 12, marginBottom: 24,
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#10B981' : '#ef4444', border: '1px solid currentColor'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Core Info */}
        <Section title="General Information" icon={<User size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Professional Title</label>
              <input value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Bio / Description</label>
              <textarea value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} style={{ ...inputStyle, minHeight: 100 }} />
            </div>
          </div>
        </Section>

        {/* Contact info */}
        <Section title="Contact & Location" icon={<MapPin size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} style={inputStyle} />
            </div>
          </div>
        </Section>

        {/* Typing Phrases */}
        <Section title="Typing Phrases" icon={<Clock size={18} />}>
          <label style={labelStyle}>Phases to animate (one per line)</label>
          <textarea
            value={profile.phrases}
            onChange={e => setProfile({ ...profile, phrases: e.target.value })}
            style={{ ...inputStyle, minHeight: 120, fontFamily: 'monospace' }}
            placeholder="modern web apps.&#10;responsive UIs.&#10;seamless experiences."
          />
        </Section>

        {/* Stats */}
        <Section title="Portfolio Stats" icon={<Layers size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <label style={labelStyle}>CGPA</label>
              <input value={profile.stats.cgpa} onChange={e => setProfile({ ...profile, stats: { ...profile.stats, cgpa: e.target.value } })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Projects Count</label>
              <input value={profile.stats.projects} onChange={e => setProfile({ ...profile, stats: { ...profile.stats, projects: e.target.value } })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Internship Count</label>
              <input value={profile.stats.internship} onChange={e => setProfile({ ...profile, stats: { ...profile.stats, internship: e.target.value } })} style={inputStyle} />
            </div>
          </div>
        </Section>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '16px', borderRadius: 12, background: '#10B981', color: '#020617',
            border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, fontSize: 16
          }}
        >
          <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{
      padding: 32, borderRadius: 24, background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', fontSize: 14,
  fontFamily: 'inherit'
};

const labelStyle = { display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 };
