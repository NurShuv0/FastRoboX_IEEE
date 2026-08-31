import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { adminGetSegment, adminCreateSegment, adminUpdateSegment } from '../../services/api';
import { Input, Select, Textarea, Button, Loader } from '../../components/UI/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function SegmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [rulebookFile, setRulebookFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '', slug: '', short_description: '', full_description: '',
    rules: '', eligibility: '', min_team_size: 1, max_team_size: 5,
    registration_fee: 0, prize_pool: '', contact_email: '', contact_phone: '',
    is_active: 1, display_order: 0,
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const genSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  useEffect(() => {
    if (isEdit) {
      adminGetSegment(id)
        .then(r => { const d = r.data.data; setForm({ name: d.name, slug: d.slug, short_description: d.short_description, full_description: d.full_description || '', rules: d.rules || '', eligibility: d.eligibility || '', min_team_size: d.min_team_size, max_team_size: d.max_team_size, registration_fee: d.registration_fee, prize_pool: d.prize_pool || '', contact_email: d.contact_email || '', contact_phone: d.contact_phone || '', is_active: d.is_active, display_order: d.display_order }); })
        .catch(() => toast.error('Failed to load segment.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required.';
    if (!form.short_description.trim()) errs.short_description = 'Short description required.';
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
      if (imageFile) fd.append('image', imageFile);
      if (rulebookFile) fd.append('rulebook', rulebookFile);
      if (isEdit) { fd.append('_method', 'PUT'); await adminUpdateSegment(id, fd); toast.success('Segment updated!'); }
      else { await adminCreateSegment(fd); toast.success('Segment created!'); }
      navigate('/admin/segments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  const FileUpload = ({ label, file, setFile, accept, id: fid }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--border-color)'}`, borderRadius: 10, padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: file ? 'rgba(34,197,94,0.04)' : 'transparent' }}
        onClick={() => document.getElementById(fid).click()}>
        {file ? <div style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>📎 {file.name}</div>
          : <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}><Upload size={18} style={{ marginBottom: 4 }} /><br />Click to upload {label}</div>}
      </div>
      <input id={fid} type="file" accept={accept} style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
    </div>
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <Link to="/admin/segments" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}><ArrowLeft size={18} /></Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Segment' : 'Add New Segment'}
        </h1>
      </div>
      <form onSubmit={submit} className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Segment Name" required value={form.name} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', genSlug(e.target.value)); }} error={errors.name} />
          <Input label="Slug (URL)" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g., robo-soccer" />
        </div>
        <Textarea label="Short Description" required value={form.short_description} onChange={e => set('short_description', e.target.value)} style={{ minHeight: 80 }} error={errors.short_description} />
        <Textarea label="Full Description" value={form.full_description} onChange={e => set('full_description', e.target.value)} style={{ minHeight: 120 }} />
        <Textarea label="Rules (one per line)" value={form.rules} onChange={e => set('rules', e.target.value)} style={{ minHeight: 120 }} placeholder="1. Rule one&#10;2. Rule two..." />
        <Textarea label="Eligibility" value={form.eligibility} onChange={e => set('eligibility', e.target.value)} style={{ minHeight: 80 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          <Input label="Min Team Size" type="number" min={1} value={form.min_team_size} onChange={e => set('min_team_size', e.target.value)} />
          <Input label="Max Team Size" type="number" min={1} value={form.max_team_size} onChange={e => set('max_team_size', e.target.value)} />
          <Input label="Registration Fee (৳)" type="number" min={0} step="0.01" value={form.registration_fee} onChange={e => set('registration_fee', e.target.value)} />
          <Input label="Display Order" type="number" min={0} value={form.display_order} onChange={e => set('display_order', e.target.value)} />
        </div>
        <Input label="Prize Pool" value={form.prize_pool} onChange={e => set('prize_pool', e.target.value)} placeholder="e.g., 1st: ৳30,000 | 2nd: ৳15,000" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Contact Email" type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
          <Input label="Contact Phone" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
        </div>
        <Select label="Status" value={form.is_active} onChange={e => set('is_active', Number(e.target.value))}>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </Select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FileUpload label="Segment Image" file={imageFile} setFile={setImageFile} accept="image/*" id="img-upload" />
          <FileUpload label="Rulebook PDF" file={rulebookFile} setFile={setRulebookFile} accept=".pdf" id="rb-upload" />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/admin/segments" className="btn btn-ghost">Cancel</Link>
          <Button type="submit" variant="primary" loading={saving}><Save size={16} /> {isEdit ? 'Update' : 'Create'} Segment</Button>
        </div>
      </form>
    </div>
  );
}
