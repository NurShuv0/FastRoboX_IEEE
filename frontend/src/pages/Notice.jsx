import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Calendar, ChevronRight, X } from 'lucide-react';
import { getNotices, getNoticeCategories } from '../services/api';
import { SectionHeader, Loader, EmptyState, Badge } from '../components/UI/index.jsx';

const categoryColors = {
  general: 'blue',
  registration: 'green',
  competition: 'yellow',
  announcement: 'red',
  schedule: 'purple',
  result: 'orange',
};

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  useEffect(() => {
    Promise.all([
      getNotices(),
      getNoticeCategories(),
    ]).then(([nRes, cRes]) => {
      const data = nRes.data.data;
      setNotices(Array.isArray(data) ? data : data?.items || []);
      setCategories(cRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const list = Array.isArray(notices) ? notices : [];
  const filtered = list.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || n.category_slug === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <SectionHeader
          tag="Official Notices"
          title="Notice Board"
          subtitle="Stay updated with the latest announcements, updates, and important information about FastRobox 1.0."
          centered={false}
        />

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <input
              className="form-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search notices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <select
              className="form-input"
              style={{ paddingLeft: 40, minWidth: 180 }}
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          {(search || selectedCat) && (
            <button
              onClick={() => { setSearch(''); setSelectedCat(''); }}
              className="btn btn-ghost btn-sm"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Showing {filtered.length} notice{filtered.length !== 1 ? 's' : ''}
            {(search || selectedCat) ? ' (filtered)' : ''}
          </div>
        )}

        {/* Notices List */}
        {loading ? (
          <Loader text="Loading notices..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="No notices found"
            message={search || selectedCat ? 'Try adjusting your search or filter.' : 'No notices have been published yet.'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/notice/${notice.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="notice-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                          <Badge color={categoryColors[notice.category_slug] || 'green'}>
                            {notice.category_name || 'General'}
                          </Badge>
                          {notice.pdf_path && (
                            <span className="tag tag-blue">
                              <Download size={10} /> PDF
                            </span>
                          )}
                        </div>
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1rem', color: 'var(--text-primary)',
                          marginBottom: 6,
                        }}>{notice.title}</h3>
                        <p style={{
                          color: 'var(--text-muted)', fontSize: '0.875rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>{notice.description}</p>
                      </div>
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'flex-end', gap: 8, flexShrink: 0,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          <Calendar size={12} />
                          {new Date(notice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--color-primary)' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
