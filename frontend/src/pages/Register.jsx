import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle, ExternalLink,
  User, Users, CreditCard, Eye, Send, Zap, Upload,
  Cpu, AlertCircle, Lock, Globe, Sparkles
} from 'lucide-react';
import { getSegments } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Loader } from '../components/UI/index.jsx';

const SEGMENT_ICONS = {
  'lfr': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="2" y="14" width="6" height="4" rx="1"/><rect x="16" y="14" width="6" height="4" rx="1"/><path d="M8 16h8M5 14V10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M9 8V6M15 8V6"/></svg>,
  'line-follower': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="2" y="14" width="6" height="4" rx="1"/><rect x="16" y="14" width="6" height="4" rx="1"/><path d="M8 16h8M5 14V10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M9 8V6M15 8V6"/></svg>,
  'robo-soccer': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/></svg>,
  'project-showcase-senior': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/><circle cx="16" cy="15" r="2"/><path d="M14 15h-4"/></svg>,
  'project-showcase-junior': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/><circle cx="16" cy="15" r="2"/><path d="M14 15h-4"/></svg>,
  'project-showcase': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/><circle cx="16" cy="15" r="2"/><path d="M14 15h-4"/></svg>,
  'poster-presentation': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 11h6"/></svg>,
};

// Fallback hardcoded links if API loading or offline
const GOOGLE_FORM_FALLBACKS = {
  'lfr': 'https://forms.gle/TrhrrxYyuEXNjNd69',
  'line-follower': 'https://forms.gle/TrhrrxYyuEXNjNd69',
  'robo-soccer': 'https://forms.gle/SMuDtgRnvGTMQTwG8',
  'project-showcase-senior': 'https://forms.gle/7spkXASp9ELPk4rm6',
  'project-showcase-junior': 'https://forms.gle/hKpZsvudbqxQgugY8',
  'poster-presentation': 'https://forms.gle/RBBnkdgxaZxUvjo1A',
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const { getSetting } = useSettings();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegmentId, setSelectedSegmentId] = useState(searchParams.get('segment') || '');

  const regIsOpen = getSetting('registration_is_open', '1');
  const deadline = getSetting('registration_deadline', '2026-10-20');

  const isRegistrationClosed = () => {
    if (regIsOpen === '0') return true;
    try {
      const d = new Date(deadline + 'T23:59:59+06:00');
      return Date.now() > d.getTime();
    } catch { return false; }
  };
  const closed = isRegistrationClosed();

  useEffect(() => {
    getSegments()
      .then(r => setSegments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedSegment = segments.find(s => String(s.id) === String(selectedSegmentId));

  const handleOpenGoogleForm = (formUrl) => {
    if (formUrl) {
      window.open(formUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return <div style={{ paddingTop: 88 }}><Loader text="Loading competition forms..." fullPage /></div>;

  if (closed) {
    return (
      <div style={{ minHeight: '80vh', paddingTop: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
        <div className="glass-card" style={{ maxWidth: 480, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={28} style={{ color: '#f87171' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Registration Closed</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>The registration deadline for FASTROBOX 1.0 has passed. We are no longer accepting new registrations.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/notice" className="btn btn-outline btn-sm">View Official Notices</Link>
            <Link to="/contact" className="btn btn-primary btn-sm">Contact Organizers</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, padding: '60px 24px 80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12
          }}>
            <Sparkles size={14} /> Official Registration Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', color: 'var(--text-primary)', fontWeight: 800 }}>
            Select Segment to Register
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 620, margin: '10px auto 0', lineHeight: 1.6 }}>
            Click on any segment below to directly open its official Google Registration Form.
          </p>
        </div>

        {/* Selected Segment Highlighted Action Banner */}
        {selectedSegment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              borderColor: 'var(--color-primary)',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(10,20,10,0.85) 100%)',
              boxShadow: '0 0 40px rgba(34,197,94,0.18)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: 20,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 4 }}>
                Selected Competition
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                {selectedSegment.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Fee: <strong style={{ color: 'var(--color-primary)' }}>৳{Math.round(selectedSegment.registration_fee).toLocaleString()}</strong>
                {' · '}{selectedSegment.fee_note || `Team: ${selectedSegment.min_team_size}–${selectedSegment.max_team_size} members`}
              </div>
            </div>

            <button
              onClick={() => handleOpenGoogleForm(selectedSegment.google_form_url || GOOGLE_FORM_FALLBACKS[selectedSegment.slug])}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                boxShadow: '0 0 20px rgba(34,197,94,0.4)',
                cursor: 'pointer',
              }}
            >
              Open Google Form <ExternalLink size={18} />
            </button>
          </motion.div>
        )}

        {/* Grid of Segments */}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {segments.map(seg => {
            const formUrl = seg.google_form_url || GOOGLE_FORM_FALLBACKS[seg.slug];
            const isSelected = String(selectedSegmentId) === String(seg.id);

            return (
              <motion.div
                key={seg.id}
                whileHover={{ y: -5, boxShadow: '0 0 30px rgba(34,197,94,0.2)' }}
                onClick={() => {
                  setSelectedSegmentId(String(seg.id));
                  handleOpenGoogleForm(formUrl);
                }}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                  background: isSelected ? 'rgba(34,197,94,0.09)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: isSelected ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-primary)',
                    }}>
                      {SEGMENT_ICONS[seg.slug] || <Cpu size={28} />}
                    </div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                      color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      Official Form
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {seg.name}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {seg.short_description}
                  </p>
                </div>

                <div>
                  <div style={{
                    padding: '10px 12px', background: 'rgba(34,197,94,0.04)',
                    borderRadius: 10, border: '1px solid rgba(34,197,94,0.1)',
                    marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entry Fee:</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                      ৳{Math.round(seg.registration_fee).toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justify: 'center',
                      fontSize: '0.875rem',
                      padding: '0.7rem 1rem',
                      textDecoration: 'none',
                    }}
                  >
                    Register via Google Form <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.65 }}>
            Need help or have questions regarding registration? Contact our official support team at <strong style={{ color: 'var(--color-primary)' }}>{getSetting('contact_email', 'ieeesb@bubt.edu.bd')}</strong> or call <strong style={{ color: 'var(--color-primary)' }}>{getSetting('contact_phone', '+880 1794-269151')}</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}
