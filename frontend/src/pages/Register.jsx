import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle, Plus, Trash2,
  User, Users, CreditCard, Eye, Send, Zap, Upload
} from 'lucide-react';
import { getSegments, submitRegistration } from '../services/api';
import { Input, Select, Textarea, Button, Loader } from '../components/UI/index.jsx';

// Step labels
const STEPS = [
  { label: 'Competition', icon: <Zap size={16} /> },
  { label: 'Team Info', icon: <Users size={16} /> },
  { label: 'Leader', icon: <User size={16} /> },
  { label: 'Members', icon: <Users size={16} /> },
  { label: 'Payment', icon: <CreditCard size={16} /> },
  { label: 'Review', icon: <Eye size={16} /> },
];

// ── STEP PROGRESS ────────────────────────────────────────────────
function StepProgress({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: 4 }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60 }}>
            <div className={`step-dot ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <div style={{ fontSize: '0.65rem', color: i <= step ? 'var(--color-primary)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
              {s.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${i < step ? 'completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    segment_id: searchParams.get('segment') || '',
    team_name: '',
    institution: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    members: [{ full_name: '', email: '', phone: '' }],
    payment_method: '',
    transaction_id: '',
    payment_screenshot: null,
  });

  useEffect(() => {
    getSegments()
      .then(r => setSegments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedSegment = segments.find(s => String(s.id) === String(formData.segment_id));

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const addMember = () => {
    set('members', [...formData.members, { full_name: '', email: '', phone: '' }]);
  };

  const removeMember = (i) => {
    set('members', formData.members.filter((_, idx) => idx !== i));
  };

  const updateMember = (i, key, val) => {
    const m = [...formData.members];
    m[i] = { ...m[i], [key]: val };
    set('members', m);
  };

  const validate = () => {
    const errs = {};
    if (step === 0 && !formData.segment_id) errs.segment_id = 'Please select a competition.';
    if (step === 1) {
      if (!formData.team_name.trim()) errs.team_name = 'Team name is required.';
      if (!formData.institution.trim()) errs.institution = 'Institution is required.';
    }
    if (step === 2) {
      if (!formData.leader_name.trim()) errs.leader_name = 'Name is required.';
      if (!formData.leader_email.trim() || !formData.leader_email.includes('@')) errs.leader_email = 'Valid email is required.';
      if (!formData.leader_phone.trim()) errs.leader_phone = 'Phone is required.';
    }
    if (step === 3 && selectedSegment) {
      const total = formData.members.length + 1; // +1 for leader
      if (total < selectedSegment.min_team_size) errs.members = `Minimum ${selectedSegment.min_team_size} team members required (including leader).`;
      if (total > selectedSegment.max_team_size) errs.members = `Maximum ${selectedSegment.max_team_size} team members allowed.`;
      formData.members.forEach((m, i) => {
        if (!m.full_name.trim()) errs[`member_${i}_name`] = 'Name required.';
        if (!m.email.trim() || !m.email.includes('@')) errs[`member_${i}_email`] = 'Valid email required.';
        if (!m.phone.trim()) errs[`member_${i}_phone`] = 'Phone required.';
      });
    }
    if (step === 4) {
      if (!formData.payment_method) errs.payment_method = 'Payment method is required.';
      if (!formData.transaction_id.trim()) errs.transaction_id = 'Transaction ID is required.';
      if (!formData.payment_screenshot) errs.payment_screenshot = 'Payment screenshot is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'members') fd.append(k, JSON.stringify(v));
        else if (k === 'payment_screenshot') { if (v) fd.append(k, v); }
        else fd.append(k, v);
      });
      const res = await submitRegistration(fd);
      setSuccess(res.data.data);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ paddingTop: 88 }}><Loader text="Loading competitions..." fullPage /></div>;

  if (success) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ maxWidth: 520, width: '100%', padding: '3rem', textAlign: 'center' }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)',
            border: '2px solid var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}>
            <CheckCircle size={40} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 8 }}>
            Registration Successful!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Your registration has been submitted. Our team will verify your payment within 24–48 hours.
          </p>
          <div style={{
            padding: '1rem', background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Your Registration ID
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.4rem',
              color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em',
            }}>
              {success.registration_id}
            </div>
          </div>
          <div style={{
            fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem',
            padding: '0.75rem', background: 'rgba(234,179,8,0.08)',
            border: '1px solid rgba(234,179,8,0.2)', borderRadius: 8,
          }}>
            ⚠ Status: <strong style={{ color: '#eab308' }}>Pending Verification</strong>
            <br />Save your Registration ID to check status later.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/status?id=${success.registration_id}&email=${formData.leader_email}`} className="btn btn-primary btn-sm">
              Check Status
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Team Registration
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)' }}>
            Register for FastRobox 1.0
          </h1>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <StepProgress step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >

              {/* ── STEP 0: Select Competition ──────────────── */}
              {step === 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Select Your Competition
                  </h3>
                  {errors.segment_id && <div className="form-error" style={{ marginBottom: 12 }}>⚠ {errors.segment_id}</div>}
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {segments.map(seg => (
                      <div
                        key={seg.id}
                        onClick={() => set('segment_id', String(seg.id))}
                        style={{
                          padding: '1.25rem',
                          borderRadius: 12,
                          border: `2px solid ${String(formData.segment_id) === String(seg.id) ? 'var(--color-primary)' : 'var(--border-color)'}`,
                          background: String(formData.segment_id) === String(seg.id) ? 'rgba(34,197,94,0.08)' : 'var(--bg-card)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
                          {{ 'robo-soccer': '⚽', 'line-follower': '🚗', 'project-showcase': '💡' }[seg.slug] || '🤖'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                          {seg.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Fee: ৳{seg.registration_fee}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {seg.min_team_size}–{seg.max_team_size} members
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 1: Team Info ────────────────────────── */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Team Information
                  </h3>
                  <Input
                    label="Team Name" required
                    value={formData.team_name}
                    onChange={e => set('team_name', e.target.value)}
                    placeholder="e.g., Code Warriors"
                    error={errors.team_name}
                  />
                  <Input
                    label="Institution / University" required
                    value={formData.institution}
                    onChange={e => set('institution', e.target.value)}
                    placeholder="e.g., BUBT, BUET, DU..."
                    error={errors.institution}
                  />
                  <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.05)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>Selected Competition</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{selectedSegment?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Fee: ৳{selectedSegment?.registration_fee} | Team: {selectedSegment?.min_team_size}–{selectedSegment?.max_team_size} members
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Leader Info ──────────────────────── */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Team Leader Information
                  </h3>
                  <Input label="Full Name" required value={formData.leader_name}
                    onChange={e => set('leader_name', e.target.value)} placeholder="Your full name" error={errors.leader_name} />
                  <Input label="Email Address" required type="email" value={formData.leader_email}
                    onChange={e => set('leader_email', e.target.value)} placeholder="leader@example.com" error={errors.leader_email} />
                  <Input label="Phone Number" required type="tel" value={formData.leader_phone}
                    onChange={e => set('leader_phone', e.target.value)} placeholder="+880 1XXXXXXXXX" error={errors.leader_phone} />
                </div>
              )}

              {/* ── STEP 3: Team Members ─────────────────────── */}
              {step === 3 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)' }}>
                      Team Members
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Total with leader: {formData.members.length + 1} / {selectedSegment?.max_team_size} max
                    </div>
                  </div>
                  {errors.members && <div className="form-error" style={{ marginBottom: 12 }}>⚠ {errors.members}</div>}

                  {formData.members.map((m, i) => (
                    <div key={i} style={{
                      padding: '1rem', marginBottom: '1rem',
                      border: '1px solid var(--border-color)', borderRadius: 12,
                      background: 'rgba(34,197,94,0.03)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          Member {i + 2}
                        </span>
                        <button
                          onClick={() => removeMember(i)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        <Input label="Full Name" value={m.full_name} onChange={e => updateMember(i, 'full_name', e.target.value)}
                          placeholder="Member name" error={errors[`member_${i}_name`]} />
                        <Input label="Email" type="email" value={m.email} onChange={e => updateMember(i, 'email', e.target.value)}
                          placeholder="Email" error={errors[`member_${i}_email`]} />
                        <Input label="Phone" value={m.phone} onChange={e => updateMember(i, 'phone', e.target.value)}
                          placeholder="+880..." error={errors[`member_${i}_phone`]} />
                      </div>
                    </div>
                  ))}

                  {formData.members.length + 1 < (selectedSegment?.max_team_size || 5) && (
                    <button
                      onClick={addMember}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: 'var(--border-color)' }}
                    >
                      <Plus size={16} /> Add Member
                    </button>
                  )}
                </div>
              )}

              {/* ── STEP 4: Payment ──────────────────────────── */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Payment Information
                  </h3>

                  {/* Fee Info */}
                  <div style={{
                    padding: '1rem 1.25rem', background: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, marginBottom: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration Fee</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                          ৳{selectedSegment?.registration_fee}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div><strong>bKash:</strong> 01XXXXXXXXX</div>
                        <div><strong>Nagad:</strong> 01XXXXXXXXX</div>
                        <div><strong>Ref:</strong> Your Team Name</div>
                      </div>
                    </div>
                  </div>

                  <Select label="Payment Method" required value={formData.payment_method}
                    onChange={e => set('payment_method', e.target.value)} error={errors.payment_method}>
                    <option value="">Select method</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </Select>
                  <Input label="Transaction ID" required value={formData.transaction_id}
                    onChange={e => set('transaction_id', e.target.value)}
                    placeholder="Enter your transaction reference ID" error={errors.transaction_id} />

                  <div className="form-group">
                    <label className="form-label">Payment Screenshot <span style={{ color: '#f87171' }}>*</span></label>
                    <div
                      style={{
                        border: `2px dashed ${formData.payment_screenshot ? 'var(--color-primary)' : 'var(--border-color)'}`,
                        borderRadius: 12, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                        background: formData.payment_screenshot ? 'rgba(34,197,94,0.05)' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => document.getElementById('screenshot-input').click()}
                    >
                      {formData.payment_screenshot ? (
                        <div>
                          <CheckCircle size={24} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                            {formData.payment_screenshot.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to replace</div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 6 }} />
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Click to upload payment screenshot</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>JPG, PNG, PDF — Max 5MB</div>
                        </div>
                      )}
                    </div>
                    <input id="screenshot-input" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => set('payment_screenshot', e.target.files[0])} />
                    {errors.payment_screenshot && <div className="form-error">⚠ {errors.payment_screenshot}</div>}
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review ───────────────────────────── */}
              {step === 5 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Review & Submit
                  </h3>
                  {errors.submit && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      ⚠ {errors.submit}
                    </div>
                  )}
                  {[
                    { label: 'Competition', value: selectedSegment?.name },
                    { label: 'Team Name', value: formData.team_name },
                    { label: 'Institution', value: formData.institution },
                    { label: 'Team Leader', value: `${formData.leader_name} · ${formData.leader_email} · ${formData.leader_phone}` },
                    { label: `Members (${formData.members.length})`, value: formData.members.map(m => m.full_name || 'Unnamed').join(', ') },
                    { label: 'Payment Method', value: formData.payment_method },
                    { label: 'Transaction ID', value: formData.transaction_id },
                    { label: 'Screenshot', value: formData.payment_screenshot?.name || 'Not uploaded' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: 'flex', gap: 16, padding: '10px 0',
                      borderBottom: '1px solid var(--border-color)',
                    }}>
                      <div style={{ minWidth: 130, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value || '—'}</div>
                    </div>
                  ))}
                  <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    By submitting, you confirm that all information is accurate and you agree to the competition rules.
                    Your registration status will be updated after payment verification.
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ChevronLeft size={16} /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="primary" onClick={next}>
                Continue <ChevronRight size={16} />
              </Button>
            ) : (
              <Button variant="primary" onClick={submit} loading={submitting}>
                <Send size={16} /> Submit Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
