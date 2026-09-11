import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, ChevronRight, Trophy, Users, Building2, ArrowRight,
  Calendar, Clock, Bot, Cpu, Rocket, ChevronDown,
  Radio, Star, Handshake, MessageSquare, ExternalLink, Flame
} from 'lucide-react';
import { getSegments, getSponsors } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { SectionHeader, Loader, EmptyState } from '../components/UI/index.jsx';

// Segment theme color mapping matching NRF26
const getSegmentColor = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('soccer')) return { bg: '#2563eb', tagBg: 'rgba(37,99,235,0.15)', text: '#60a5fa', border: 'rgba(37,99,235,0.3)' };
  if (lower.includes('line') || lower.includes('lfr')) return { bg: '#059669', tagBg: 'rgba(5,150,105,0.15)', text: '#34d399', border: 'rgba(5,150,105,0.3)' };
  if (lower.includes('hack') || lower.includes('tech')) return { bg: '#db2777', tagBg: 'rgba(219,39,119,0.15)', text: '#f472b6', border: 'rgba(219,39,119,0.3)' };
  if (lower.includes('poster')) return { bg: '#d97706', tagBg: 'rgba(217,119,6,0.15)', text: '#fbbf24', border: 'rgba(217,119,6,0.3)' };
  return { bg: '#dc2626', tagBg: 'rgba(220,38,38,0.15)', text: '#fca5a5', border: 'rgba(220,38,38,0.3)' };
};

