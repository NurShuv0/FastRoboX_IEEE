import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Calendar, Trophy, Flag, BookOpen,
  Clock, CreditCard, Layers, Zap, Award
} from 'lucide-react';
import { getTimeline } from '../services/api';
import { SectionHeader, Loader, EmptyState, StatusBadge } from '../components/UI/index.jsx';

// Map icon slug → Lucide component (no emoji)
const ICON_MAP = {
  flag: <Flag size={14} />,
  'book-open': <BookOpen size={14} />,
  clock: <Clock size={14} />,
  'credit-card': <CreditCard size={14} />,
  'check-circle': <CheckCircle size={14} />,
  layers: <Layers size={14} />,
  zap: <Zap size={14} />,
  trophy: <Trophy size={14} />,
  award: <Award size={14} />,
  calendar: <Calendar size={14} />,
};

function formatEventDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimeline()
      .then(r => setEvents(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SectionHeader
          tag="Event Schedule"
          title="FASTROBOX 1.0 Timeline"
          subtitle="Key dates and milestones. Registration opens 7 September 2026 and closes 20 October 2026. The event is on 14 November 2026 at BUBT."
        />

        {loading ? (
          <Loader text="Loading timeline..." />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Calendar size={36} />}
            title="Timeline Coming Soon"
            message="The full event schedule will be published shortly. Check back soon."
          />
        ) : (
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Vertical gradient line */}
            <div style={{
              position: 'absolute',
              left: 18, top: 20, bottom: 0,
              width: 2,
              background: 'linear-gradient(to bottom, var(--color-primary), rgba(34,197,94,0.05))',
            }} />

            {events.map((event, i) => {
              const isCompleted = event.status === 'completed';
              const isActive    = event.status === 'active';
              const icon = ICON_MAP[event.icon] || <Calendar size={14} />;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{ marginBottom: '1.75rem', position: 'relative' }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: -38, top: 14,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--color-primary)' : isActive ? 'var(--color-primary)' : 'var(--bg-card)',
                    border: `2px solid ${isCompleted || isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    boxShadow: isActive ? '0 0 14px rgba(34,197,94,0.55)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                    transition: 'all 0.3s',
                  }}>
                    {isCompleted && <CheckCircle size={11} color="#052e16" strokeWidth={2.5} />}
                    {isActive && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#052e16',
                        animation: 'blink 1.5s ease-in-out infinite',
                      }} />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`glass-card ${isActive ? 'glow-border' : ''}`}
                    style={{
                      padding: '1.25rem 1.5rem',
                      opacity: isCompleted ? 0.65 : 1,
                      borderColor: isActive ? 'var(--color-primary)' : undefined,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      {/* Title with icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.07)',
                          border: '1px solid rgba(34,197,94,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-primary)', flexShrink: 0,
                        }}>
                          {icon}
                        </div>
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                        }}>
                          {event.title}
                        </h3>
                      </div>
                      <StatusBadge status={event.status} />
                    </div>

                    {event.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: 10 }}>
                        {event.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: isActive ? 'var(--color-primary)' : 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Calendar size={12} />
                      {formatEventDate(event.event_date)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
