import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Globe, AlertCircle, Share2, MessageCircle, Play, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Notice', to: '/notice' },
  { label: 'Segments', to: '/segments' },
  { label: 'Rulebook', to: '/rulebook' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
  { label: 'Register', to: '/register' },
];

const competitions = [
  { label: 'Project Showcasing', to: '/segments' },
  { label: 'Line Following Robot', to: '/segments' },
  { label: 'Robo Soccer', to: '/segments' },
  { label: 'Techathon', to: '/segments' },
  { label: 'Poster Presentation', to: '/segments' },
];

export default function Footer() {
  const { getSetting, hasSetting } = useSettings();

  const email = getSetting('contact_email');
  const phone = getSetting('contact_phone');
  const address = getSetting('contact_address');
  const facebook = getSetting('social_facebook');
  const instagram = getSetting('social_instagram');
  const linkedin = getSetting('social_linkedin');
  const youtube = getSetting('social_youtube');
  const website = getSetting('social_website');
  const organizer = getSetting('organizer_name', 'IEEE Students\' Branch');
  const host = getSetting('host_university', 'Bangladesh University of Business and Technology (BUBT)');

  const hasSocials = facebook || instagram || linkedin || youtube || website;
  const hasContact = email || phone || address;

  const socials = [
    { icon: <ExternalLink size={16} />, href: facebook, label: 'Facebook' },
    { icon: <MessageCircle size={16} />, href: instagram, label: 'Instagram' },
    { icon: <Share2 size={16} />, href: linkedin, label: 'LinkedIn' },
    { icon: <Play size={16} />, href: youtube, label: 'YouTube' },
    { icon: <Globe size={16} />, href: website, label: 'Website' },
  ].filter(s => s.href);

  const FooterHeading = ({ children }) => (
    <h4 style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '0.78rem',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--color-primary)',
      marginBottom: '1rem',
      fontWeight: 700,
    }}>{children}</h4>
  );

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '3.5rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: '5%', right: '5%', height: 1,
        background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
        filter: 'blur(1px)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
        }}>

          {/* Brand Column */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{
                width: 38, height: 38,
                background: 'var(--gradient-primary)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={20} color="#052e16" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800,
                  fontSize: '1rem', color: 'var(--color-primary)',
                  letterSpacing: '-0.02em',
                }}>FASTROBOX 1.0</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  National Robotics & Tech Carnival
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Organized by <strong style={{ color: 'var(--text-secondary)' }}>{organizer}</strong> at{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>{host}</strong>.
              Bangladesh's national robotics and technology carnival.
            </p>

            {/* Social Icons — only render if links are configured */}
            {hasSocials && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    aria-label={s.label}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(34,197,94,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.6rem' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitions */}
          <div>
            <FooterHeading>Competitions</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {competitions.map(c => (
                <li key={c.label}>
                  <Link
                    to={c.to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.6rem' }}>▶</span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Organizer */}
          <div>
            <FooterHeading>Organizer</FooterHeading>
            <div style={{
              padding: '14px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              borderLeft: '3px solid var(--color-primary)',
              marginBottom: '1.25rem',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: 3 }}>
                {organizer}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {host}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 5 }}>
                BUBT Campus, Mirpur, Dhaka
              </div>
            </div>

            <FooterHeading>Contact</FooterHeading>
            {hasContact ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {email && (
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <Mail size={14} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                    <a href={`mailto:${email}`} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{email}</a>
                  </div>
                )}
                {phone && (
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <Phone size={14} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{phone}</span>
                  </div>
                )}
                {address && (
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <MapPin size={14} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{address}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                <AlertCircle size={13} style={{ color: '#eab308', flexShrink: 0 }} />
                Contact information will be announced soon.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1.25rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 FASTROBOX 1.0. All Rights Reserved. — Organized by {organizer}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/notice" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              Notices
            </Link>
            <Link to="/status" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              Check Registration Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
