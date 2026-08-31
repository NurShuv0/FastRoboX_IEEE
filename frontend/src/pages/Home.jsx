import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, ChevronRight, Trophy, Users, Building2, Star,
  ArrowRight, Calendar, Clock, DollarSign, Bot, Cpu, Code2
} from 'lucide-react';
import { getSegments, getSponsors } from '../services/api';
import { SectionHeader, Loader, EmptyState } from '../components/UI/index.jsx';

// ── COUNTDOWN ────────────────────────────────────────────────────
function Countdown({ targetDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const boxes = [
    { val: time.d, label: 'Days' },
    { val: time.h, label: 'Hours' },
    { val: time.m, label: 'Mins' },
    { val: time.s, label: 'Secs' },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {boxes.map(({ val, label }) => (
        <div key={label} className="countdown-box">
          <div className="countdown-number">{String(val).padStart(2, '0')}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
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
function SegmentCard({ seg }) {
  const icons = { 'robo-soccer': '⚽', 'line-follower': '🚗', 'project-showcase': '💡' };
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 0 40px rgba(34,197,94,0.25)' }}
      transition={{ duration: 0.2 }}
      className="glass-card"
      style={{ overflow: 'hidden', cursor: 'default' }}
    >
      {/* Image / Icon Banner */}
      <div style={{
        height: 160,
        background: `linear-gradient(135deg, rgba(10,15,10,0.9) 0%, rgba(16,28,16,0.8) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '4rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)',
      }}>
        {seg.image_path
          ? <img src={`/uploads/segments/${seg.image_path}`} alt={seg.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.5 }} />
          : null}
        <div style={{ position: 'relative', zIndex: 1, fontSize: '3.5rem', filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.5))' }}>
          {icons[seg.slug] || '🤖'}
        </div>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 8, padding: '3px 10px',
          fontSize: '0.72rem', fontWeight: 700,
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-heading)',
        }}>
          ৳{seg.prize_pool ? 'Prize Pool' : 'Open'}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 8, color: 'var(--text-primary)' }}>
          {seg.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          {seg.short_description}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="tag tag-green">Fee: ৳{seg.registration_fee}</span>
          <span className="tag tag-blue">Team: {seg.min_team_size}–{seg.max_team_size}</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/segments/${seg.id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
            Details
          </Link>
          <Link to={`/register?segment=${seg.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
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

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Robotics Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(5,15,8,0.72) 0%, rgba(5,15,8,0.88) 75%, var(--bg-primary) 100%), url('/images/hero_robotics_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.85,
          zIndex: 0,
        }} />

        {/* Background glows */}
        <div className="hero-glow" style={{
          width: 600, height: 600, top: -100, left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)',
        }} />
        <div className="hero-glow" style={{
          width: 300, height: 300, bottom: 0, left: '10%',
          background: 'radial-gradient(ellipse, rgba(163,230,53,0.12) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: 900, width: '100%', textAlign: 'center', position: 'relative' }}>
          {/* Event Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 20px',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 100,
              background: 'rgba(34,197,94,0.08)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              <span className="animate-blink" style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'inline-block',
              }} />
              Registrations Open — October 18–19, 2026
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              width: 90, height: 90,
              background: 'var(--gradient-primary)',
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.15)',
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
              letterSpacing: '-0.03em',
            }}
          >
            FastRobox 1.0
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            National Robotics &amp; Technology Competition
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            Where Machines Think, Innovators Rise, and Champions Are Made.
            Hosted by <strong style={{ color: 'var(--color-primary)' }}>Bangladesh University of Business and Technology</strong>.
          </motion.p>

          {/* Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}
          >
            {[
              { icon: <Calendar size={14} />, text: 'Oct 18–19, 2026' },
              { icon: <Clock size={14} />, text: 'Deadline: Sep 25, 2026' },
              { icon: <Trophy size={14} />, text: 'Prize Pool: ৳1,40,000+' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 8,
                fontSize: '0.82rem',
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
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Registration closes in
            </div>
            <Countdown targetDate="2026-09-25T23:59:59" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/register" className="btn btn-primary btn-xl">
              <Zap size={18} /> Register Now
            </Link>
            <a
              href="#segments"
              className="btn btn-outline btn-xl"
              onClick={e => {
                e.preventDefault();
                document.getElementById('segments')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Segments <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section ref={aboutRef} style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            tag="About the Event"
            title="What is FastRobox 1.0?"
            subtitle="A national-level platform uniting Bangladesh's brightest engineering minds through the power of robotics, AI, and innovation."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              {
                icon: <Bot size={22} />,
                title: 'Our Mission',
                text: 'To cultivate innovation, technical excellence, and collaborative spirit among the next generation of robotics and technology leaders in Bangladesh.',
              },
              {
                icon: <Star size={22} />,
                title: 'Our Vision',
                text: 'To build a thriving ecosystem where students transform bold ideas into real-world robotic solutions that address national challenges.',
              },
              {
                icon: <Cpu size={22} />,
                title: 'Why Join?',
                text: 'Network with industry leaders, showcase your skills to top companies, win major prizes, and put your university on the national robotics map.',
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
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem', marginBottom: 8, color: 'var(--text-primary)'
                }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <AnimStat value="500" suffix="+" label="Expected Participants" icon={<Users size={22} />} />
            <AnimStat value="30" suffix="+" label="Universities" icon={<Building2 size={22} />} />
            <AnimStat value="3" suffix="" label="Competition Segments" icon={<Code2 size={22} />} />
            <AnimStat value="140000" suffix="৳" label="Total Prize Pool" icon={<Trophy size={22} />} />
          </div>
        </div>
      </section>

      {/* ── SEGMENTS ─────────────────────────────────────────── */}
      <section id="segments" style={{ padding: '80px 24px', position: 'relative', zIndex: 1, background: 'rgba(34,197,94,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            tag="Competition Segments"
            title="Choose Your Battle"
            subtitle="Three electrifying competitions await. Pick your challenge, assemble your team, and compete for glory."
          />
          {segLoading ? (
            <Loader text="Loading competition segments..." />
          ) : segments.length === 0 ? (
            <EmptyState icon="🤖" title="Segments Coming Soon" message="Competition segments will be announced shortly. Stay tuned!" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {segments.map(seg => <SegmentCard key={seg.id} seg={seg} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── HOSTED BY ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <SectionHeader tag="Host Institution" title="Hosted By" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card gradient-border"
            style={{ padding: '3rem', position: 'relative' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 900,
              color: '#052e16',
            }}>B</div>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.4rem',
              color: 'var(--color-primary)', marginBottom: 6,
            }}>
              Bangladesh University of Business and Technology
            </h3>
            <div style={{
              fontSize: '0.85rem', color: 'var(--text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem',
            }}>BUBT — Dhaka, Bangladesh</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
              BUBT is a leading private university in Bangladesh committed to academic excellence, research, and innovation.
              As the proud host of FastRobox 1.0, BUBT continues its tradition of empowering students through technology competitions
              that bridge academia and industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SPONSORS ──────────────────────────────────────────── */}
      <section id="sponsors" style={{ padding: '80px 24px', position: 'relative', zIndex: 1, background: 'rgba(34,197,94,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            tag="Our Partners"
            title="Sponsors & Partners"
            subtitle="We thank our generous sponsors and partners for making FastRobox 1.0 possible."
          />
          {sponLoading ? (
            <Loader text="Loading sponsors..." />
          ) : Object.keys(sponsorsByCategory).length === 0 ? (
            <EmptyState icon="🏆" title="Sponsors Announced Soon" message="Partnership announcements coming soon. Interested in sponsoring? Contact us!" />
          ) : (
            Object.entries(sponsorsByCategory).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '3rem' }}>
                <div style={{
                  textAlign: 'center', marginBottom: '1.5rem',
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em',
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
                    <a key={sp.id} href={sp.website_url || '#'} target="_blank" rel="noreferrer" className="sponsor-logo-card">
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
              background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(163,230,53,0.04) 100%)',
              borderColor: 'rgba(34,197,94,0.3)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: 'var(--text-primary)', marginBottom: 12,
            }}>
              Ready to Compete?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Registration closes <strong style={{ color: 'var(--color-primary)' }}>September 25, 2026</strong>.
              Don't miss your chance to compete at the national level.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
