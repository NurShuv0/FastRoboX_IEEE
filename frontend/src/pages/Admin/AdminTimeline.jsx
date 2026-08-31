import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { adminGetTimeline, adminCreateTimeline, adminUpdateTimeline, adminDeleteTimeline } from '../../services/api';
import { Loader, EmptyState, Button, Input, Select, Textarea, Modal, ConfirmDialog, StatusBadge } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

const defaultForm = { title: '', description: '', event_date: '', status: 'upcoming', icon: 'calendar', display_order: 0 };

export default function AdminTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = () => { setLoading(true); adminGetTimeline().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openEdit = (item) => { setEditing(item); setForm({ title: item.title, description: item.description || '', event_date: item.event_date, status: item.status, icon: item.icon || 'calendar', display_order: item.display_order }); setFormOpen(true); };
  const openNew = () => { setEditing(null); setForm(defaultForm); setFormOpen(true); };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title.trim() || !form.event_date) { toast.warning('Title and date are required.'); return; }
    setSaving(true);
    try {
      if (editing) { await adminUpdateTimeline(editing.id, form); toast.success('Timeline updated!'); }
      else { await adminCreateTimeline(form); toast.success('Timeline event added!'); }
      setFormOpen(false); load();
    } catch { toast.error('Failed to save.'); }
    setSaving(false);
  };

  const del = async () => {
    try { await adminDeleteTimeline(deleteTarget.id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  const iconMap = { flag: '🚩', 'book-open': '📖', clock: '⏰', 'credit-card': '💳', 'check-circle': '✅', layers: '📑', zap: '⚡', trophy: '🏆', award: '🏅', calendar: '📅' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Timeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage key event dates shown on the Timeline page.</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}><Plus size={16} /> Add Event</Button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="📅" title="No timeline events yet" action={<Button variant="primary" size="sm" onClick={openNew}><Plus size={14} /> Add Event</Button>} />
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Order</th><th>Icon</th><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[...items].sort((a, b) => a.display_order - b.display_order).map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{item.display_order}</td>
                  <td style={{ fontSize: '1.2rem' }}>{iconMap[item.icon] || '📅'}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {new Date(item.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(item)} className="btn btn-ghost btn-sm"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteTarget(item)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Timeline Event' : 'Add Timeline Event'} maxWidth="520px">
        <Input label="Event Title" required value={form.title} onChange={e => set('title', e.target.value)} />
        <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 80 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Date" type="date" required value={form.event_date} onChange={e => set('event_date', e.target.value)} />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select label="Icon" value={form.icon} onChange={e => set('icon', e.target.value)}>
            {Object.entries(iconMap).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
          </Select>
          <Input label="Display Order" type="number" min={0} value={form.display_order} onChange={e => set('display_order', Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          <Button variant="primary" loading={saving} onClick={save}><Save size={14} /> Save</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={del}
        title="Delete Timeline Event" message={`Delete "${deleteTarget?.title}"?`} confirmText="Delete" danger />
    </div>
  );
}
