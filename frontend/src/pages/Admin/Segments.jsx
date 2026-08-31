import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { adminGetSegments, adminDeleteSegment } from '../../services/api';
import { Loader, EmptyState, ConfirmDialog, Badge, Pagination } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function AdminSegments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    adminGetSegments().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async () => {
    try { await adminDeleteSegment(deleteTarget.id); toast.success('Segment deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  const icons = { 'robo-soccer': '⚽', 'line-follower': '🚗', 'project-showcase': '💡' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Competition Segments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage competition categories shown on the public website.</p>
        </div>
        <Link to="/admin/segments/new" className="btn btn-primary btn-sm"><Plus size={16} /> Add Segment</Link>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="🤖" title="No segments yet"
          action={<Link to="/admin/segments/new" className="btn btn-primary btn-sm"><Plus size={14} /> Add Segment</Link>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {items.map(seg => (
            <div key={seg.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '2rem' }}>{icons[seg.slug] || '🤖'}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link to={`/admin/segments/${seg.id}/edit`} className="btn btn-ghost btn-sm"><Edit2 size={14} /></Link>
                  <button onClick={() => setDeleteTarget(seg)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 6 }}>{seg.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.75rem',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {seg.short_description}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge color="green">৳{seg.registration_fee}</Badge>
                <Badge color="blue">{seg.min_team_size}–{seg.max_team_size} members</Badge>
                <span className={`status-badge ${seg.is_active ? 'status-active' : 'status-completed'}`}>
                  {seg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Segment" message={`Delete "${deleteTarget?.name}"? All registrations for this segment will also be affected.`}
        confirmText="Delete" danger />
    </div>
  );
}
