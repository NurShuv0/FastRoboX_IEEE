import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle, Calendar, Award } from 'lucide-react';
import { getTimeline } from '../services/api';
import { SectionHeader, Loader, EmptyState, StatusBadge } from '../components/UI/index.jsx';

const iconMap = {
  flag: '🚩', 'book-open': '📖', clock: '⏰', 'credit-card': '💳',
  'check-circle': '✅', layers: '📑', zap: '⚡', trophy: '🏆',
  award: '🏅', calendar: '📅',
};

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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <SectionHeader
          tag="Event Schedule"
          title="Competition Timeline"
          subtitle="Key dates and milestones for FastRobox 1.0. Mark your calendar and stay on track."
        />

        {loading ? (
          <Loader text="Loading timeline..." />
        ) : events.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="Timeline Coming Soon" message="Event schedule will be published shortly." />
        ) : (
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 18,
              top: 20,
              bottom: 0,
              width: 2,
              background: `linear-gradient(to bottom, var(--color-primary), rgba(34,197,94,0.1))`,
            }} />

            {events.map((event, i) => {
              const isCompleted = event.status === 'completed';
              const isActive = event.status === 'active';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ marginBottom: '2rem', position: 'relative' }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute',
                    left: -38,
                    top: 8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--color-primary)' : isActive ? 'var(--color-primary)' : 'var(--bg-card)',
                    border: `2px solid ${isCompleted || isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    boxShadow: isActive ? '0 0 12px rgba(34,197,94,0.6)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    {isCompleted && <CheckCircle size={10} color="#052e16" strokeWidth={3} />}
                    {isActive && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#052e16',
                        animation: 'blink 1.5s ease-in-out infinite',
                      }} />
                    )}
                  </div>

                  <div
                    className={`glass-card ${isActive ? 'glow-border' : ''}`}
                    style={{
                      padding: '1.25rem 1.5rem',
                      opacity: isCompleted ? 0.7 : 1,
                      borderColor: isActive ? 'var(--color-primary)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.3rem' }}>{iconMap[event.icon] || '📅'}</span>
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.95rem',
                          color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                        }}>{event.title}</h3>
                      </div>
                      <StatusBadge status={event.status} />
                    </div>

                    {event.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 10 }}>
                        {event.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Calendar size={12} />
                      {new Date(event.event_date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}
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
