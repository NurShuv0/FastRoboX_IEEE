import React from 'react';
import { Loader2 } from 'lucide-react';

// ── BUTTON ──────────────────────────────────────────────────────
export function Button({
  children, variant = 'primary', size = '', className = '',
  loading = false, disabled = false, ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : size === 'xl' ? 'btn-xl' : '';
  return (
    <button
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

// ── CARD ────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div className={`glass-card ${hover ? 'hover-lift' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

// ── BADGE ───────────────────────────────────────────────────────
export function Badge({ children, color = 'green', className = '' }) {
  return (
    <span className={`tag tag-${color} ${className}`}>{children}</span>
  );
}

// ── STATUS BADGE ────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', cls: 'status-pending' },
    approved: { label: 'Approved', cls: 'status-approved' },
    rejected: { label: 'Rejected', cls: 'status-rejected' },
    active: { label: 'Active', cls: 'status-active' },
    upcoming: { label: 'Upcoming', cls: 'status-upcoming' },
    completed: { label: 'Completed', cls: 'status-completed' },
  };
  const s = map[status] || { label: status, cls: 'status-upcoming' };
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
}

// ── LOADER ──────────────────────────────────────────────────────
export function Loader({ text = 'Loading...', fullPage = false }) {
  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'rotate-slow 0.8s linear infinite',
      }} />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-primary)',
      }}>
        {inner}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      {inner}
    </div>
  );
}

// ── SKELETON ────────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = '1rem', borderRadius = '6px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius, display: 'inline-block' }}
    />
  );
}

// ── MODAL ───────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = '600px' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth }}>
        {title && (
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: 4, borderRadius: 6,
              }}
            >✕</button>
          </div>
        )}
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── CONFIRM DIALOG ───────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Delete', danger = true }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="420px">
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

// ── SECTION HEADER ───────────────────────────────────────────────
export function SectionHeader({ tag, title, subtitle, centered = true }) {
  return (
    <div style={{
      textAlign: centered ? 'center' : 'left',
      marginBottom: '3rem',
    }}>
      {tag && (
        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: centered ? 'center' : 'flex-start' }}>
          <Badge color="green">{tag}</Badge>
        </div>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className="section-subtitle" style={{ margin: centered ? '0 auto' : '0' }}>{subtitle}</p>
      )}
    </div>
  );
}

// ── INPUT ────────────────────────────────────────────────────────
export function Input({ label, error, required, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
      )}
      <input className={`form-input ${className}`} {...props} />
      {error && <div className="form-error">⚠ {error}</div>}
    </div>
  );
}

export function Select({ label, error, required, children, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
      )}
      <select className={`form-input ${className}`} {...props}>
        {children}
      </select>
      {error && <div className="form-error">⚠ {error}</div>}
    </div>
  );
}

export function Textarea({ label, error, required, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
      )}
      <textarea className={`form-input ${className}`} {...props} />
      {error && <div className="form-error">⚠ {error}</div>}
    </div>
  );
}

// ── EMPTY STATE ─────────────────────────────────────────────────
export function EmptyState({ icon, title, message, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', gap: '1rem',
    }}>
      {icon && (
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: '1.8rem',
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{title}</h3>
      {message && <p style={{ color: 'var(--text-muted)', maxWidth: 340, fontSize: '0.9rem' }}>{message}</p>}
      {action}
    </div>
  );
}

// ── PAGINATION ───────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '2rem' }}>
      <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</Button>
      {pages.map(p => (
        <Button
          key={p} size="sm"
          variant={p === page ? 'primary' : 'ghost'}
          onClick={() => onChange(p)}
        >{p}</Button>
      ))}
      <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next →</Button>
    </div>
  );
}
