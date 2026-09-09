import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Cpu } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', maxWidth: 520 }}
      >
        {/* Robot SVG */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Antenna */}
            <line x1="80" y1="20" x2="80" y2="40" stroke="rgba(34,197,94,0.5)" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="80" cy="16" r="5" fill="rgba(34,197,94,0.7)" />
            {/* Head */}
            <rect x="44" y="40" width="72" height="52" rx="12" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5"/>
            {/* Eyes */}
            <rect x="56" y="54" width="18" height="14" rx="5" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1"/>
            <rect x="86" y="54" width="18" height="14" rx="5" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1"/>
            {/* Pupils — droopy for 404 */}
            <circle cx="65" cy="63" r="4" fill="rgba(34,197,94,0.7)" />
            <circle cx="95" cy="63" r="4" fill="rgba(34,197,94,0.7)" />
            {/* Sad mouth */}
            <path d="M64 82 Q80 75 96 82" stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Body */}
            <rect x="36" y="96" width="88" height="44" rx="10" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
            {/* Chest panel */}
            <rect x="52" y="108" width="56" height="20" rx="6" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1"/>
            {/* Status lights */}
            <circle cx="64" cy="118" r="3.5" fill="rgba(239,68,68,0.8)" />
            <circle cx="76" cy="118" r="3.5" fill="rgba(234,179,8,0.5)" />
            <circle cx="88" cy="118" r="3.5" fill="rgba(34,197,94,0.3)" />
            {/* Arms */}
            <rect x="16" y="98" width="18" height="36" rx="8" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
            <rect x="126" y="98" width="18" height="36" rx="8" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
            {/* Legs */}
            <rect x="48" y="142" width="22" height="16" rx="6" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
            <rect x="90" y="142" width="22" height="16" rx="6" fill="rgba(16,28,16,0.9)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* 404 text */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(5rem, 15vw, 8rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.08) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: '0.5rem',
          letterSpacing: '-0.06em',
        }}>404</div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 12,
        }}>
          Page Not Found
        </h1>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
          The page you're looking for doesn't exist or may have been moved.
          Head back to the homepage or explore the competition segments.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/segments" className="btn btn-outline">
            <Cpu size={16} /> View Competitions
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
