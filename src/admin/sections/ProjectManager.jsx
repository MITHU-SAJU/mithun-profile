import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Trash2, Edit3, ExternalLink, Hash, Palette, Smile } from 'lucide-react';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', tags: '', color: '#10B981', emoji: '🚀', live: '', cat: 'Website', image_url: ''
  });

  useEffect(() => {
    fetchProjects();
    const subscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let currentImageUrl = form.image_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);
      
      currentImageUrl = publicUrl;
    }

    const tagsArray = typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()) : form.tags;
    const projectData = { ...form, tags: tagsArray, image_url: currentImageUrl };
    delete projectData.id; // Ensure ID isn't in the update payload

    if (editing) {
      await supabase.from('projects').update(projectData).eq('id', editing);
    } else {
      await supabase.from('projects').insert([projectData]);
    }
    setEditing(null);
    setFile(null);
    setForm({ title: '', description: '', tags: '', color: '#10B981', emoji: '🚀', live: '', cat: 'Website', image_url: '' });
    fetchProjects();
  }

  async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Form Card */}
      <div style={{
        padding: 32, borderRadius: 20, background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          {editing ? <Edit3 size={20} /> : <Plus size={20} />} {editing ? 'Edit Project' : 'Add New Project'}
        </h4>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Project Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ ...inputStyle, minHeight: 80 }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Project Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={inputStyle} />
            {form.image_url && <p style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>Current image exists</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, Flutter, CSS" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Category</label>
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={inputStyle}>
              <option value="Website">Website</option>
              <option value="Software">Software</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Color (HEX)</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 44, height: 44, padding: 0, border: 'none', background: 'transparent' }} />
              <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Emoji / Icon</label>
            <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 8, opacity: 0.5 }}>Live URL</label>
            <input value={form.live} onChange={e => setForm({ ...form, live: e.target.value })} placeholder="https://..." style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#10B981', color: '#020617', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
              {editing ? 'Update Project' : 'Create Project'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({ title: '', desc: '', tags: '', color: '#10B981', emoji: '🚀', live: '', cat: 'Website' }) }} style={{ padding: '0 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {projects.map(p => (
          <div key={p.id} style={{
            padding: 24, borderRadius: 20, background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: p.color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 32 }}>{p.emoji}</div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditing(p.id); setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags }); }} style={actionBtnStyle}><Edit3 size={16} /></button>
                <button onClick={() => deleteProject(p.id)} style={{ ...actionBtnStyle, color: '#ef4444' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <h5 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{p.title}</h5>
            <p style={{ fontSize: 13, color: 'rgba(248, 250, 252, 0.5)', lineHeight: 1.6, marginBottom: 16, height: 40, overflow: 'hidden' }}>{p.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.isArray(p.tags) && p.tags.map(t => (
                <span key={t} style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        {projects.length === 0 && !loading && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', opacity: 0.5 }}>
            No projects found. Add your first one above!
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', fontSize: 14,
  fontFamily: 'inherit'
};

const actionBtnStyle = {
  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.2s'
};
