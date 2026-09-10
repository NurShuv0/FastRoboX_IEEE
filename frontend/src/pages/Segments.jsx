import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Zap, BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import { getSegments } from '../services/api';
import { SectionHeader, Loader } from '../components/UI/index.jsx';

const GOOGLE_FORM_FALLBACKS = {
  'lfr': 'https://forms.gle/TrhrrxYyuEXNjNd69',
  'line-follower': 'https://forms.gle/TrhrrxYyuEXNjNd69',
  'robo-soccer': 'https://forms.gle/SMuDtgRnvGTMQTwG8',
  'project-showcase-senior': 'https://forms.gle/7spkXASp9ELPk4rm6',
  'project-showcase-junior': 'https://forms.gle/hKpZsvudbqxQgugY8',
  'poster-presentation': 'https://forms.gle/RBBnkdgxaZxUvjo1A',
};

const SEGMENT_COLORS = {
  'lfr': 'rgba(59,130,246,0.12)',
  'line-follower': 'rgba(59,130,246,0.12)',
  'robo-soccer': 'rgba(239,68,68,0.12)',
  'project-showcase-senior': 'rgba(34,197,94,0.12)',
  'project-showcase-junior': 'rgba(168,85,247,0.12)',
  'poster-presentation': 'rgba(234,179,8,0.12)',
};

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSegments()
      .then(r => setSegments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 0' }}>
        <SectionHeader
          tag="Competition Segments"
          title="Five Ways to Compete"
          subtitle="FASTROBOX 1.0 features five unique competitions open to students across Bangladesh. Select a category to explore rules, eligibility, and register via official Google Forms."
        />

        {loading ? (
          <Loader text="Loading segments..." />
        ) : segments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Cpu size={48} style={{ color: 'var(--color-primary)', marginBottom: 16, opacity: 0.5 }} />
            <p>Competition segments will be announced soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {segments.map((seg, i) => {
              const bgColor = SEGMENT_COLORS[seg.slug] || 'rgba(34,197,94,0.12)';
              const isTBA = seg.prize_pool === 'To Be Announced';
              const formUrl = seg.google_form_url || GOOGLE_FORM_FALLBACKS[seg.slug];

              return (
                <motion.div
                  key={seg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -6, boxShadow: '0 0 40px rgba(34,197,94,0.18)' }}
                  className="glass-card segment-card"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'default' }}
                >
                  {/* Image Banner — full visible photo */}
                  <div style={{
                    height: 190,
                    background: `linear-gradient(135deg, ${bgColor} 0%, rgba(5,15,8,0.95) 100%)`,
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border-color)',
                  }}>
                    {seg.image_path ? (
                      <img src={`/uploads/segments/${seg.image_path}`} alt={seg.name}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${bgColor} 0%, rgba(5,15,8,0.95) 100%)` }} />
                    )}
                    {/* Gradient overlay at bottom for readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(5,15,8,0.7) 100%)' }} />
                    <div style={{
                      position: 'absolute', top: 10, right: 10, zIndex: 1,
                      background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)',
                      borderRadius: 6, padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700,
                      color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                      backdropFilter: 'blur(6px)',
                    }}>
                      Open
                    </div>
                    {/* Segment name overlay at bottom of image */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
                      padding: '8px 14px',
                    }}>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                        {seg.name}
                      </h2>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Description */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem', flex: 1 }}>
                      {seg.short_description}
                    </p>

                    {/* Specs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
                      <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 9, border: '1px solid rgba(34,197,94,0.12)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Team Size</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {seg.min_team_size === seg.max_team_size ? `${seg.min_team_size}` : `${seg.min_team_size}–${seg.max_team_size}`} members
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 9, border: '1px solid rgba(34,197,94,0.12)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Entry Fee</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          ৳{Math.round(seg.registration_fee).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'rgba(234,179,8,0.06)', borderRadius: 9, border: '1px solid rgba(234,179,8,0.12)', gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Prize Pool</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: isTBA ? '#eab308' : 'var(--text-primary)' }}>
                          {isTBA ? <span className="badge-tba"><AlertCircle size={10} /> To Be Announced</span> : seg.prize_pool}
                        </div>
                      </div>
                    </div>

                    {seg.fee_note && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem', padding: '6px 10px', background: 'rgba(34,197,94,0.04)', borderRadius: 7, border: '1px solid rgba(34,197,94,0.1)' }}>
                        ℹ {seg.fee_note}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to="/rulebook" state={{ segmentId: seg.id }} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
                        <BookOpen size={14} /> Details
                      </Link>
                      <a
                        href={formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        <ExternalLink size={14} /> Register
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View Rulebook CTA */}
        {!loading && segments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '3rem' }}
          >
            <div className="glass-card" style={{ display: 'inline-block', padding: '1.5rem 3rem', borderColor: 'rgba(34,197,94,0.2)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                Want the full technical rules for each competition?
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/rulebook" className="btn btn-primary">
                  <BookOpen size={16} /> Official Rulebook
                </Link>
                <Link to="/register" className="btn btn-outline">
                  View All Form Links <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
