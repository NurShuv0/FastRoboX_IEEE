import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Image, Video } from 'lucide-react';
import { adminGetGallery, adminCreateGallery, adminDeleteGallery } from '../../services/api';
import { Loader, EmptyState, Button, Input, Modal, ConfirmDialog } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('image');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const toast = useToast();

  const load = () => { setLoading(true); adminGetGallery().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const save = async () => {
    if (!file) { toast.warning('Please select a file.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('caption', caption); fd.append('type', type);
      await adminCreateGallery(fd);
      toast.success('Added to gallery!');
      setFormOpen(false); setFile(null); setCaption(''); setType('image');
      load();
    } catch { toast.error('Upload failed.'); }
    setSaving(false);
  };

  const del = async () => {
    try { await adminDeleteGallery(deleteTarget.id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 4 }}>Gallery</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage event images and videos shown in the gallery.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}><Plus size={16} /> Upload Media</Button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={<Image size={28} />} title="Gallery is empty"
          action={<Button variant="primary" size="sm" onClick={() => setFormOpen(true)}><Upload size={14} /> Upload Media</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} className="gallery-item glass-card" style={{ padding: 0, position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3' }}>
              {item.type === 'image'
                ? <img src={`/uploads/gallery/${item.file_path}`} alt={item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setLightbox(item)} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                    <Video size={32} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Video</span>
                  </div>
              }
              {/* Caption */}
              {item.caption && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px 10px 8px', fontSize: '0.75rem', color: '#fff' }}>
                  {item.caption}
                </div>
              )}
              {/* Delete button */}
              <button onClick={e => { e.stopPropagation(); setDeleteTarget(item); }}
                style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
          <img src={`/uploads/gallery/${lightbox.file_path}`} alt={lightbox.caption}
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 0 60px rgba(34,197,94,0.3)' }} />
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setFile(null); setCaption(''); }} title="Upload Media" maxWidth="440px">
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {[{ v: 'image', label: '🖼 Image', icon: <Image size={14} /> }, { v: 'video', label: '🎥 Video', icon: <Video size={14} /> }].map(opt => (
            <button key={opt.v} type="button" onClick={() => setType(opt.v)}
              className={`btn btn-sm ${type === opt.v ? 'btn-primary' : 'btn-ghost'}`}>{opt.label}</button>
          ))}
        </div>
        <div style={{ border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--border-color)'}`, borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}
          onClick={() => document.getElementById('gallery-file').click()}>
          {file ? <div style={{ color: 'var(--color-primary)' }}>📎 {file.name}</div>
            : <div style={{ color: 'var(--text-muted)' }}><Upload size={24} style={{ marginBottom: 8 }} /><br />Click to select {type}</div>}
        </div>
        <input id="gallery-file" type="file" accept={type === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
        <Input label="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this media..." />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          <Button variant="primary" loading={saving} onClick={save}><Upload size={14} /> Upload</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={del}
        title="Delete Media" message="Delete this media file? This cannot be undone." confirmText="Delete" danger />
    </div>
  );
}
