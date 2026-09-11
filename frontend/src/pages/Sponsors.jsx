import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Handshake, ExternalLink, Mail } from 'lucide-react';
import { getSponsors } from '../services/api';
import { SectionHeader, Loader, EmptyState } from '../components/UI/index.jsx';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    getSponsors()
      .then(r => setSponsors(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sponsorsByCategory = sponsors.reduce((acc, s) => {
    const cat = s.category_name || 'Official Sponsors';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ padding: '100px 24px 80px', maxWidth: 1280, margin: '0 auto', minHeight: '80vh' }}>
      <SectionHeader
        tag="OUR PARTNERS"
        title="OFFICIAL SPONSORS &amp; PARTNERS"
        subtitle="We gratefully acknowledge our sponsors and partners for empowering innovation and robotics excellence at FastRoboX 1.0."
      />

      {loading ? (
        <Loader text="Loading sponsors & partners..." fullPage={false} />
      ) : Object.keys(sponsorsByCategory).length === 0 ? (
        <EmptyState
          icon={<Trophy size={48} />}
          title="Sponsors Coming Soon"
          message="Official partnership announcements for FastRoboX 1.0 will be published shortly."
          action={
            <Link to="/contact" className="btn btn-primary btn-pill" style={{ marginTop: 16 }}>
              <Handshake size={16} /> BECOME A SPONSOR
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {Object.entries(sponsorsByCategory).map(([category, items]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}>
                <span style={{ height: 1, width: 40, background: 'rgba(220,38,38,0.3)' }} />
                <span>{category}</span>
                <span style={{ height: 1, width: 40, background: 'rgba(220,38,38,0.3)' }} />
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                justifyContent: 'center',
              }}>
                {items.map(sp => (
                  <motion.a
                    key={sp.id}
                    href={sp.website_url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(220, 38, 38, 0.25)' }}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '18px 16px',
                      borderRadius: 20,
                      textDecoration: 'none',
                      borderColor: 'var(--border-color)',
                      width: 190,
                      height: 180,
                      flexShrink: 0,
                      cursor: sp.website_url ? 'pointer' : 'default',
                      background: 'var(--bg-card)',
                    }}
                  >
                    {sp.logo_path ? (
                      <img
                        src={`/uploads/sponsors/${sp.logo_path}`}
                        alt={sp.name}
                        style={{ maxHeight: 60, maxWidth: 140, objectFit: 'contain', marginBottom: sp.name ? 8 : 0 }}
                      />
                    ) : (
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'rgba(220, 38, 38, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#dc2626', marginBottom: 8,
                      }}>
                        <Trophy size={22} />
                      </div>
                    )}
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}>
                      {sp.name}
                    </div>
                    {sp.website_url && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#dc2626', marginTop: 4, fontWeight: 700 }}>
                        <span>Visit Website</span>
                        <ExternalLink size={10} />
                      </div>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Become a Sponsor Banner */}
          <div className="glass-card" style={{
            padding: '3rem 2rem',
            borderRadius: 24,
            textAlign: 'center',
            background: isDark
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
            borderColor: isDark ? 'rgba(220, 38, 38, 0.35)' : 'rgba(220, 38, 38, 0.25)',
            boxShadow: isDark
              ? '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.1)'
              : '0 10px 30px rgba(220, 38, 38, 0.08)',
            marginTop: '2rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
              Interested in Sponsoring FastRoboX 1.0?
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 500 }}>
              Partner with Bangladesh's premier robotics competition to showcase your brand to top university engineering talent.
            </p>
            <Link to="/contact" className="btn btn-primary btn-pill">
              <Mail size={16} /> CONTACT ORGANIZING TEAM
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
