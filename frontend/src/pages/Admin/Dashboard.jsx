import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList, Clock, CheckCircle, XCircle, Bell,
  Layers, Award, ArrowRight, TrendingUp, Users, Zap
} from 'lucide-react';
import { getDashboardStats, adminGetRegistrations, adminGetNotices } from '../../services/api';
import { Loader, StatusBadge } from '../../components/UI/index.jsx';

function StatCard({ icon, label, value, color = 'green', to, delay = 0 }) {
  const colorMap = {
    green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: '#22c55e' },
    yellow: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)', text: '#eab308' },
    blue: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#f87171' },
    purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', text: '#c084fc' },
  };
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: c.bg, border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: c.text, flexShrink: 0,
        }}>
          {icon}
        </div>
        {to && (
          <Link to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2rem', fontWeight: 800,
        color: c.text, marginTop: '0.75rem', lineHeight: 1,
      }}>
        {value ?? '—'}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>{label}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentRegs, setRecentRegs] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      adminGetRegistrations({ limit: 5 }),
      adminGetNotices({ limit: 5 }),
    ]).then(([s, r, n]) => {
      setStats(s.data.data);
      setRecentRegs(r.data.data?.items || []);
      setRecentNotices(n.data.data?.items || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const quickActions = [
    { label: 'Add Notice', to: '/admin/notices/new', icon: <Bell size={16} />, variant: 'primary' },
    { label: 'Add Segment', to: '/admin/segments/new', icon: <Layers size={16} />, variant: 'outline' },
    { label: 'View Registrations', to: '/admin/registrations', icon: <ClipboardList size={16} />, variant: 'ghost' },
    { label: 'Add Sponsor', to: '/admin/sponsors', icon: <Award size={16} />, variant: 'ghost' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 4,
        }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Welcome back! Here's an overview of FastRobox 1.0.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={<ClipboardList size={20} />} label="Total Registrations" value={stats?.total_registrations} to="/admin/registrations" delay={0} />
        <StatCard icon={<Clock size={20} />} label="Pending" value={stats?.pending_registrations} color="yellow" to="/admin/registrations?status=pending" delay={0.05} />
        <StatCard icon={<CheckCircle size={20} />} label="Approved" value={stats?.approved_registrations} color="green" to="/admin/registrations?status=approved" delay={0.1} />
        <StatCard icon={<XCircle size={20} />} label="Rejected" value={stats?.rejected_registrations} color="red" to="/admin/registrations?status=rejected" delay={0.15} />
        <StatCard icon={<Bell size={20} />} label="Notices" value={stats?.total_notices} color="blue" to="/admin/notices" delay={0.2} />
        <StatCard icon={<Layers size={20} />} label="Segments" value={stats?.total_segments} color="purple" to="/admin/segments" delay={0.25} />
        <StatCard icon={<Award size={20} />} label="Sponsors" value={stats?.total_sponsors} color="yellow" to="/admin/sponsors" delay={0.3} />
        <StatCard icon={<Users size={20} />} label="Messages" value={stats?.unread_messages} color="red" to="/admin/messages" delay={0.35} />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
        style={{ padding: '1.25rem', marginBottom: '2rem' }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {quickActions.map(a => (
            <Link key={a.label} to={a.to} className={`btn btn-${a.variant} btn-sm`}>
              {a.icon} {a.label}
            </Link>
          ))}
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Registrations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Registrations</h3>
            <Link to="/admin/registrations" style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentRegs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No registrations yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentRegs.map((r, i) => (
                <Link key={r.id} to={`/admin/registrations/${r.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '10px 0', borderBottom: i < recentRegs.length - 1 ? '1px solid var(--border-color)' : 'none',
                  textDecoration: 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.team_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.segment_name} · {r.registration_id}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Notices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Notices</h3>
            <Link to="/admin/notices" style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentNotices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No notices yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentNotices.map((n, i) => (
                <Link key={n.id} to={`/admin/notices/${n.id}/edit`} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 0', borderBottom: i < recentNotices.length - 1 ? '1px solid var(--border-color)' : 'none',
                  textDecoration: 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6,
                    background: n.is_published ? 'var(--color-primary)' : 'var(--text-dim)',
                  }} />
                  <div>
                    <div style={{
                      fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{n.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {n.category_name} · {new Date(n.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
