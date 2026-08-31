import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Globe, Share2, MessageCircle, Video } from 'lucide-react';

const quickLinks = [
  { label: 'Notice', to: '/notice' },
  { label: 'Segments', to: '/#segments' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Sponsors', to: '/#sponsors' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Register', to: '/register' },
];

const socials = [
  { icon: <Globe size={18} />, href: '#', label: 'Website' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'Community' },
  { icon: <Share2 size={18} />, href: '#', label: 'Social' },
  { icon: <Video size={18} />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '3rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute',
        top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
        filter: 'blur(1px)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          paddingBottom: '2.5rem',
        }}>

          {/* Brand Column */}
          <div>
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
                  fontSize: '1.1rem', color: 'var(--color-primary)',
                }}>FastRobox 1.0</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  NATIONAL ROBOTICS COMPETITION
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Bangladesh's premier national robotics and technology competition. Bringing together the brightest minds to innovate, compete, and inspire.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
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
          </div>

          {/* Hosted By */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>Hosted By</h4>
            <div style={{
              padding: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              borderLeft: '3px solid var(--color-primary)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>BUBT</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginBottom: 8 }}>
                Bangladesh University of<br />Business and Technology
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Rupnagar R/A, Mirpur-2<br />Dhaka-1216, Bangladesh
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <span style={{ color: 'var(--color-primary-dark)', fontSize: '0.7rem' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <Mail size={15} />, text: 'info@fastrobox.bubt.edu.bd' },
                { icon: <Phone size={15} />, text: '+880 1700 000000' },
                { icon: <MapPin size={15} />, text: 'BUBT Campus, Mirpur, Dhaka' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
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
            © 2026 FastRobox 1.0. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy Policy', 'Terms of Use'].map(label => (
              <a key={label} href="#" style={{
                fontSize: '0.8rem', color: 'var(--text-muted)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
