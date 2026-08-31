import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, FileText, Download } from 'lucide-react';
import {
  adminGetNotices, adminDeleteNotice, getNoticeCategories
} from '../../services/api';
import { Button, Loader, EmptyState, StatusBadge, Badge, ConfirmDialog, Pagination } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 10;

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [nRes, cRes] = await Promise.all([
        adminGetNotices({ search, page, limit: PAGE_SIZE }),
        getNoticeCategories(),
      ]);
      setNotices(nRes.data.data?.items || []);
      setTotal(nRes.data.data?.total || 0);
      setCategories(cRes.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, page]);

  const handleDelete = async () => {
    try {
      await adminDeleteNotice(deleteTarget.id);
      toast.success('Notice deleted successfully.');
      load();
    } catch {
      toast.error('Failed to delete notice.');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const categoryColors = { general: 'blue', registration: 'green', competition: 'yellow', announcement: 'red', schedule: 'purple', result: 'orange' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Notices</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage public notices and announcements.</p>
        </div>
        <Link to="/admin/notices/new" className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Notice
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search notices..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {loading ? <Loader /> : notices.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No notices yet"
          message="Create your first notice to display on the public website."
          action={<Link to="/admin/notices/new" className="btn btn-primary btn-sm"><Plus size={14} /> Add Notice</Link>} />
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>PDF</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n, i) => (
                  <tr key={n.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', maxWidth: 280 }}
                        className="notice-title">{n.title}</div>
                    </td>
                    <td>
                      <Badge color={categoryColors[n.category_slug] || 'green'}>{n.category_name || 'General'}</Badge>
                    </td>
                    <td>
                      <span className={`status-badge ${n.is_published ? 'status-approved' : 'status-completed'}`}>
                        {n.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      {n.pdf_path
                        ? <a href={`/uploads/notices/${n.pdf_path}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                            <Download size={13} /> PDF
                          </a>
                        : <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>—</span>
                      }
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/notices/${n.id}/edit`} className="btn btn-ghost btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => setDeleteTarget(n)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{total} total notice{total !== 1 ? 's' : ''}</span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Notice" message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete" danger
      />
    </div>
  );
}
