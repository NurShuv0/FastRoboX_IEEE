import React, { useState, useEffect } from 'react';
import { MessageSquare, Eye, CheckCircle } from 'lucide-react';
import { adminGetMessages, adminMarkMessageRead } from '../../services/api';
import { Loader, EmptyState, Modal } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const load = () => { setLoading(true); adminGetMessages().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const markRead = async (id) => {
    try { await adminMarkMessageRead(id); load(); }
    catch {}
  };

  const open = (msg) => { setSelected(msg); if (!msg.is_read) markRead(msg.id); };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Contact Messages</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Messages submitted through the contact form.</p>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={<MessageSquare size={28} />} title="No messages yet" message="Contact form messages will appear here." />
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th></th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(msg => (
                <tr key={msg.id} style={{ opacity: msg.is_read ? 0.7 : 1 }}>
                  <td>
                    {!msg.is_read && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', animation: 'blink 2s ease-in-out infinite' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: msg.is_read ? 400 : 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{msg.name}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{msg.email}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-primary)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => open(msg)} className="btn btn-ghost btn-sm"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Message from ${selected?.name}`} maxWidth="560px">
        {selected && (
          <div>
            {[['From', selected.name], ['Email', selected.email], ['Subject', selected.subject], ['Date', new Date(selected.created_at).toLocaleString()]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ minWidth: 70, fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{l}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34,197,94,0.04)', border: '1px solid var(--border-color)', borderRadius: 10, lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 10 }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm">
                ✉ Reply via Email
              </a>
              {!selected.is_read && (
                <button onClick={() => { markRead(selected.id); setSelected(prev => ({ ...prev, is_read: 1 })); }} className="btn btn-ghost btn-sm">
                  <CheckCircle size={14} /> Mark Read
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
