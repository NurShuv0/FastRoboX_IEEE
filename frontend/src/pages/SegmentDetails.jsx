import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Trophy, FileText,
  Download, BookOpen,
  Calendar, Zap, Cpu
} from 'lucide-react';
import { getSegment } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Loader } from '../components/UI/index.jsx';

const SEGMENT_ICONS = {
  'project-showcase': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      <circle cx="16" cy="15" r="2"/><path d="M14 15h-4"/>
    </svg>
  ),
  'line-follower': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <rect x="2" y="14" width="6" height="4" rx="1"/><rect x="16" y="14" width="6" height="4" rx="1"/>
      <path d="M8 16h8M5 14V10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>
      <path d="M9 8V6M15 8V6M12 12v-2"/>
    </svg>
  ),
  'robo-soccer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>
      <path d="M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>
    </svg>
  ),
  'techathon': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>
      <path d="M9 6h6M9 9h6M9 12h4"/>
      <path d="M2 12h3M19 12h3"/>
    </svg>
  ),
  'poster-presentation': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <rect x="3" y="3" width="18" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <path d="M7 8h10M7 11h6"/>
    </svg>
  ),
};

const SEGMENT_BANNER_COLORS = {
  'project-showcase': 'rgba(34,197,94,0.12)',
  'line-follower': 'rgba(59,130,246,0.12)',
  'robo-soccer': 'rgba(239,68,68,0.12)',
  'techathon': 'rgba(168,85,247,0.12)',
  'poster-presentation': 'rgba(234,179,8,0.12)',
};

export default function SegmentDetails() {
  const { id } = useParams();
  const [seg, setSeg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { getSetting } = useSettings();

  const eventDate = getSetting('event_date', '2026-11-14');

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr + 'T00:00:00+06:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  useEffect(() => {
    getSegment(id)
      .then(r => setSeg(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 88 }}><Loader text="Loading competition..." fullPage /></div>;

  if (notFound || !seg) return (
    <div style={{ paddingTop: 88, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Cpu size={56} style={{ color: 'var(--color-primary)', opacity: 0.3, marginBottom: 20 }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', marginBottom: 16 }}>Competition Not Found</h2>
        <Link to="/segments" className="btn btn-outline"><ArrowLeft size={15} /> Back to Segments</Link>
      </div>
    </div>
  );

  const icon = SEGMENT_ICONS[seg.slug] || <Cpu size={36} />;
  const bannerColor = SEGMENT_BANNER_COLORS[seg.slug] || 'rgba(34,197,94,0.12)';

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>

      {/* ── BANNER ── */}
      <div style={{
        minHeight: 240,
        background: `linear-gradient(135deg, rgba(5,15,8,0.97) 0%, ${bannerColor} 100%)`,
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center',
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {seg.image_path && (
          <img src={`/uploads/segments/${seg.image_path}`} alt={seg.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)' }} />

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', position: 'relative' }}>
          <Link to="/segments" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none',
            marginBottom: '1.5rem', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={14} /> All Competitions
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Icon */}
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: bannerColor,
              border: `1px solid ${bannerColor.replace('0.12', '0.35')}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary)', flexShrink: 0,
              boxShadow: `0 0 30px ${bannerColor}`,
            }}>
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                FASTROBOX 1.0 — Competition Segment
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 900,
                color: 'var(--text-primary)', marginBottom: 10,
                letterSpacing: '-0.03em',
              }}>
                {seg.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 640, lineHeight: 1.7, marginBottom: '1rem' }}>
                {seg.short_description}
              </p>
              {/* Quick tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag tag-green">
                  {seg.min_team_size === seg.max_team_size ? `${seg.min_team_size} members` : `${seg.min_team_size}–${seg.max_team_size} members`}
                </span>
                <span className="tag tag-blue">৳{Math.round(seg.registration_fee).toLocaleString()} entry</span>
                {seg.prize_pool && seg.prize_pool !== 'To Be Announced' && (
                  <span className="tag tag-yellow">{seg.prize_pool} prize</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 24px 4rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}
           className="seg-detail-grid">

        {/* ── MAIN CONTENT ── */}
        <div>
          {/* Rulebook Download */}
          {seg.rulebook_path && (
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Official Rulebook (PDF)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Download to read all technical specifications</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={`/uploads/rulebooks/${seg.rulebook_path}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                    View
                  </a>
                  <a href={`/uploads/rulebooks/${seg.rulebook_path}`} download className="btn btn-primary btn-sm">
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Register CTA */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(163,230,53,0.04))',
            borderColor: 'rgba(34,197,94,0.3)',
            textAlign: 'center',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: bannerColor, border: `1px solid ${bannerColor.replace('0.12', '0.3')}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary)', margin: '0 auto 1rem',
            }}>
              {icon}
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ready to Compete?
            </h3>
            <a
              href={seg.google_form_url || 'https://forms.gle/TrhrrxYyuEXNjNd69'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 10, textDecoration: 'none' }}
            >
              <Zap size={16} /> Register via Google Form
            </a>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Entry fee: <strong style={{ color: 'var(--color-primary)' }}>৳{Math.round(seg.registration_fee).toLocaleString()}</strong>
              {seg.fee_note && <div style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{seg.fee_note}</div>}
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Competition Info
            </h4>
            {[
              { icon: <Users size={15} />, label: 'Team Size', value: `${seg.min_team_size}–${seg.max_team_size} members` },
              { icon: <FileText size={15} />, label: 'Entry Fee', value: `৳${Math.round(seg.registration_fee).toLocaleString()}` },
              { icon: <Trophy size={15} />, label: 'Prize Pool', value: isTBAPrize ? 'To Be Announced' : (seg.prize_pool || 'TBA'), tba: isTBAPrize },
              { icon: <Calendar size={15} />, label: 'Event Date', value: formatDate(eventDate) },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 0', borderBottom: '1px solid rgba(34,197,94,0.06)',
              }}>
                <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', color: item.tba ? '#eab308' : 'var(--text-primary)', fontWeight: 600 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact — redirect to contact page since contact_email/phone removed from segment schema */}
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
              Have questions about this competition?
            </p>
            <Link to="/contact" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Contact Organizers
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .seg-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
