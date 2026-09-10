import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, AlertCircle, Download, FileText,
  Cpu, Wifi, Target, Users, Scale, Clock, Flag, Zap,
} from 'lucide-react';
import { SectionHeader, Loader } from '../components/UI/index.jsx';
import { getSegments } from '../services/api';

// ── Static detailed rules per segment slug ──────────────────────
const SEGMENT_RULES = {
  'lfr': {
    tagline: 'Autonomous Track Racing',
    sections: [
      {
        title: 'Overview',
        content: `Fully autonomous robots must follow a black line on a white surface across a complex 15ft × 15ft arena. Two rounds test speed, precision, and engineering reliability. No wireless control allowed — robots must be entirely autonomous.`,
      },
      {
        title: 'Robot Technical Requirements',
        specs: [
          ['Communication', 'NONE — fully autonomous, no wireless'],
          ['Max Dimensions', '25 cm (L) × 25 cm (W) × 15 cm (H)'],
          ['Max Weight', '1 kg'],
          ['Max Battery Voltage', '16V DC'],
          ['Power Source', 'Onboard battery only'],
          ['Ready-made Robots', 'PROHIBITED'],
          ['Track Damage', 'Robot must not damage the track'],
        ],
      },
      {
        title: 'Arena Specifications',
        specs: [
          ['Arena Size', '15 ft × 15 ft (subject to change)'],
          ['Track Color', 'Black lines on white surface'],
          ['Line Width', '25–50 mm ±5%'],
          ['Track Features', 'Round corners, sharp corners (30°/45°/60°/90°), curves, inverse lines, crossovers, gaps, discontinuities'],
        ],
      },
      {
        title: 'Match Format',
        specs: [
          ['Round 1', 'Maximum 300 seconds'],
          ['Round 2', 'Maximum 600 seconds'],
          ['Free Restarts', '2 per run (no penalty)'],
          ['Subsequent Restarts', '-30 points each'],
        ],
      },
      {
        title: 'Scoring',
        list: [
          '+100 points per checkpoint reached',
          'Time bonus applied (faster = more points)',
          '+30 points for stopping at the designated endpoint',
          '+50 points for completing without any restart',
          '-30 points per restart (after the first two)',
          '-20 points for losing the line',
        ],
      },
      {
        title: 'Disqualification Criteria',
        list: [
          'Use of any wireless communication',
          'Robot using external power source',
          'Robot exceeding size/weight limits',
          'Using a ready-made or pre-built robot',
          'Deliberate damage to the arena or track',
          'More than 3 restarts in a single run',
        ],
      },
    ],
  },
  'robo-soccer': {
    tagline: 'Wireless Robot Soccer Matches',
    sections: [
      {
        title: 'Overview',
        content: `Wireless-controlled robots compete head-to-head in a soccer match on a 4ft × 8ft arena. Matches are 6 minutes total with two 3-minute halves. Strategy, speed, and precision are key. Wireless communication is mandatory — wired control is prohibited.`,
      },
      {
        title: 'Eligibility',
        list: [
          'Undergraduate students from colleges and universities in Bangladesh',
          'Minimum 4 members per team (required); maximum 8 members',
          'All team members must be from the same institution',
        ],
      },
      {
        title: 'Robot Technical Requirements',
        specs: [
          ['Communication', 'REQUIRED — RF, NRF, or Bluetooth'],
          ['Wired Communication', 'PROHIBITED'],
          ['Max Length', '25 cm ±5%'],
          ['Max Width', '25 cm ±5%'],
          ['Max Height', '20 cm ±5%'],
          ['Max Weight', '3 kg'],
          ['Max Onboard Voltage', '12V'],
          ['External Power', 'PROHIBITED'],
          ['Kill Switch', 'Required (emergency shutdown)'],
          ['Weapons / Jammers', 'PROHIBITED'],
          ['Ready-made toy chassis', 'PROHIBITED — DIY strongly encouraged'],
        ],
      },
      {
        title: 'Arena Specifications',
        specs: [
          ['Arena Size', '4 ft × 8 ft'],
          ['Boundary Wall', '5–10 inches'],
          ['Goal Bar', '15–20 inches'],
          ['Ball', 'Provided by organizers'],
        ],
      },
      {
        title: 'Match Format & Scoring',
        specs: [
          ['Total Duration', '6 minutes'],
          ['First Half', '3 minutes'],
          ['Half-time Break', '2 minutes'],
          ['Second Half', '3 minutes'],
          ['Goal', '+100 points'],
          ['Foul', '-50 points'],
          ['Free Restart', '1 allowed per match (no penalty)'],
          ['Additional Restarts', '-100 points each (max 2 restarts total)'],
        ],
      },
      {
        title: 'Disqualification Criteria',
        list: [
          'Deliberate physical damage to the opponent robot',
          'Using jamming devices',
          'Wired communication or external power',
          'Prohibited equipment (ready-made toy chassis, weapons)',
          'More than 2 manual restarts per match',
          'Unsportsmanlike behavior by team members',
        ],
      },
    ],
  },
  'project-showcase': {
    tagline: 'Junior & Senior Categories',
    sections: [
      {
        title: 'Overview',
        content: `A platform for students to present innovative projects across two levels: Junior (Class 5–12) and Senior (University & Polytechnic). Teams present for 5–7 minutes followed by a 3–5 minute Q&A with expert judges.`,
      },
      {
        title: 'Eligibility',
        list: [
          'Junior Category: Currently enrolled students in Class 5–12',
          'Senior Category: Currently enrolled university or polytechnic students',
          'Mixed institution teams allowed within the same category',
          'Maximum 4 members per team; additional members at ৳500/person',
        ],
      },
      {
        title: 'Presentation Format',
        specs: [
          ['Presentation Time', '5–7 minutes'],
          ['Q&A Time', '3–5 minutes'],
          ['Language', 'English or Bangla'],
          ['Materials', 'Working prototype / live demo strongly recommended'],
        ],
      },
      {
        title: 'Judging Criteria (100 marks)',
        specs: [
          ['Innovation & Creativity', '20 marks'],
          ['Technical Complexity', '20 marks'],
          ['Functionality & Implementation', '20 marks'],
          ['Practical Impact', '15 marks'],
          ['Presentation & Communication', '15 marks'],
          ['Design & User Experience', '10 marks'],
        ],
      },
      {
        title: 'General Rules',
        list: [
          'All projects must be original work of the team.',
          'Only officially registered teams may present.',
          'Teams must be present at the designated time slot.',
          'Decision of judges is final.',
        ],
      },
    ],
  },
  'project-showcase-senior': {
    tagline: 'Senior Category',
    sections: [
      {
        title: 'Overview',
        content: `University & Polytechnic students present advanced projects in Robotics, AI, IoT, Healthcare, Energy, and Automation. Presentation is 5–7 mins followed by 3–5 mins Q&A.`,
      },
      {
        title: 'Eligibility',
        list: [
          'Currently enrolled University & Polytechnic students',
          'Maximum 4 members per team',
        ],
      },
      {
        title: 'Presentation Format',
        specs: [
          ['Presentation Time', '5–7 minutes'],
          ['Q&A Time', '3–5 minutes'],
          ['Language', 'English or Bangla'],
        ],
      },
    ],
  },
  'project-showcase-junior': {
    tagline: 'Junior Category',
    sections: [
      {
        title: 'Overview',
        content: `School & College students (Class 5–12) showcase science, electronics, and technology projects. Presentation is 5–7 mins followed by 3–5 mins Q&A.`,
      },
      {
        title: 'Eligibility',
        list: [
          'Currently enrolled students in Class 5–12 (School & College level)',
          'Maximum 4 members per team',
        ],
      },
    ],
  },
  'poster-presentation': {
    tagline: 'Academic Research Showcase',
    sections: [
      {
        title: 'Overview',
        content: `Teams of 3–4 undergraduate students present their research findings on a 4×4 feet poster to a panel of expert judges. Six research tracks span AI/ML, IoT, healthcare, energy, humanitarian tech, and advanced materials.`,
      },
      {
        title: 'Eligibility',
        list: [
          'Currently enrolled undergraduate students from any recognized institution in Bangladesh',
          'Team size: exactly 3–4 members',
          'Research must be original work of the team',
        ],
      },
      {
        title: 'Six Research Tracks',
        list: [
          'Track 1 — Intelligent Computing, AI & Data Technologies',
          'Track 2 — Smart Systems, IoT, Robotics & Secure Technologies',
          'Track 3 — Smart Healthcare & Biomedical Engineering',
          'Track 4 — Renewable Energy, Smart Grids & Power Systems',
          'Track 5 — Humanitarian & Societal Technological Solutions',
          'Track 6 — Advanced Materials & Nanotechnology',
        ],
      },
      {
        title: 'Submission Requirements',
        specs: [
          ['Format', 'PDF only'],
          ['Poster Size', 'Maximum 4 × 4 feet'],
          ['Deadline', 'Before registration closes (20 October 2026)'],
          ['Languages', 'English preferred'],
        ],
      },
      {
        title: 'Judging Criteria (60 marks)',
        specs: [
          ['Content Quality', '10 marks'],
          ['Creativity', '10 marks'],
          ['Visual Presentation & Layout', '10 marks'],
          ['Originality', '10 marks'],
          ['Presentation + Q&A', '20 marks'],
          ['Feasibility', '10 marks'],
        ],
      },
    ],
  },
};

