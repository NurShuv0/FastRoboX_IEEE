import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, DollarSign, Trophy, FileText,
  Download, Mail, Phone, CheckCircle, BookOpen,
  Calendar, Shield, Zap
} from 'lucide-react';
import { getSegment } from '../services/api';
import { Loader, Badge } from '../components/UI/index.jsx';

export default function SegmentDetails() {
  const { id } = useParams();
  const [seg, setSeg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getSegment(id)
      .then(r => setSeg(r.data.data))
      .catch(() => setError('Competition not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 88 }}><Loader text="Loading competition..." fullPage /></div>;
  if (error) return (
    <div style={{ paddingTop: 88, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
        <h2 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>{error}</h2>
        <Link to="/#segments" className="btn btn-outline" style={{ marginTop: 16 }}>← Back to Segments</Link>
      </div>
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'rules', label: 'Rules' },
    { key: 'eligibility', label: 'Eligibility' },
  ];

  const icons = { 'robo-soccer': '⚽', 'line-follower': '🚗', 'project-showcase': '💡' };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      {/* Banner */}
      <div style={{
        height: 260,
        background: `linear-gradient(135deg, rgba(10,15,10,0.95) 0%, rgba(22,163,74,0.08) 100%)`,
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {seg.image_path && (
          <img
            src={`/uploads/segments/${seg.image_path}`}
            alt={seg.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.12,
            }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)' }} />

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', position: 'relative' }}>
          <Link to="/#segments" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none',
            marginBottom: '1.25rem', transition: 'color 0.2s',
          }}>
            <ArrowLeft size={15} /> All Competitions
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.6))' }}>
              {icons[seg.slug] || '🤖'}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                Competition Segment
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                color: 'var(--text-primary)', marginBottom: 8,
              }}>{seg.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 600 }}>
                {seg.short_description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: '1.5rem',
            background: 'var(--bg-card)', borderRadius: 12, padding: 4,
            border: '1px solid var(--border-color)', width: 'fit-content',
          }}>
            {tabs.map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                  background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.key ? '#052e16' : 'var(--text-muted)',
                }}
              >{tab.label}</button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card"
            style={{ padding: '1.75rem' }}
          >
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  About This Competition
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.925rem', whiteSpace: 'pre-line' }}>
                  {seg.full_description || seg.short_description}
                </p>
              </div>
            )}
            {activeTab === 'rules' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Competition Rules
                </h3>
                {seg.rules ? (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {seg.rules.split('\n').filter(Boolean).map((rule, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <CheckCircle size={15} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
                        {rule.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Rules will be published in the rulebook.</p>
                )}
              </div>
            )}
            {activeTab === 'eligibility' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Eligibility Requirements
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.925rem' }}>
                  {seg.eligibility || 'Open to all university and college students.'}
                </p>
              </div>
            )}
          </motion.div>

          {/* Rulebook */}
          {seg.rulebook_path && (
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Official Rulebook</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Download to read all competition rules</div>
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

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Register CTA */}
          <div className="glass-card" style={{
            padding: '1.5rem', background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(163,230,53,0.04))',
            borderColor: 'rgba(34,197,94,0.3)',
          }}>
            <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.75rem' }}>{icons[seg.slug] || '🤖'}</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ready to Compete?
            </h3>
            <Link
              to={`/register?segment=${seg.id}`}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
            >
              <Zap size={16} /> Register Now
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Registration Fee: <strong style={{ color: 'var(--color-primary)' }}>৳{seg.registration_fee}</strong>
            </p>
          </div>

          {/* Info Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Competition Info
            </h4>
            {[
              { icon: <Users size={15} />, label: 'Team Size', value: `${seg.min_team_size}–${seg.max_team_size} members` },
              { icon: <DollarSign size={15} />, label: 'Reg. Fee', value: `৳${seg.registration_fee}` },
              { icon: <Trophy size={15} />, label: 'Prize Pool', value: seg.prize_pool || 'TBA' },
              { icon: <Calendar size={15} />, label: 'Event Date', value: 'Oct 18–19, 2026' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 0', borderBottom: '1px solid var(--border-color)',
              }}>
                <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Card */}
          {(seg.contact_email || seg.contact_phone) && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Contact
              </h4>
              {seg.contact_email && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                  <a href={`mailto:${seg.contact_email}`} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    {seg.contact_email}
                  </a>
                </div>
              )}
              {seg.contact_phone && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{seg.contact_phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .seg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
