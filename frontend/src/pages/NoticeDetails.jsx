import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, FileText, Tag } from 'lucide-react';
import { getNotice } from '../services/api';
import { Loader, Badge } from '../components/UI/index.jsx';

const categoryColors = {
  general: 'blue', registration: 'green', competition: 'yellow',
  announcement: 'red', schedule: 'purple', result: 'orange',
};

export default function NoticeDetails() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotice(id)
      .then(r => setNotice(r.data.data))
      .catch(() => setError('Notice not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 88 }}><Loader text="Loading notice..." fullPage /></div>;
  if (error) return (
    <div style={{ paddingTop: 88, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
        <h2 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>{error}</h2>
        <Link to="/notice" className="btn btn-outline" style={{ marginTop: 16 }}>← Back to Notices</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <Link to="/notice" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none',
          marginBottom: '1.5rem', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Notice Board
        </Link>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {/* Category + Date */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Badge color={categoryColors[notice.category_slug] || 'green'}>
              <Tag size={10} /> {notice.category_name || 'General'}
            </Badge>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Calendar size={12} />
              {new Date(notice.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            lineHeight: 1.3,
          }}>{notice.title}</h1>

          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.9,
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap',
          }}>
            {notice.description}
          </div>

          {/* PDF Download */}
          {notice.pdf_path && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem 1.25rem',
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Attachment</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PDF Document</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={`/uploads/notices/${notice.pdf_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  View PDF
                </a>
                <a
                  href={`/uploads/notices/${notice.pdf_path}`}
                  download
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
