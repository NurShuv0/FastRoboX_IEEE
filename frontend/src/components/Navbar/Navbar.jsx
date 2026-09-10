import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import RobotIcon from '../Common/RobotIcon';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Notice', to: '/notice' },
  { label: 'Segments', to: '/segments' },
  { label: 'Rulebook', to: '/rulebook' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on outside click
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
          background: scrolled ? 'var(--bg-glass)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-glow)' : 'none',
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

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40,
              background: 'var(--gradient-primary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(34,197,94,0.35)',
            }}>
              <RobotIcon size={22} color="#052e16" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.05rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>FASTROBOX</div>
              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1 }}>1.0 &bull; IEEE BUBT</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}
               className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                style={({ isActive: navIsActive }) => ({
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: navIsActive ? 600 : 500,
                  textDecoration: 'none',
                  color: navIsActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  background: navIsActive ? 'rgba(34,197,94,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.01em',
                  border: navIsActive ? '1px solid rgba(34,197,94,0.15)' : '1px solid transparent',
                })}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.background = 'rgba(34,197,94,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              style={{
                width: 36, height: 36,
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)',
                transition: 'all 0.2s ease',
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(34,197,94,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Register Button */}
            <Link
              to="/register"
              id="nav-register-btn"
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '7px 18px' }}
            >
              Register
            </Link>

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
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)',
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
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid var(--border-color)',
              maxHeight: 'calc(100vh - 68px)',
              overflowY: 'auto',
              padding: '12px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
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
                  fontSize: '0.975rem',
                  fontWeight: navIsActive ? 600 : 500,
                  textDecoration: 'none',
                  color: navIsActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  background: navIsActive ? 'rgba(34,197,94,0.08)' : 'transparent',
                  border: navIsActive ? '1px solid rgba(34,197,94,0.15)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ marginTop: 10, justifyContent: 'center' }}
              onClick={() => setMenuOpen(false)}
            >
              Register Now
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
