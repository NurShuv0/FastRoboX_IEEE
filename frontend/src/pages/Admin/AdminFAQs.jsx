import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, GripVertical } from 'lucide-react';
import { adminGetFaqs, adminCreateFaq, adminUpdateFaq, adminDeleteFaq } from '../../services/api';
import { Loader, EmptyState, Button, Input, Textarea, Modal, ConfirmDialog } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

const defaultForm = { question: '', answer: '', display_order: 0, is_active: 1 };

export default function AdminFAQs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = () => { setLoading(true); adminGetFaqs().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openEdit = (item) => { setEditing(item); setForm({ question: item.question, answer: item.answer, display_order: item.display_order, is_active: item.is_active }); setFormOpen(true); };
  const openNew = () => { setEditing(null); setForm({ ...defaultForm, display_order: items.length }); setFormOpen(true); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) { toast.warning('Question and answer are required.'); return; }
    setSaving(true);
    try {
      if (editing) { await adminUpdateFaq(editing.id, form); toast.success('FAQ updated!'); }
      else { await adminCreateFaq(form); toast.success('FAQ added!'); }
      setFormOpen(false); load();
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const del = async () => {
    try { await adminDeleteFaq(deleteTarget.id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>FAQs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage frequently asked questions shown on the FAQ page.</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}><Plus size={16} /> Add FAQ</Button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="❓" title="No FAQs yet" action={<Button variant="primary" size="sm" onClick={openNew}><Plus size={14} /> Add FAQ</Button>} />
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>#</th><th>Question</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
            <tbody>
              {[...items].sort((a, b) => a.display_order - b.display_order).map((faq, i) => (
                <tr key={faq.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', maxWidth: 400 }}>{faq.question}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{faq.answer}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${faq.is_active ? 'status-approved' : 'status-completed'}`}>
                      {faq.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{faq.display_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(faq)} className="btn btn-ghost btn-sm"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteTarget(faq)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'} maxWidth="560px">
        <Textarea label="Question" required value={form.question} onChange={e => set('question', e.target.value)} style={{ minHeight: 80 }} />
        <Textarea label="Answer" required value={form.answer} onChange={e => set('answer', e.target.value)} style={{ minHeight: 120 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Display Order" type="number" min={0} value={form.display_order} onChange={e => set('display_order', Number(e.target.value))} />
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {[{ v: 1, label: 'Active' }, { v: 0, label: 'Hidden' }].map(opt => (
                <button key={opt.v} type="button"
                  onClick={() => set('is_active', opt.v)}
                  className={`btn btn-sm ${form.is_active === opt.v ? 'btn-primary' : 'btn-ghost'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          <Button variant="primary" loading={saving} onClick={save}><Save size={14} /> Save FAQ</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={del}
        title="Delete FAQ" message={`Delete this FAQ? "${deleteTarget?.question?.slice(0, 60)}..."`} confirmText="Delete" danger />
    </div>
  );
}
