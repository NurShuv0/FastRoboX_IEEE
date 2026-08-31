import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, XCircle, Download } from 'lucide-react';
import { adminGetRegistrations, adminUpdateRegistrationStatus } from '../../services/api';
import { Loader, EmptyState, StatusBadge, Button, ConfirmDialog, Pagination, Modal, Textarea } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 12;

export default function AdminRegistrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetRegistrations({ search, status, page, limit: PAGE_SIZE });
      setItems(res.data.data?.items || []);
      setTotal(res.data.data?.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, status, page]);

  const updateStatus = async (id, newStatus, reason = '') => {
    setActionLoading(true);
    try {
      await adminUpdateRegistrationStatus(id, { status: newStatus, rejection_reason: reason });
      toast.success(`Registration ${newStatus}!`);
      load();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setActionLoading(false);
      setRejectModal(null);
      setRejectReason('');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const exportCSV = () => {
    const headers = ['ID', 'Registration ID', 'Team', 'Institution', 'Competition', 'Leader', 'Email', 'Phone', 'Status', 'Date'];
    const rows = items.map(r => [r.id, r.registration_id, r.team_name, r.institution, r.segment_name, r.leader_name, r.leader_email, r.leader_phone, r.status, new Date(r.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'registrations.csv'; a.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Registrations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and approve/reject team registrations.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={exportCSV}><Download size={15} /> Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search team, ID, email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="form-input" style={{ minWidth: 150 }} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon="📋" title="No registrations" message="No registrations found matching your filters." />
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Team</th>
                  <th>Institution</th>
                  <th>Competition</th>
                  <th>Leader</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-primary)' }}>{r.registration_id}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.team_name}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{r.institution}</td>
                    <td style={{ fontSize: '0.82rem' }}>{r.segment_name}</td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{r.leader_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.leader_email}</div>
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <button onClick={() => setSelected(r)} className="btn btn-ghost btn-sm" title="View Details">
                          <Eye size={13} />
                        </button>
                        {r.status !== 'approved' && (
                          <button onClick={() => updateStatus(r.id, 'approved')} className="btn btn-sm"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, cursor: 'pointer', padding: '4px 10px' }}
                            title="Approve">
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button onClick={() => setRejectModal(r)} className="btn btn-danger btn-sm" title="Reject">
                            <XCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{total} total registration{total !== 1 ? 's' : ''}</span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Registration — ${selected?.registration_id}`} maxWidth="640px">
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', marginBottom: '1rem' }}>
              {[
                ['Competition', selected.segment_name],
                ['Status', ''],
                ['Team Name', selected.team_name],
                ['Institution', selected.institution],
                ['Leader', selected.leader_name],
                ['Email', selected.leader_email],
                ['Phone', selected.leader_phone],
                ['Submitted', new Date(selected.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  {label === 'Status' ? <StatusBadge status={selected.status} /> :
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>}
                </div>
              ))}
            </div>
            {selected.members?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Team Members</div>
                {selected.members.map((m, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: 'rgba(34,197,94,0.04)', borderRadius: 8, marginBottom: 4, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {m.full_name} · {m.email} · {m.phone}
                  </div>
                ))}
              </div>
            )}
            {selected.payment && (
              <div style={{ padding: '12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Payment</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {selected.payment.method} · {selected.payment.transaction_id}
                </div>
                {selected.payment.screenshot_path && (
                  <a href={`/uploads/payments/${selected.payment.screenshot_path}`} target="_blank" rel="noreferrer"
                    className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
                    View Screenshot
                  </a>
                )}
              </div>
            )}
            {selected.rejection_reason && (
              <div style={{ padding: '10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.85rem', color: '#f87171', marginBottom: '1rem' }}>
                <strong>Rejection Reason:</strong> {selected.rejection_reason}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {selected.status !== 'approved' && (
                <button onClick={() => { updateStatus(selected.id, 'approved'); setSelected(null); }}
                  className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, cursor: 'pointer' }}>
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {selected.status !== 'rejected' && (
                <button onClick={() => { setRejectModal(selected); setSelected(null); }} className="btn btn-danger btn-sm">
                  <XCircle size={14} /> Reject
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Registration" maxWidth="440px">
        {rejectModal && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              You are rejecting <strong style={{ color: 'var(--text-primary)' }}>{rejectModal.team_name}</strong>. Please provide a reason:
            </p>
            <textarea
              className="form-input"
              style={{ minHeight: 100, resize: 'vertical' }}
              placeholder="Explain why the registration is being rejected..."
              value={rejectReason} onChange={e => setRejectReason(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-ghost" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => updateStatus(rejectModal.id, 'rejected', rejectReason)} disabled={actionLoading}>
                <XCircle size={14} /> Confirm Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
