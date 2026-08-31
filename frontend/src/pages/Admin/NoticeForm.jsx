import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { adminGetNotice, adminCreateNotice, adminUpdateNotice, getNoticeCategories } from '../../services/api';
import { Input, Select, Textarea, Button, Loader } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function NoticeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    is_published: 1,
    remove_pdf: 0,
  });

  useEffect(() => {
    getNoticeCategories().then(r => setCategories(r.data.data || [])).catch(() => {});
    if (isEdit) {
      adminGetNotice(id)
        .then(r => {
          const n = r.data.data;
          setForm({
            title: n.title,
            description: n.description,
            category_id: n.category_id || '',
            is_published: n.is_published,
            remove_pdf: 0,
          });
          setExistingPdf(n.pdf_path);
        })
        .catch(() => toast.error('Failed to load notice.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (pdfFile) fd.append('pdf', pdfFile);
      if (isEdit) {
        fd.append('_method', 'PUT');
        await adminUpdateNotice(id, fd);
        toast.success('Notice updated successfully!');
      } else {
        await adminCreateNotice(fd);
        toast.success('Notice created successfully!');
      }
      navigate('/admin/notices');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save notice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading notice..." />;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <Link to="/admin/notices" style={{
          display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)',
          textDecoration: 'none', fontSize: '0.875rem',
        }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Notice' : 'Add New Notice'}
        </h1>
      </div>

      <form onSubmit={submit} className="glass-card" style={{ padding: '1.75rem' }}>
        <Input
          label="Notice Title" required
          value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="Enter notice title..." error={errors.title}
        />

        <Textarea
          label="Description" required
          value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Enter full notice content..." error={errors.description}
          style={{ minHeight: 160 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select label="Category" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
            <option value="">— Select Category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>

          <Select label="Publish Status" value={form.is_published} onChange={e => set('is_published', Number(e.target.value))}>
            <option value={1}>Published</option>
            <option value={0}>Draft</option>
          </Select>
        </div>

        {/* PDF Upload */}
        <div className="form-group">
          <label className="form-label">PDF Attachment (Optional)</label>
          {existingPdf && !form.remove_pdf ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 10, marginBottom: 8,
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', flex: 1 }}>
                📎 {existingPdf}
              </span>
              <a href={`/uploads/notices/${existingPdf}`} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none' }}>View</a>
              <button type="button" onClick={() => set('remove_pdf', 1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                <X size={15} />
              </button>
            </div>
          ) : null}
          <div
            style={{
              border: `2px dashed ${pdfFile ? 'var(--color-primary)' : 'var(--border-color)'}`,
              borderRadius: 10, padding: '1.25rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              background: pdfFile ? 'rgba(34,197,94,0.04)' : 'transparent',
            }}
            onClick={() => document.getElementById('pdf-upload').click()}
          >
            {pdfFile ? (
              <div style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>
                📄 {pdfFile.name}
                <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '0.78rem' }}>(click to replace)</span>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Upload size={20} style={{ marginBottom: 6 }} />
                <div>Click to upload PDF (Max 10MB)</div>
              </div>
            )}
          </div>
          <input id="pdf-upload" type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => setPdfFile(e.target.files[0])} />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/admin/notices" className="btn btn-ghost">Cancel</Link>
          <Button type="submit" variant="primary" loading={saving}>
            <Save size={16} /> {isEdit ? 'Update Notice' : 'Publish Notice'}
          </Button>
        </div>
      </form>
    </div>
  );
}