function CompetitionSection({ title, content, list, specs }) {
  return (
    <div className="rulebook-section">
      <h3><BookOpen size={15} /> {title}</h3>
      {content && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: list || specs ? '1rem' : 0 }}>{content}</p>}
      {list && (
        <ul className="rulebook-rule-list">
          {list.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
      {specs && (
        <div style={{ overflowX: 'auto' }}>
          <table className="spec-table">
            <tbody>
              {specs.map(([key, val], i) => (
                <tr key={i}>
                  <td>{key}</td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Rulebook() {
  const location = useLocation();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getSegments()
      .then(r => {
        const segs = r.data.data || [];
        setSegments(segs);
        // Pre-select segment from navigation state (from Segments page Details button),
        // otherwise default to the first segment
        const incoming = location.state?.segmentId;
        const found = incoming && segs.find(s => s.id === incoming);
        setActiveId(found ? incoming : (segs[0]?.id ?? null));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSeg = segments.find(s => s.id === activeId);
  const staticRules = activeSeg ? (SEGMENT_RULES[activeSeg.slug] || null) : null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SectionHeader
          tag="Official Rulebook"
          title="Competition Rules & Regulations"
          subtitle="Complete technical specifications, eligibility criteria, and judging guidelines for all FASTROBOX 1.0 competitions."
        />

        {/* Disclaimer */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 20px', background: 'rgba(234,179,8,0.08)',
          border: '1px solid rgba(234,179,8,0.2)', borderRadius: 12, marginBottom: '2.5rem',
        }}>
          <AlertCircle size={18} style={{ color: '#eab308', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Official Rulebook:</strong> The information below reflects the official FASTROBOX 1.0 Combined Rulebook &amp; Event Overview.
            Organizers reserve the right to amend rules before the event. Registered participants will be notified of any changes via the Notice Board.
          </div>
        </div>

        {loading ? (
          <Loader text="Loading competitions..." />
        ) : segments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <BookOpen size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No competition segments available yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}
               className="rulebook-grid">

            {/* Left sidebar — segment nav */}
            <div className="glass-card" style={{ padding: '1rem', position: 'sticky', top: 88 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', padding: '0 4px' }}>
                Competitions
              </div>
              {segments.map(seg => (
                <button
                  key={seg.id}
                  onClick={() => setActiveId(seg.id)}
                  className={`rulebook-nav-item ${activeId === seg.id ? 'active' : ''}`}
                >
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{seg.name}</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                      {seg.min_team_size}–{seg.max_team_size} members · ৳{Math.round(seg.registration_fee).toLocaleString()}
                    </div>
                  </div>
                  {activeId === seg.id && <ChevronRight size={14} />}
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
                  <Zap size={14} /> Register Now
                </Link>
              </div>
            </div>

            {/* Right — active segment content */}
            {activeSeg && (
              <motion.div
                key={activeSeg.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header card */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderColor: 'rgba(34,197,94,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: activeSeg.rulebook_path ? '1.5rem' : 0 }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                        {staticRules?.tagline || 'Competition Segment'}
                      </div>
                      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 0 }}>
                        {activeSeg.name}
                      </h1>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag tag-green" style={{ fontSize: '0.78rem' }}>Fee: ৳{Math.round(activeSeg.registration_fee).toLocaleString()}</span>
                      <span className="tag tag-blue" style={{ fontSize: '0.78rem' }}>Team: {activeSeg.min_team_size}–{activeSeg.max_team_size} members</span>
                    </div>
                  </div>

                  {/* Rulebook PDF button — shown only if admin uploaded a PDF */}
                  {activeSeg.rulebook_path && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 16, flexWrap: 'wrap',
                      padding: '16px 20px',
                      background: 'rgba(34,197,94,0.06)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: 12,
                      marginTop: activeSeg.rulebook_path ? '1.5rem' : 0,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 11,
                          background: 'rgba(34,197,94,0.12)',
                          border: '1px solid rgba(34,197,94,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-primary)', flexShrink: 0,
                        }}>
                          <FileText size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            Official Rulebook PDF
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            Full technical specifications for {activeSeg.name}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <a
                          href={`/uploads/rulebooks/${activeSeg.rulebook_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <BookOpen size={14} /> View PDF
                        </a>
                        <a
                          href={`/uploads/rulebooks/${activeSeg.rulebook_path}`}
                          download
                          className="btn btn-primary btn-sm"
                        >
                          <Download size={14} /> Download
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Static rule sections (if available for this slug) */}
                {staticRules ? (
                  <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
                    {staticRules.sections.map(sec => (
                      <CompetitionSection key={sec.title} {...sec} />
                    ))}
                  </div>
                ) : (
                  /* Fallback: show whatever is stored in DB */
                  <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
                    {activeSeg.full_description && (
                      <div className="rulebook-section">
                        <h3><BookOpen size={15} /> Overview</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>{activeSeg.full_description}</p>
                      </div>
                    )}
                    {activeSeg.rules && (
                      <div className="rulebook-section">
                        <h3><BookOpen size={15} /> Rules</h3>
                        <ul className="rulebook-rule-list">
                          {activeSeg.rules.split('\n').filter(Boolean).map((r, i) => (
                            <li key={i}>{r.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activeSeg.eligibility && (
                      <div className="rulebook-section">
                        <h3><BookOpen size={15} /> Eligibility</h3>
                        <ul className="rulebook-rule-list">
                          {activeSeg.eligibility.split('\n').filter(Boolean).map((e, i) => (
                            <li key={i}>{e.replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!activeSeg.full_description && !activeSeg.rules && !activeSeg.eligibility && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={36} style={{ opacity: 0.3, marginBottom: 12, color: 'var(--color-primary)' }} />
                        <p>Detailed rules for this segment are coming soon.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .rulebook-grid {
            grid-template-columns: 1fr !important;
          }
          .rulebook-grid > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