// ── COUNTDOWN ────────────────────────────────────────────────────
function Countdown({ targetDate, label = 'Event starts in' }) {
  const calcTime = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState(calcTime());

  useEffect(() => {
    const id = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!time) {
    return (
      <div style={{ textAlign: 'center', padding: '12px', color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🚩 EVENT SUCCESSFULLY COMPLETED!
      </div>
    );
  }

  const boxes = [
    { val: time.d, label: 'Days' },
    { val: time.h, label: 'Hours' },
    { val: time.m, label: 'Mins' },
    { val: time.s, label: 'Secs' },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, textAlign: 'center', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {boxes.map(({ val, label: l }) => (
          <div key={l} className="countdown-box" style={{ borderRadius: 16, borderColor: 'rgba(220, 38, 38, 0.25)', minWidth: 85 }}>
            <div className="countdown-number" style={{ color: '#dc2626' }}>{String(val).padStart(2, '0')}</div>
            <div className="countdown-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SEGMENT CARD ────────────────────────────────────────────────
function SegmentCard({ seg, index }) {
  const theme = getSegmentColor(seg.name);
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: `0 0 35px ${theme.tagBg}` }}
      className="glass-card segment-card"
      style={{
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        borderColor: 'var(--border-color)',
        height: '100%',
      }}
    >
      {/* Full image banner */}
      <div style={{
        height: 190,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)',
        background: '#090d16',
      }}>
        {seg.image_path ? (
          <img
            src={`/uploads/segments/${seg.image_path}`}
            alt={seg.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${theme.tagBg}, rgba(9,13,22,0.95))` }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 20%, rgba(9,13,22,0.88) 100%)' }} />

        {/* Category tag */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1,
          background: 'rgba(9, 13, 22, 0.75)', border: `1px solid ${theme.border}`,
          borderRadius: 8, padding: '4px 12px', fontSize: '0.68rem', fontWeight: 800,
          color: theme.text, textTransform: 'uppercase', letterSpacing: '0.06em', backdropFilter: 'blur(8px)',
        }}>
          {seg.min_team_size === seg.max_team_size ? `${seg.min_team_size} Member` : `${seg.min_team_size}–${seg.max_team_size} Members`}
        </div>

        {/* Title at bottom of image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 18px', zIndex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            {seg.name}
          </h3>
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1.25rem', flex: 1 }}>
          {seg.short_description}
        </p>

        {/* Fee + Prize */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 800, padding: '5px 12px', borderRadius: 100,
            background: 'rgba(220, 38, 38, 0.1)', color: isDark ? '#fca5a5' : '#b91c1c', border: '1px solid rgba(220, 38, 38, 0.3)'
          }}>
            Fee: ৳{Math.round(seg.registration_fee).toLocaleString()}
          </span>
          {seg.prize_pool && (
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, padding: '5px 12px', borderRadius: 100,
              background: 'rgba(245, 158, 11, 0.1)', color: isDark ? '#fcd34d' : '#b45309', border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              Prize: {seg.prize_pool === 'To Be Announced' ? 'TBA' : seg.prize_pool}
            </span>
          )}
        </div>

        {/* Full Width Clean Action Button */}
        <Link
          to={`/register?segment=${seg.id}`}
          className="btn btn-pill"
          style={{
            width: '100%',
            justify: 'center',
            fontSize: '0.82rem',
            fontWeight: 800,
            background: theme.bg,
            color: '#ffffff',
            boxShadow: `0 4px 18px ${theme.tagBg}`,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '10px 20px',
            marginTop: 'auto',
          }}
        >
          REGISTER NOW <ArrowRight size={14} style={{ marginLeft: 6 }} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── HOME PAGE ────────────────────────────────────────────────────
export default function Home() {
  const [segments, setSegments] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [segLoading, setSegLoading] = useState(true);
  const [sponLoading, setSponLoading] = useState(true);
  const { getSetting } = useSettings();
  const { isDark } = useTheme();

  const eventDate = getSetting('event_date', '2026-11-14');
  const deadline = getSetting('registration_deadline', '2026-10-20');
  const prizePool = getSetting('event_prize_pool', 'BDT 200K+');
  const organizer = getSetting('organizer_name', 'IEEE BUBT Student Branch');

  useEffect(() => {
    getSegments().then(r => setSegments(r.data.data || [])).catch(() => { }).finally(() => setSegLoading(false));
    getSponsors().then(r => setSponsors(r.data.data || [])).catch(() => { }).finally(() => setSponLoading(false));
  }, []);

  const sponsorsByCategory = sponsors.reduce((acc, s) => {
    const cat = s.category_name || 'Sponsors';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr + 'T00:00:00+06:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── TOP MARQUEE LIVE RADAR BAR ──────────────────────────── */}
      <div style={{
        marginTop: 68,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        height: 38,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 90,
      }}>
        <div style={{
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '0.68rem',
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          flexShrink: 0,
          zIndex: 2,
          boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
        }}>
          <span className="animate-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
          LIVE RADAR
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="marquee-container">
            <div className="marquee-track" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <span style={{ paddingRight: 40 }}>
                🏆 <strong>REGISTRATION OPEN:</strong> FastRoboX 1.0 — BUBT National Robotics Competition | Prize Pool: <strong>BDT 200,000+</strong>
              </span>
              <span style={{ paddingRight: 40 }}>
                ⚡ <strong>5 COMPETE SEGMENTS:</strong> Robo Soccer, Line Follower Robot, Techathon Hackathon, Project Showcase &amp; Poster Presentation
              </span>
              <span style={{ paddingRight: 40 }}>
                📜 <strong>CERTIFICATES:</strong> Official participation certificates will be awarded to all verified teams.
              </span>
              {/* Duplicated for 100% seamless infinite running loop */}
              <span style={{ paddingRight: 40 }}>
                🏆 <strong>REGISTRATION OPEN:</strong> FastRoboX 1.0 — BUBT National Robotics Competition | Prize Pool: <strong>BDT 200,000+</strong>
              </span>
              <span style={{ paddingRight: 40 }}>
                ⚡ <strong>5 COMPETE SEGMENTS:</strong> Robo Soccer, Line Follower Robot, Techathon Hackathon, Project Showcase &amp; Poster Presentation
              </span>
              <span style={{ paddingRight: 40 }}>
                📜 <strong>CERTIFICATES:</strong> Official participation certificates will be awarded to all verified teams.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section style={{
        minHeight: '88vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `var(--gradient-dark)`,
          zIndex: 0,
        }} />

        {/* Ambient Crimson Glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 25%, rgba(220, 38, 38, 0.14) 0%, transparent 70%)',
          zIndex: 0,
        }} />

        <div style={{ maxWidth: 1040, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Official Fastrobox 2026 Hero Logo */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 2.5rem',
            }}
          >
            <img
              src={isDark ? "/images/Fastrobox_white.png" : "/images/Fastrobox 2026 logo-01.png"}
              alt="FastRobox 1.0 — IEEE BUBT Student Branch"
              style={{
                width: '100%',
                maxWidth: 'clamp(320px, 75vw, 680px)',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                filter: isDark
                  ? 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.35)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.15))'
                  : 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.12))',
              }}
            />
          </motion.div>

          {/* Hero Metrics Pill Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 24,
              padding: '14px 32px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              borderRadius: 100,
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-card), 0 0 20px rgba(220, 38, 38, 0.1)',
              flexWrap: 'wrap',
              justify: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Calendar size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>EVENT DATE</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>14 November, 2026</div>
              </div>
            </div>

            <div style={{ width: 1, height: 32, background: 'var(--border-color)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Trophy size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL PRIZE POOL</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#dc2626' }}>2,00,000+ BDT</div>
              </div>
            </div>
          </motion.div>

          {/* Registration Deadline Pill Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              maxWidth: 440,
              margin: '0 auto 2.5rem',
              padding: '16px 24px',
              background: 'rgba(220, 38, 38, 0.06)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              borderRadius: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 4 }}>
              REGISTRATION DEADLINE
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
              {formatDate(deadline)}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '4px 14px', borderRadius: 100, background: '#dc2626', color: '#ffffff', letterSpacing: '0.06em' }}>
              REGISTRATION OPEN NOW
            </span>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/register" className="btn btn-primary btn-xl btn-pill">
              <Zap size={18} /> REGISTER YOUR TEAM
            </Link>
            <Link to="/segments" className="btn btn-outline btn-xl btn-pill">
              EXPLORE SEGMENTS <ChevronRight size={16} />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── ACTION HUB CARDS ────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0 }}>
              <Star size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>Become a Campus Ambassador</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>Represent your university at FastRoboX 1.0</div>
              <Link to="/contact" className="btn btn-primary btn-sm btn-pill" style={{ fontSize: '0.72rem' }}>
                APPLY NOW
              </Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', flexShrink: 0 }}>
              <Handshake size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>Become a Partner</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>Sponsor or collaborate with FastRoboX</div>
              <Link to="/contact" className="btn btn-outline btn-sm btn-pill" style={{ fontSize: '0.72rem' }}>
                PARTNER WITH US
              </Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fcd34d', flexShrink: 0 }}>
              <Flame size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>Official Notice Board</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>Get official updates & downloadable rulebooks</div>
              <Link to="/notice" className="btn btn-ghost btn-sm btn-pill" style={{ fontSize: '0.72rem' }}>
                VIEW NOTICES
              </Link>
            </div>
          </div>

        </div>
      </section>



      {/* ── COMPETITION SEGMENTS ──────────────────────────────── */}
      <section id="segments" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            tag="COMPETITIONS"
            title="CHOOSE YOUR BATTLEGROUND"
            subtitle="Assemble your team, select your discipline, and compete for national glory."
          />

          {segLoading ? (
            <Loader text="Loading competition segments..." />
          ) : segments.length === 0 ? (
            <EmptyState
              icon={<Cpu size={40} />}
              title="Segments Coming Soon"
              message="Competition segments will be announced shortly. Stay tuned!"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {segments.map((seg, i) => <SegmentCard key={seg.id} seg={seg} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── HOST INSTITUTION ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
          <SectionHeader tag="ORGANIZER" title="HOSTED BY IEEE BUBT STUDENT BRANCH" />
          <div className="glass-card" style={{ padding: '3rem 2rem', borderRadius: 24, borderColor: 'rgba(220,38,38,0.25)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem',
              padding: '8px 18px', background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.25)', borderRadius: 100,
            }}>
              <Zap size={18} style={{ color: '#dc2626' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                IEEE BUBT Student Branch
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
              Bangladesh University of Business and Technology
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '1.25rem', fontWeight: 600 }}>
              BUBT PERMANENT CAMPUS — MIRPUR, DHAKA
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto', fontSize: '0.9rem' }}>
              BUBT is a premier university dedicated to engineering excellence. As the proud host of FastRoboX 1.0,
              the IEEE BUBT Student Branch empowers student innovators through national-level robotics competitions.
            </p>
          </div>
        </div>
      </section>

      {/* ── FLOATING MESSENGER SUPPORT BUTTON ────────────────── */}
      <a
        href="https://m.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-messenger"
        title="Contact Support"
      >
        <MessageSquare size={24} />
      </a>

    </div>
  );
}
