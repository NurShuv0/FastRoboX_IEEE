import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Upload } from 'lucide-react';
import { adminGetSponsors, adminCreateSponsor, adminUpdateSponsor, adminDeleteSponsor } from '../../services/api';
import { Loader, EmptyState, Button, Input, Select, Modal, ConfirmDialog } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Title Sponsor', 'Powered By', 'Gold Sponsor', 'Silver Sponsor',
  'Technology Partner', 'Robotics Partner', 'Media Partner', 'Community Partner', 'Education Partner',
];

const defaultForm = { name: '', category: 'Gold Sponsor', website_url: '', display_order: 0, is_active: 1 };

export default function AdminSponsors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = () => { setLoading(true); adminGetSponsors().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, category: item.category_name || 'Gold Sponsor', website_url: item.website_url || '', display_order: item.display_order, is_active: item.is_active }); setLogoFile(null); setFormOpen(true); };
  const openNew = () => { setEditing(null); setForm(defaultForm); setLogoFile(null); setFormOpen(true); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { toast.warning('Sponsor name is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) fd.append('logo', logoFile);
      if (editing) { fd.append('_method', 'PUT'); await adminUpdateSponsor(editing.id, fd); toast.success('Sponsor updated!'); }
      else { await adminCreateSponsor(fd); toast.success('Sponsor added!'); }
      setFormOpen(false); load();
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const del = async () => {
    try { await adminDeleteSponsor(deleteTarget.id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  const grouped = items.reduce((acc, s) => {
    const c = s.category_name || 'Other';
    if (!acc[c]) acc[c] = [];
    acc[c].push(s); return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Sponsors</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage event sponsors displayed on the home page.</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}><Plus size={16} /> Add Sponsor</Button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="🏆" title="No sponsors yet" action={<Button variant="primary" size="sm" onClick={openNew}><Plus size={14} /> Add Sponsor</Button>} />
      ) : (
        Object.entries(grouped).map(([cat, sponsors]) => (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {cat}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {sponsors.map(s => (
                <div key={s.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{s.name}</div>
                      {s.website_url && (
                        <a href={s.website_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          {s.website_url.replace(/https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => openEdit(s)} className="btn btn-ghost btn-sm"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteTarget(s)} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {s.logo_path && (
                    <img src={`/uploads/sponsors/${s.logo_path}`} alt={s.name}
                      style={{ maxHeight: 40, objectFit: 'contain', opacity: 0.8 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Sponsor' : 'Add Sponsor'} maxWidth="480px">
        <Input label="Sponsor Name" required value={form.name} onChange={e => set('name', e.target.value)} />
        <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input label="Website URL" type="url" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://example.com" />
        <Input label="Display Order" type="number" min={0} value={form.display_order} onChange={e => set('display_order', Number(e.target.value))} />
        {/* Logo Upload */}
        <div className="form-group">
          <label className="form-label">Sponsor Logo</label>
          <div style={{ border: `2px dashed ${logoFile ? 'var(--color-primary)' : 'var(--border-color)'}`, borderRadius: 10, padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => document.getElementById('logo-up').click()}>
            {logoFile ? <div style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>🖼 {logoFile.name}</div>
              : <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><Upload size={18} /><br />Upload Logo</div>}
          </div>
          <input id="logo-up" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setLogoFile(e.target.files[0])} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          <Button variant="primary" loading={saving} onClick={save}><Save size={14} /> Save</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={del}
        title="Delete Sponsor" message={`Delete "${deleteTarget?.name}"?`} confirmText="Delete" danger />
    </div>
  );
}
