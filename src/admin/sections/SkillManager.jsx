import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Trash2, Zap, Briefcase, Cpu } from 'lucide-react';

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', cat: 'Frontend', color: '#61dafb', icon: 'SiReact' });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('cat', { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await supabase.from('skills').insert([form]);
    setForm({ name: '', cat: 'Frontend', color: '#61dafb', icon: 'SiReact' });
    fetchSkills();
  }

  async function deleteSkill(id) {
    if (confirm('Delete this skill?')) {
      await supabase.from('skills').delete().eq('id', id);
      fetchSkills();
    }
  }

  const categories = ['Frontend', 'Backend', 'Mobile', 'Tools'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 32, alignItems: 'start' }}>
      {/* Form */}
      <div style={{
        padding: 32, borderRadius: 20, background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 32
      }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Add New Skill</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Skill Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} placeholder="e.g. React.js" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Category</label>
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={inputStyle}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 44, height: 44, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} />
              <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <button type="submit" style={{ padding: '14px', borderRadius: 12, background: '#10B981', color: '#020617', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>
            Add Skill
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {categories.map(cat => (
          <div key={cat}>
            <h5 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: 16 }}>{cat}</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {skills.filter(s => s.cat === cat).map(s => (
                <div key={s.id} style={{
                  padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 10px ${s.color}66` }} />
                    <span style={{ fontSize: 14 }}>{s.name}</span>
                  </div>
                  <button onClick={() => deleteSkill(s.id)} style={{ border: 'none', background: 'transparent', color: 'rgba(239, 68, 68, 0.4)', cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', fontSize: 14
};
