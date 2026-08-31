import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { checkRegistrationStatus } from '../services/api';
import { Input, Button, SectionHeader, StatusBadge } from '../components/UI/index.jsx';

export default function RegistrationStatus() {
  const [regId, setRegId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Pre-fill from URL params
  React.useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('id')) setRegId(p.get('id'));
    if (p.get('email')) setEmail(p.get('email'));
  }, []);

  const check = async () => {
    if (!regId.trim() || !email.trim()) {
      setError('Please enter both Registration ID and email.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await checkRegistrationStatus({ id: regId.trim(), email: email.trim() });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration not found. Please check your ID and email.');
    } finally {
      setLoading(false);
    }
  };

  const statusIcons = {
    pending: <Clock size={32} style={{ color: '#eab308' }} />,
    approved: <CheckCircle size={32} style={{ color: '#22c55e' }} />,
    rejected: <XCircle size={32} style={{ color: '#f87171' }} />,
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <SectionHeader
          tag="Track Your Registration"
          title="Registration Status"
          subtitle="Enter your Registration ID and email address to check your application status."
        />

        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <Input
            label="Registration ID"
            value={regId}
            onChange={e => setRegId(e.target.value)}
            placeholder="e.g., FR-2026-00001"
            required
          />
          <Input
            label="Team Leader Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="leader@example.com"
            required
          />
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
              ⚠ {error}
            </div>
          )}
          <Button variant="primary" onClick={check} loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
            <Search size={16} /> Check Status
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '2rem', textAlign: 'center' }}
          >
            <div style={{ marginBottom: '1rem' }}>{statusIcons[result.status]}</div>
            <StatusBadge status={result.status} />

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Registration ID', value: result.registration_id },
                { label: 'Competition', value: result.segment_name },
                { label: 'Team Name', value: result.team_name },
                { label: 'Institution', value: result.institution },
                { label: 'Leader', value: result.leader_name },
                { label: 'Submitted', value: new Date(result.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid var(--border-color)',
                  gap: 12,
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>

            {result.status === 'rejected' && result.rejection_reason && (
              <div style={{
                marginTop: '1rem', padding: '1rem',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, textAlign: 'left',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', marginBottom: 4 }}>REJECTION REASON</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.rejection_reason}
                </div>
              </div>
            )}

            {result.status === 'pending' && (
              <div style={{
                marginTop: '1rem', padding: '0.75rem 1rem',
                background: 'rgba(234,179,8,0.08)',
                border: '1px solid rgba(234,179,8,0.2)', borderRadius: 8,
                fontSize: '0.82rem', color: '#eab308',
              }}>
                ⏳ Your payment is being verified. This usually takes 24–48 hours.
              </div>
            )}

            {result.status === 'approved' && (
              <div style={{
                marginTop: '1rem', padding: '0.75rem 1rem',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8,
                fontSize: '0.82rem', color: 'var(--color-primary)',
              }}>
                🎉 Congratulations! Your registration is approved. Watch your email for event details.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
