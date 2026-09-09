import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, AlertCircle, Download, Trophy,
  Cpu, Wifi, Target, Users, Scale, Clock, Flag, Zap,
  CheckCircle, XCircle
} from 'lucide-react';
import { SectionHeader } from '../components/UI/index.jsx';

const COMPETITIONS = [
  {
    id: 'project-showcase',
    name: 'Project Showcasing',
    tagline: 'Junior & Senior Categories',
    team: '1–4 members (+৳500/extra)',
    fee: '৳2,000',
    prize: '৳30,000 total',
    prizeDetails: [
      { place: '🥇 Champion', amount: '৳15,000', color: '#eab308' },
      { place: '🥈 1st Runner-up', amount: '৳10,000', color: '#94a3b8' },
      { place: '🥉 2nd Runner-up', amount: '৳5,000', color: '#b45309' },
    ],
    isTBA: false,
    sections: [
      {
        title: 'Overview',
        content: `A platform for students to present innovative projects across two levels: Junior (Class 5–12) and Senior (University & Polytechnic). Teams present for 5–7 minutes followed by a 3–5 minute Q&A with expert judges. Categories span robotics, AI, IoT, embedded systems, healthcare, energy, drones, and more.`,
      },
      {
        title: 'Eligibility',
        content: null,
        list: [
          'Junior Category: Currently enrolled students in Class 5–12 (school/college level)',
          'Senior Category: Currently enrolled students at any university or polytechnic institute in Bangladesh',
          'Mixed institution teams allowed within the same category',
          'Maximum 4 members per team; additional members at ৳500/person',
        ],
      },
      {
        title: 'Project Categories',
        content: null,
        list: [
          'Robotics and Automation',
          'Internet of Things (IoT)',
          'Artificial Intelligence and Machine Learning',
          'Embedded Systems',
          'Smart Agriculture',
          'Smart Healthcare',
          'Renewable Energy and Sustainability',
          'Software Applications',
          'Drone and Autonomous Systems',
          'Innovative Hardware Solutions',
          'Cybersecurity and Smart Systems',
          'Open Innovation',
        ],
      },
      {
        title: 'Presentation Format',
        content: null,
        specs: [
          ['Presentation Time', '5–7 minutes'],
          ['Q&A Time', '3–5 minutes'],
          ['Language', 'English or Bangla'],
          ['Required Materials', 'Working prototype / live demo strongly recommended'],
        ],
      },
      {
        title: 'Judging Criteria (100 marks)',
        content: null,
        specs: [
          ['Innovation & Creativity', '20 marks'],
          ['Technical Complexity', '20 marks'],
          ['Functionality & Implementation', '20 marks'],
          ['Practical Impact & Usefulness', '15 marks'],
          ['Presentation & Communication', '15 marks'],
          ['Design & User Experience', '10 marks'],
        ],
      },
      {
        title: 'General Rules',
        content: null,
        list: [
          'All projects must be original work of the team. Plagiarism leads to immediate disqualification.',
          'Only officially registered teams may present.',
          'Teams must be present at the designated time slot. No extensions granted.',
          'Organizers reserve the right to verify team eligibility and project originality.',
          'Decision of judges is final.',
        ],
      },
    ],
  },
  {
    id: 'line-follower',
    name: 'Line Following Robot (LFR)',
    tagline: 'Autonomous Track Racing',
    team: '1–5 members',
    fee: '৳2,000',
    prize: 'To Be Announced',
    prizeDetails: null,
    isTBA: true,
    sections: [
      {
        title: 'Overview',
        content: `Fully autonomous robots must follow a black line on a white surface across a complex 15ft × 15ft arena. Two rounds test speed, precision, and engineering reliability. No wireless control allowed — robots must be entirely autonomous.`,
      },
      {
        title: 'Robot Technical Requirements',
        content: null,
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
        content: null,
        specs: [
          ['Arena Size', '15 ft × 15 ft (subject to change)'],
          ['Track Color', 'Black lines on white surface'],
          ['Line Width', '25–50 mm ±5%'],
          ['Track Features', 'Round corners, sharp corners (30°/45°/60°/90°), curves, inverse lines, crossovers, gaps, discontinuities'],
        ],
      },
      {
        title: 'Match Format',
        content: null,
        specs: [
          ['Round 1', 'Maximum 300 seconds'],
          ['Round 2', 'Maximum 600 seconds'],
          ['Free Restarts', '2 per run (no penalty)'],
          ['Subsequent Restarts', '-30 points each'],
        ],
      },
      {
        title: 'Scoring',
        content: null,
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
        content: null,
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
  {
    id: 'robo-soccer',
    name: 'Robo Soccer',
    tagline: 'Wireless Robot Soccer Matches',
    team: '4–8 members',
    fee: '৳2,000',
    prize: '৳30,000 total',
    prizeDetails: [
      { place: '🥇 Champion', amount: '৳15,000', color: '#eab308' },
      { place: '🥈 1st Runner-up', amount: '৳10,000', color: '#94a3b8' },
      { place: '🥉 2nd Runner-up', amount: '৳5,000', color: '#b45309' },
    ],
    isTBA: false,
    sections: [
      {
        title: 'Overview',
        content: `Wireless-controlled robots compete head-to-head in a soccer match on a 4ft × 8ft arena. Matches are 6 minutes total with two 3-minute halves. Strategy, speed, and precision are key. Wireless communication is mandatory — wired control is prohibited.`,
      },
      {
        title: 'Eligibility',
        content: null,
        list: [
          'Undergraduate students from colleges and universities in Bangladesh',
          'Minimum 4 members per team (required); maximum 8 members',
          'All team members must be from the same institution',
        ],
      },
      {
        title: 'Robot Technical Requirements',
        content: null,
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
        content: null,
        specs: [
          ['Arena Size', '4 ft × 8 ft'],
          ['Boundary Wall', '5–10 inches'],
          ['Goal Bar', '15–20 inches'],
          ['Ball', 'Provided by organizers'],
        ],
      },
      {
        title: 'Match Format & Scoring',
        content: null,
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
        content: null,
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
  {
    id: 'techathon',
    name: 'Techathon (IoT Hackathon)',
    tagline: 'Two-Round IoT Challenge',
    team: '1–4 members',
    fee: 'Round 1: ৳100 | Grand Finale: ৳2,400',
    prize: '৳30,000 total',
    prizeDetails: [
      { place: '🥇 Champion', amount: '৳15,000', color: '#eab308' },
      { place: '🥈 1st Runner-up', amount: '৳10,000', color: '#94a3b8' },
      { place: '🥉 2nd Runner-up', amount: '৳5,000', color: '#b45309' },
    ],
    isTBA: false,
    sections: [
      {
        title: 'Overview',
        content: `A two-round IoT hackathon. Round 1 is online — teams receive a problem statement and submit a proposal with a pitch video. Selected teams advance to the Grand Finale at BUBT where they build and demonstrate their IoT solution on-site. Cross-university teams are allowed.`,
      },
      {
        title: 'Eligibility',
        content: null,
        list: [
          'Currently enrolled undergraduate students from any recognized university in Bangladesh',
          'Cross-university teams explicitly ALLOWED',
          'Maximum 4 members per team',
        ],
      },
      {
        title: 'Round 1 (Online)',
        content: null,
        specs: [
          ['Problem Statement', 'Released through official channels'],
          ['Submission Format', 'PDF or PPT + max 3-minute pitch video'],
          ['Max File Size', '20 MB'],
          ['File Naming', 'FASTROBOX_Techathon_[TeamName]_R1'],
          ['Round 1 Fee', 'BDT 100 per team'],
        ],
      },
      {
        title: 'Grand Finale (On-site)',
        content: null,
        specs: [
          ['Eligibility', 'Shortlisted teams from Round 1 only'],
          ['Format', 'On-site project demonstration before judges'],
          ['Grand Finale Fee', 'BDT 2,400 per team (paid after qualification)'],
          ['Location', 'BUBT Campus, Mirpur, Dhaka'],
          ['Date', '14 November 2026'],
        ],
      },
      {
        title: 'Organizer-Provided Equipment',
        content: null,
        list: [
          'Microcontrollers: ESP32, Arduino Uno, Arduino Nano, Raspberry Pi',
          'Sensors: Water-level, ESP32-CAM, Ultrasonic, LDR, Rain, Fire/Flame, DHT, Gas, Soil-moisture',
          'Modules: Relay, Motor driver, Servo, Breadboards, Wires, Power/battery modules',
          'Internet connectivity provided on-site',
        ],
      },
      {
        title: 'Allowed Technology Stack',
        content: null,
        list: [
          'Backend/API: Python, Flask, FastAPI, Node.js, REST APIs',
          'Databases: MySQL, SQLite, Firebase, MongoDB',
          'Interfaces: Mobile apps, Web dashboards, IoT dashboards, Live monitoring, Notification systems',
        ],
      },
      {
        title: 'Disqualification Criteria',
        content: null,
        list: [
          'Plagiarism or submission of pre-existing / open-source solutions without modification',
          'Violation of hardware constraints provided by organizers',
          'Failure to demonstrate working prototype at Grand Finale',
          'Missing the submission deadline',
        ],
      },
    ],
  },
  {
    id: 'poster-presentation',
    name: 'Poster Presentation',
    tagline: 'Academic Research Showcase',
    team: '3–4 members',
    fee: '৳400/member (৳1,200–৳1,600 total)',
    prize: '৳20,000 total',
    prizeDetails: [
      { place: '🥇 Champion', amount: '৳10,000', color: '#eab308' },
      { place: '🥈 1st Runner-up', amount: '৳6,000', color: '#94a3b8' },
      { place: '🥉 2nd Runner-up', amount: '৳4,000', color: '#b45309' },
    ],
    isTBA: false,
    sections: [
      {
        title: 'Overview',
        content: `Teams of 3–4 undergraduate students present their research findings on a 4×4 feet poster to a panel of expert judges. Six research tracks span AI/ML, IoT, healthcare, energy, humanitarian tech, and advanced materials.`,
      },
      {
        title: 'Eligibility',
        content: null,
        list: [
          'Currently enrolled undergraduate students from any recognized institution in Bangladesh',
          'Team size: exactly 3–4 members',
          'Research must be original work of the team',
        ],
      },
      {
        title: 'Six Research Tracks',
        content: null,
        list: [
          'Track 1 — Intelligent Computing, AI & Data Technologies (AI/ML, Data Science, Big Data Analytics)',
          'Track 2 — Smart Systems, IoT, Robotics & Secure Technologies (IoT, Robotics, Mechatronics)',
          'Track 3 — Smart Healthcare & Biomedical Engineering (Smart Healthcare, Biomedical, Biotechnology)',
          'Track 4 — Renewable Energy, Smart Grids & Power Systems (Renewable Energy, Smart Grids, Sustainable Power)',
          'Track 5 — Humanitarian & Societal Technological Solutions (Disaster Management, Assistive Tech, Rural Development)',
          'Track 6 — Advanced Materials & Nanotechnology (Materials Science, Nanotechnology, Advanced Materials)',
        ],
      },
      {
        title: 'Submission Requirements',
        content: null,
        specs: [
          ['Format', 'PDF only'],
          ['Poster Size', 'Maximum 4 × 4 feet'],
          ['File Naming', '[TeamName]_PosterPresentation_FASTROBOX_IEEE'],
          ['Deadline', 'Before registration closes (20 October 2026)'],
          ['Languages', 'English preferred'],
        ],
      },
      {
        title: 'Judging Criteria (60 marks)',
        content: null,
        specs: [
          ['Content Quality', '10 marks'],
          ['Creativity', '10 marks'],
          ['Visual Presentation & Layout', '10 marks'],
          ['Originality', '10 marks'],
          ['Presentation + Q&A', '20 marks'],
          ['Feasibility', '10 marks'],
        ],
      },
      {
        title: 'Fee Structure',
        content: null,
        specs: [
          ['Fee Per Member', 'BDT 400'],
          ['3-member team', 'BDT 1,200 total'],
          ['4-member team', 'BDT 1,600 total'],
          ['Payment Method', 'bKash or Nagad (numbers TBA)'],
          ['Required', 'Transaction ID + payment screenshot'],
        ],
      },
    ],
  },
];

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
  const [activeComp, setActiveComp] = useState('project-showcase');
  const comp = COMPETITIONS.find(c => c.id === activeComp);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SectionHeader
          tag="Official Rulebook"
          title="Competition Rules & Regulations"
          subtitle="Complete technical specifications, eligibility criteria, and judging guidelines for all five FASTROBOX 1.0 competitions."
        />

        {/* Disclaimer */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 20px', background: 'rgba(234,179,8,0.08)',
          border: '1px solid rgba(234,179,8,0.2)', borderRadius: 12, marginBottom: '2.5rem',
        }}>
          <AlertCircle size={18} style={{ color: '#eab308', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Official Rulebook:</strong> The information below reflects the official FASTROBOX 1.0 Combined Rulebook & Event Overview.
            Organizers reserve the right to amend rules before the event. Registered participants will be notified of any changes via the Notice Board.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}
             className="rulebook-grid">

          {/* Left sidebar — competition nav */}
          <div className="glass-card" style={{ padding: '1rem', position: 'sticky', top: 88 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', padding: '0 4px' }}>
              Competitions
            </div>
            {COMPETITIONS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveComp(c.id)}
                className={`rulebook-nav-item ${activeComp === c.id ? 'active' : ''}`}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{c.team}</div>
                </div>
                {activeComp === c.id && <ChevronRight size={14} />}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
                <Zap size={14} /> Register Now
              </Link>
            </div>
          </div>

          {/* Right — active competition content */}
          {comp && (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderColor: 'rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                      {comp.tagline}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 0 }}>
                      {comp.name}
                    </h1>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag tag-green" style={{ fontSize: '0.78rem' }}>Fee: {comp.fee}</span>
                    <span className="tag tag-blue" style={{ fontSize: '0.78rem' }}>Team: {comp.team}</span>
                  </div>
                </div>

                {/* Prize section */}
                {comp.isTBA ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 10 }}>
                    <AlertCircle size={18} style={{ color: '#eab308', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#eab308', fontSize: '0.9rem' }}>Prize Amounts — To Be Announced</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>The organizing committee will announce prize amounts for this competition soon.</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Prize Pool: {comp.prize}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {comp.prizeDetails?.map(p => (
                        <div key={p.place} className="prize-card" style={{ flex: '1 1 120px', minWidth: 110, borderColor: p.color + '40' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{p.place}</div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: p.color }}>{p.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Rules sections */}
              <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
                {comp.sections.map(sec => (
                  <CompetitionSection key={sec.title} {...sec} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
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
