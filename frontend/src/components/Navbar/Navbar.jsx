import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import RobotIcon from '../Common/RobotIcon';

const navLinks = [
  { label: 'Notice', to: '/notice' },
  { label: 'Segments', to: '/segments' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Sponsors', to: '/sponsors' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('nav') && !e.target.closest('#mobile-menu')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(9, 13, 22, 0.95)' : 'rgba(9, 13, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>

          {/* Left to Right Logos: BUBT -> IEEE -> Fastrobox */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* 1. BUBT Logo */}
            <img
              src="/images/bubt.png"
              alt="BUBT Logo"
              style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />

            <div style={{ width: 1, height: 22, background: 'rgba(255, 255, 255, 0.2)' }} />

            {/* 2. IEEE BUBT SB Logo */}
            <img
              src="/images/IEEE.png"
              alt="IEEE BUBT Student Branch Logo"
              style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />

            <div style={{ width: 1, height: 22, background: 'rgba(255, 255, 255, 0.2)' }} />

            {/* 3. FastRoboX 1.0 Logo (Always White Logo) */}
            <img
              src="/images/Fastrobox_white.png"
              alt="FastRoboX 1.0"
              style={{ height: 28, width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
               className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                style={({ isActive: navIsActive }) => ({
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: navIsActive ? '#dc2626' : '#cbd5e1',
                  background: navIsActive ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: navIsActive ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Register CTA Button */}
            <Link
              to="/register"
              id="nav-register-btn"
              className="btn btn-primary btn-pill"
              style={{ fontSize: '0.8rem', padding: '8px 22px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}
            >
              REGISTER
            </Link>

            {/* Audio Toggle */}
            <button
              onClick={() => setAudioOn(v => !v)}
              title={audioOn ? "Mute audio" : "Turn on audio!"}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: audioOn ? 'rgba(220, 38, 38, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: audioOn ? '#dc2626' : '#94a3b8',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff',
                transition: 'all 0.2s ease',
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#ffffff" />}
            </button>

            {/* Hamburger */}
            <button
              id="hamburger-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                display: 'none',
                width: 36, height: 36,
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 68,
              left: 0,
              right: 0,
              zIndex: 999,
              background: 'rgba(9, 13, 22, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              maxHeight: 'calc(100vh - 68px)',
              overflowY: 'auto',
              padding: '16px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={({ isActive: navIsActive }) => ({
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  color: navIsActive ? '#dc2626' : '#cbd5e1',
                  background: navIsActive ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                  border: navIsActive ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/register"
              className="btn btn-primary btn-pill"
              style={{ marginTop: 12, justifyContent: 'center', textTransform: 'uppercase', fontWeight: 800 }}
              onClick={() => setMenuOpen(false)}
            >
              REGISTER NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          #hamburger-btn { display: flex !important; }
          #nav-register-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
