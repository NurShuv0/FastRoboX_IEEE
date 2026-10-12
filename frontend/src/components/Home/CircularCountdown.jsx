import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Clock } from 'lucide-react';

/**
 * CircularCountdown Component
 * 
 * Target: November 13, 2026 at 12:00 AM Bangladesh Standard Time (UTC+06:00)
 * ISO 8601: 2026-11-13T00:00:00+06:00
 */
export default function CircularCountdown({
  targetTimestamp = '2026-11-13T00:00:00+06:00',
  title = 'Competition Starts In',
}) {
  const { isDark } = useTheme();

  const calculateTimeRemaining = useCallback(() => {
    try {
      const targetMs = new Date(targetTimestamp).getTime();
      const now = Date.now();
      const diff = targetMs - now;

      if (diff <= 0) {
        return { isComplete: true, d: 0, h: 0, m: 0, s: 0 };
      }

      return {
        isComplete: false,
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      };
    } catch {
      return { isComplete: true, d: 0, h: 0, m: 0, s: 0 };
    }
  }, [targetTimestamp]);

  const [time, setTime] = useState(calculateTimeRemaining);

  useEffect(() => {
    const updated = calculateTimeRemaining();
    if (updated.isComplete) {
      return;
    }

    const intervalId = setInterval(() => {
      const current = calculateTimeRemaining();
      setTime(current);
      if (current.isComplete) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTimeRemaining]);

  // Zero-state view when countdown reaches zero
  if (time.isComplete) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: 540,
          margin: '0 auto 2.25rem',
          padding: '20px 24px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, #ffffff 100%)',
          border: '1.5px solid rgba(220, 38, 38, 0.4)',
          borderRadius: 24,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="animate-blink" style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 900,
            color: isDark ? '#ffffff' : '#b91c1c',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            🚩 The Competition Has Started!
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          FastRoboX 1.0 is officially underway at Bangladesh University of Business and Technology (BUBT).
        </p>
      </div>
    );
  }

  // Circular progress calculations
  // Radius: 42 -> Circumference = 2 * PI * 42 = ~263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Progress ratios for animated stroke rings
  // Days: ratio of 365 days max or smooth relative arc
  const daysProgress = Math.min(1, Math.max(0, time.d / 365));
  const hoursProgress = time.h / 24;
  const minutesProgress = time.m / 60;
  const secondsProgress = time.s / 60;

  const circles = [
    {
      id: 'days',
      value: time.d,
      label: 'Days',
      progress: daysProgress,
      color: '#dc2626',
      accentColor: '#f87171',
    },
    {
      id: 'hours',
      value: time.h,
      label: 'Hours',
      progress: hoursProgress,
      color: '#e11d48',
      accentColor: '#fb7185',
    },
    {
      id: 'minutes',
      value: time.m,
      label: 'Minutes',
      progress: minutesProgress,
      color: '#ea580c',
      accentColor: '#fdba74',
    },
    {
      id: 'seconds',
      value: time.s,
      label: 'Seconds',
      progress: secondsProgress,
      color: '#dc2626',
      accentColor: '#fca5a5',
      isPulse: true,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 580,
        margin: '0 auto 2.5rem',
        padding: '24px 20px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.78) 0%, rgba(9, 13, 22, 0.88) 100%)'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '1px solid rgba(220, 38, 38, 0.22)',
        borderRadius: 24,
        boxShadow: isDark
          ? '0 14px 35px -8px rgba(0, 0, 0, 0.5), 0 0 24px rgba(220, 38, 38, 0.08)'
          : '0 8px 30px rgba(0, 0, 0, 0.06), 0 0 20px rgba(220, 38, 38, 0.06)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
      }}
    >
      {/* Title Header with Pulse Indicator */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: '1.25rem',
        padding: '5px 14px',
        borderRadius: 100,
        background: isDark ? 'rgba(220, 38, 38, 0.12)' : 'rgba(254, 226, 226, 0.8)',
        border: '1px solid rgba(220, 38, 38, 0.25)',
      }}>
        <span
          className="animate-blink"
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#dc2626',
            boxShadow: '0 0 8px #dc2626',
          }}
        />
        <Clock size={13} style={{ color: isDark ? '#f87171' : '#dc2626' }} />
        <span style={{
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: isDark ? '#fca5a5' : '#991b1b',
          fontWeight: 800,
        }}>
          {title}
        </span>
      </div>

      {/* Four Circular Countdown Rings */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(10px, 2.5vw, 20px)',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {circles.map((item) => {
          const clamped = Math.min(1, Math.max(0, item.progress));
          const strokeOffset = circumference * (1 - clamped);

          return (
            <div
              key={item.id}
              style={{
                width: 'clamp(74px, 19vw, 98px)',
                height: 'clamp(74px, 19vw, 98px)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: '50%',
                background: isDark
                  ? 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'radial-gradient(circle, rgba(254, 242, 242, 0.85) 0%, #ffffff 100%)',
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35), inset 0 0 10px rgba(220, 38, 38, 0.08)'
                  : '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 0 8px rgba(220, 38, 38, 0.04)',
                border: '1px solid rgba(220, 38, 38, 0.18)',
              }}
            >
              {/* SVG Circular Ring */}
              <svg
                viewBox="0 0 100 100"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-90deg)',
                  overflow: 'visible',
                }}
              >
                <defs>
                  <linearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={item.color} />
                    <stop offset="100%" stopColor={item.accentColor} />
                  </linearGradient>
                </defs>

                {/* Track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(220, 38, 38, 0.12)'}
                  strokeWidth="5.5"
                  fill="transparent"
                />

                {/* Animated progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={`url(#grad-${item.id})`}
                  strokeWidth="5.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    transition: 'stroke-dashoffset 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: `drop-shadow(0 0 5px ${item.color}66)`,
                  }}
                />
              </svg>

              {/* Centered Countdown Value & Label */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 4,
                  userSelect: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 3.2vw, 1.65rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(0.58rem, 1.4vw, 0.68rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: item.accentColor,
                    marginTop: 3,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
