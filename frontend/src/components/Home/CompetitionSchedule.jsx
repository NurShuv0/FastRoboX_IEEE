import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Flame, Trophy, Bot, Cpu, FileText,
  Rocket, Crown, Award, Zap, Users, Sparkles, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SectionHeader } from '../UI/index.jsx';

export default function CompetitionSchedule() {
  const { isDark } = useTheme();

  const scheduleDays = [
    {
      dayNumber: 'DAY 01',
      date: '13 NOVEMBER 2026',
      title: 'MAIN COMPETITION DAY',
      tagline: 'High-octane robotics battles, continuous code sprints, and technological innovations.',
      activitiesSummary: 'Robotics Competitions • Hackathon • Poster Presentation • Project Showcase',
      theme: {
        accent: '#dc2626',
        accentLight: '#ef4444',
        text: isDark ? '#fca5a5' : '#b91c1c',
        bgPill: isDark ? 'rgba(220, 38, 38, 0.14)' : 'rgba(254, 226, 226, 0.9)',
        border: 'rgba(220, 38, 38, 0.3)',
        cardBg: isDark
          ? 'linear-gradient(145deg, rgba(220, 38, 38, 0.08) 0%, rgba(15, 23, 42, 0.92) 100%)'
          : 'linear-gradient(145deg, rgba(254, 242, 242, 0.95) 0%, #ffffff 100%)',
        glow: '0 10px 30px rgba(220, 38, 38, 0.15)',
        iconBg: 'rgba(220, 38, 38, 0.15)',
        iconColor: '#ef4444',
      },
      icon: <Flame size={22} />,
      activities: [
        {
          name: 'Robotics Competitions',
          detail: 'High-speed Line Follower Robot (LFR) trials & action-packed Robo Soccer matches in the arena.',
          icon: <Bot size={18} />,
        },
        {
          name: 'Hackathon',
          detail: 'Techathon software marathon tackling complex industrial & autonomous problem statements.',
          icon: <Cpu size={18} />,
        },
        {
          name: 'Poster Presentation',
          detail: 'Academic research papers, emerging AI concepts, and scientific posters evaluated by judges.',
          icon: <FileText size={18} />,
        },
        {
          name: 'Project Showcase',
          detail: 'Live hardware demonstration of groundbreaking student innovations across Senior & Junior divisions.',
          icon: <Rocket size={18} />,
        },
      ],
    },
    {
      dayNumber: 'DAY 02',
      date: '14 NOVEMBER 2026',
      title: 'GRAND FINALE & SPECIAL DAY',
      tagline: 'Intellectual olympiads, distinguished dignitary keynotes, and the grand awards gala.',
      activitiesSummary: 'Olympiads • Special Guests • Prize Giving Ceremony',
      theme: {
        accent: '#d97706',
        accentLight: '#f59e0b',
        text: isDark ? '#fcd34d' : '#b45309',
        bgPill: isDark ? 'rgba(245, 158, 11, 0.14)' : 'rgba(254, 243, 199, 0.9)',
        border: 'rgba(245, 158, 11, 0.3)',
        cardBg: isDark
          ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.92) 100%)'
          : 'linear-gradient(145deg, rgba(255, 251, 235, 0.95) 0%, #ffffff 100%)',
        glow: '0 10px 30px rgba(245, 158, 11, 0.15)',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        iconColor: '#f59e0b',
      },
      icon: <Trophy size={22} />,
      activities: [
        {
          name: 'Olympiads',
          detail: 'Rigorous cognitive robotics, electronics, and logic Olympiad challenges for sharpest minds.',
          icon: <Zap size={18} />,
        },
        {
          name: 'Special Guests',
          detail: 'Inspiring keynote addresses from Honʼble State Minister, distinguished deans, and tech titans.',
          icon: <Crown size={18} />,
        },
        {
          name: 'Prize Giving Ceremony',
          detail: 'Celebration of champions with BDT 250,000+ total prize pool, crests, and honorary awards.',
          icon: <Award size={18} />,
        },
      ],
    },
  ];

  return (
    <section id="schedule" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHeader
          tag="COMPETITION SCHEDULE"
          title="2-DAY EVENT SCHEDULE"
          subtitle="Official timetable for FastRoboX 1.0 — November 13–14, 2026 at BUBT Permanent Campus."
        />

        {/* 2-Day Side-by-Side Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {scheduleDays.map((day, idx) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(0, 0, 0, 0.4), ${day.theme.glow}` }}
              className="glass-card"
              style={{
                borderRadius: 24,
                padding: '2rem 1.75rem',
                background: day.theme.cardBg,
                border: `1.5px solid ${day.theme.border}`,
                boxShadow: isDark
                  ? `0 10px 30px rgba(0, 0, 0, 0.35), ${day.theme.glow}`
                  : `0 6px 20px rgba(0, 0, 0, 0.06)`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle Ambient Top Accent Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${day.theme.accent}, transparent)`,
                }}
              />

              {/* Day Header with Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: day.theme.iconBg,
                      color: day.theme.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 14px ${day.theme.iconBg}`,
                      flexShrink: 0,
                    }}
                  >
                    {day.icon}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '3px 10px',
                        borderRadius: 100,
                        background: day.theme.bgPill,
                        color: day.theme.text,
                        border: `1px solid ${day.theme.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'inline-block',
                      }}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    padding: '5px 12px',
                    borderRadius: 100,
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Calendar size={13} style={{ color: day.theme.iconColor }} />
                  {day.date}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.55rem)',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {day.title}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                {day.tagline}
              </p>

              {/* Activities Highlight Pill (Exact User Requirement) */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${day.theme.border}`,
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: day.theme.text, marginBottom: 5 }}>
                  Key Activities
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {day.activitiesSummary}
                </div>
              </div>

              {/* Structured Activity List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                {day.activities.map((act) => (
                  <div
                    key={act.name}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid var(--border-color)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: day.theme.iconBg,
                        color: day.theme.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {act.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          marginBottom: 2,
                        }}
                      >
                        {act.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.45,
                        }}
                      >
                        {act.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
