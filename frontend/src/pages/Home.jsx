import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, ChevronRight, Trophy, Users, Building2, ArrowRight,
  Calendar, Clock, Bot, Cpu, Rocket, ChevronDown,
  Radio, GitBranch, Presentation, BookOpen
} from 'lucide-react';
import { getSegments, getSponsors } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { SectionHeader, Loader, EmptyState } from '../components/UI/index.jsx';


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
      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-primary)', fontWeight: 700 }}>
        Event has concluded. Thank you for participating!
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
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, textAlign: 'center' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {boxes.map(({ val, label: l }) => (
          <div key={l} className="countdown-box">
            <div className="countdown-number">{String(val).padStart(2, '0')}</div>
            <div className="countdown-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ANIMATED STAT ────────────────────────────────────────────────
function AnimStat({ value, label, icon, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value);
    const step = Math.ceil(num / 60);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-card"
      style={{ padding: '1.75rem', textAlign: 'center' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1rem',
        color: 'var(--color-primary)',
      }}>
        {icon}
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        fontWeight: 800,
        color: 'var(--color-primary)',
        lineHeight: 1,
      }}>
        {count}{suffix}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 6 }}>{label}</div>
    </motion.div>
  );
}

// ── SEGMENT CARD ────────────────────────────────────────────────
function SegmentCard({ seg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}
      className="glass-card segment-card"
      style={{ overflow: 'hidden', cursor: 'default', display: 'flex', flexDirection: 'column' }}
    >
      {/* Full image banner */}
      <div style={{
        height: 180,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(5,15,8,0.9)',
      }}>
        {seg.image_path ? (
          <img
            src={`/uploads/segments/${seg.image_path}`}
            alt={seg.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(5,15,8,0.9))' }} />
        )}
        {/* Bottom gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(5,15,8,0.82) 100%)' }} />

        {/* Team size tag */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1,
          background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.4)',
          borderRadius: 6, padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700,
          color: 'var(--color-primary)', backdropFilter: 'blur(6px)',
        }}>
          {seg.min_team_size === seg.max_team_size ? `${seg.min_team_size}` : `${seg.min_team_size}–${seg.max_team_size}`} members
        </div>

        {/* Name at bottom of image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px', zIndex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
            {seg.name}
          </h3>
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1rem', flex: 1 }}>
          {seg.short_description}
        </p>

        {/* Fee + Prize */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="tag tag-green" style={{ fontSize: '0.7rem' }}>
            Fee: ৳{Math.round(seg.registration_fee).toLocaleString()}
          </span>
          {seg.prize_pool && (
            <span className="tag tag-yellow" style={{ fontSize: '0.7rem' }}>
              Prize: {seg.prize_pool === 'To Be Announced' ? 'TBA' : seg.prize_pool}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/rulebook" state={{ segmentId: seg.id }} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
            Details
          </Link>
          <Link to={`/register?segment=${seg.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
            Register
          </Link>
        </div>
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

  const eventDate = getSetting('event_date', '2026-11-14');
  const deadline = getSetting('registration_deadline', '2026-10-20');
  const prizePool = getSetting('event_prize_pool', 'BDT 200K+');
  const organizer = getSetting('organizer_name', 'IEEE Students\' Branch');

  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: '-100px' });

  useEffect(() => {
    getSegments().then(r => setSegments(r.data.data || [])).catch(() => {}).finally(() => setSegLoading(false));
    getSponsors().then(r => setSponsors(r.data.data || [])).catch(() => {}).finally(() => setSponLoading(false));
  }, []);

  const sponsorsByCategory = sponsors.reduce((acc, s) => {
    const cat = s.category_name || 'Sponsors';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  // Format date for display
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr + 'T00:00:00+06:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Hero background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(5,15,8,0.65) 0%, rgba(5,15,8,0.85) 70%, var(--bg-primary) 100%), url('/images/hero_robotics_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }} />
        {/* Extra radial glow overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.1) 0%, transparent 60%)',
          zIndex: 0,
        }} />
        {/* Floating segment preview "screens" - decorative CTA style */}
        <div className="hero-floating-screens" style={{
          position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, opacity: 0.18,
          zIndex: 0, pointerEvents: 'none',
        }}>
          {['LFR', 'Robo Soccer', 'Project', 'Poster'].map((label, i) => (
            <div key={label} style={{
              width: 130, height: 80, borderRadius: 10,
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: '#22c55e', fontWeight: 700,
              transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'}) translateY(${i > 1 ? '8px' : '0'})`,
            }}>{label}</div>
          ))}
        </div>

        {/* Background glows */}
        <div className="hero-glow" style={{
          width: 700, height: 700, top: -150, left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 65%)',
        }} />

        <div style={{ maxWidth: 960, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Organizer badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 100,
              background: 'rgba(34,197,94,0.07)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <span className="animate-blink" style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'inline-block',
              }} />
              {organizer} &mdash; Registration Open
            </div>
          </motion.div>

          {/* Logo Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              width: 88, height: 88,
              background: 'var(--gradient-primary)',
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.12)',
            }}
          >
            <Zap size={46} color="#052e16" strokeWidth={2.5} />
          </motion.div>

          {/* Event Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #22c55e 0%, #a3e635 50%, #86efac 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.05,
              marginBottom: '0.5rem',
              letterSpacing: '-0.04em',
            }}
          >
            FASTROBOX 1.0
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            National Robotics &amp; Tech Carnival
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: 'var(--text-muted)',
              maxWidth: 580,
              margin: '0 auto 2rem',
              lineHeight: 1.75,
            }}
          >
            Where machines think, innovators rise, and champions are made.
            Hosted by <strong style={{ color: 'var(--text-secondary)' }}>Bangladesh University of Business and Technology (BUBT)</strong>.
          </motion.p>

          {/* Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}
          >
            {[
              { icon: <Calendar size={14} />, text: formatDate(eventDate) },
              { icon: <Clock size={14} />, text: `Deadline: ${formatDate(deadline)}` },
              { icon: <Trophy size={14} />, text: `Prize Pool: ${prizePool}` },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 15px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.18)',
                borderRadius: 9,
                fontSize: '0.83rem',
                color: 'var(--text-secondary)',
              }}>
                <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
                {text}
              </div>
            ))}
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <Countdown
              targetDate={`${eventDate}T09:00:00+06:00`}
              label="Days until the event"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="hero-cta-group"
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/register" className="btn btn-primary btn-xl">
              <Zap size={18} /> Register Now
            </Link>
            <Link to="/segments" className="btn btn-outline btn-xl">
              Explore Competitions <ChevronRight size={16} />
            </Link>
            <Link to="/rulebook" className="btn btn-ghost btn-xl">
              <BookOpen size={18} /> View Rulebook
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ marginTop: '3rem', color: 'var(--text-dim)' }}
          >
            <ChevronDown size={22} style={{ margin: '0 auto', animation: 'float-up 2s ease-in-out infinite alternate' }} />
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section ref={aboutRef} style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            tag="About the Event"
            title="What is FASTROBOX 1.0?"
            subtitle="A national platform uniting Bangladesh's brightest engineering minds through robotics, technology, and innovation."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              {
                icon: <Bot size={22} />,
                title: 'Our Mission',
                text: 'To cultivate innovation, technical excellence, and collaborative spirit among the next generation of robotics and technology leaders in Bangladesh.',
              },
              {
                icon: <Cpu size={22} />,
                title: 'Five Competitions',
                text: 'Project Showcasing, Line Following Robot, Robo Soccer, Techathon (IoT Hackathon), and Poster Presentation — something for every engineering discipline.',
              },
              {
                icon: <Trophy size={22} />,
                title: 'Why Participate?',
                text: 'Win prizes totaling BDT 200K+, network with industry leaders, showcase your skills to top companies, and represent your university at the national level.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)', marginBottom: '1rem',
                }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <AnimStat value="500" suffix="+" label="Expected Participants" icon={<Users size={22} />} />
            <AnimStat value="30" suffix="+" label="Universities" icon={<Building2 size={22} />} />
            <AnimStat value="5" suffix="" label="Competition Segments" icon={<Cpu size={22} />} />
            <AnimStat value="200" suffix="K+" label="Prize Pool (BDT)" icon={<Trophy size={22} />} />
          </div>
        </div>
      </section>

      {/* ── COMPETITION SEGMENTS ──────────────────────────────── */}
      <section id="segments" style={{ padding: '80px 24px', position: 'relative', zIndex: 1, background: 'rgba(34,197,94,0.02)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            tag="Competition Segments"
            title="Five Ways to Compete"
            subtitle="From autonomous robotics to IoT hackathons, choose your challenge and assemble your team."
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
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {segments.map((seg, i) => <SegmentCard key={seg.id} seg={seg} index={i} />)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link to="/segments" className="btn btn-outline">
                  View All Competition Details <ChevronRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── HOST INSTITUTION ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <SectionHeader tag="Host Institution" title="Organized By" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card gradient-border"
            style={{ padding: '3rem', position: 'relative' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem',
              padding: '10px 20px', background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12,
            }}>
              <Zap size={20} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                IEEE Students' Branch
              </span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800,
              color: 'var(--text-primary)', marginBottom: 6,
            }}>
              Bangladesh University of Business and Technology
            </h3>
            <div style={{
              fontSize: '0.85rem', color: 'var(--text-muted)',
              letterSpacing: '0.06em', marginBottom: '1.25rem',
            }}>BUBT &mdash; Mirpur, Dhaka, Bangladesh</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
              BUBT is a leading private university in Bangladesh committed to academic excellence, research, and innovation.
              As the proud host of FASTROBOX 1.0, the IEEE Students' Branch empowers students through national-level robotics competitions
              that bridge academia and industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SPONSORS ──────────────────────────────────────────── */}
      <section id="sponsors" style={{ padding: '80px 24px', position: 'relative', zIndex: 1, background: 'rgba(34,197,94,0.02)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            tag="Our Partners"
            title="Sponsors &amp; Partners"
            subtitle="We thank our generous sponsors and partners for making FASTROBOX 1.0 possible."
          />
          {sponLoading ? (
            <Loader text="Loading sponsors..." />
          ) : Object.keys(sponsorsByCategory).length === 0 ? (
            <EmptyState
              icon={<Trophy size={40} />}
              title="Sponsors Will Be Announced Soon"
              message="Partnership announcements are coming. Interested in sponsoring FASTROBOX 1.0? Contact the organizing committee."
            />
          ) : (
            Object.entries(sponsorsByCategory).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '3rem' }}>
                <div style={{
                  textAlign: 'center', marginBottom: '1.5rem',
                  fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em',
                  color: 'var(--text-muted)',
                }}>
                  — {cat} —
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${cat === 'Title Sponsor' ? '200px' : '140px'}, 1fr))`,
                  gap: '1rem',
                }}>
                  {items.map(sp => (
                    <a key={sp.id} href={sp.website_url || undefined} target="_blank" rel="noopener noreferrer"
                       className="sponsor-logo-card" style={{ cursor: sp.website_url ? 'pointer' : 'default' }}>
                      {sp.logo_path
                        ? <img src={`/uploads/sponsors/${sp.logo_path}`} alt={sp.name} style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} />
                        : <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--text-muted)' }}>{sp.name}</span>
                      }
                    </a>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{
              textAlign: 'center', padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(163,230,53,0.04) 100%)',
              borderColor: 'rgba(34,197,94,0.25)',
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: 15,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--color-primary)',
            }}>
              <Rocket size={28} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)', marginBottom: 12,
            }}>
              Ready to Compete?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.75 }}>
              Registration closes <strong style={{ color: 'var(--color-primary)' }}>{formatDate(deadline)}</strong>.
              Don't miss your chance to compete at the national level and win from a prize pool of{' '}
              <strong style={{ color: 'var(--color-primary)' }}>{prizePool}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <Zap size={18} /> Register Your Team
              </Link>
              <Link to="/notice" className="btn btn-outline btn-lg">
                View Notices <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
