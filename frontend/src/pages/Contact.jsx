import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageCircle, Send, CheckCircle,
  AlertCircle, User, AtSign, FileText, Clock, Building2
} from 'lucide-react';
import { submitContact } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { SectionHeader, Input, Textarea, Button } from '../components/UI/index.jsx';

export default function Contact() {
  const { getSetting, hasSetting } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const email = getSetting('contact_email');
  const phone = getSetting('contact_phone');
  const whatsapp = getSetting('contact_whatsapp');
  const address = getSetting('contact_address', 'BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216');
  const organizer = getSetting('organizer_name', "IEEE Students' Branch");
  const host = getSetting('host_university', 'Bangladesh University of Business and Technology (BUBT)');

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Your name is required.';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'A valid email is required.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.length < 20) errs.message = 'Please write at least 20 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitContact(form);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    email && { icon: <Mail size={18} />, label: 'Email', value: email, href: `mailto:${email}` },
    phone && { icon: <Phone size={18} />, label: 'Phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    whatsapp && { icon: <MessageCircle size={18} />, label: 'WhatsApp', value: whatsapp, href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` },
    address && { icon: <MapPin size={18} />, label: 'Venue', value: address },
  ].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <SectionHeader
          tag="Get in Touch"
          title="Contact Us"
          subtitle={`Have questions about FASTROBOX 1.0? Reach out to the ${organizer} organizing team at BUBT.`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem', alignItems: 'start' }}
             className="contact-layout">

          {/* Left — Info */}
          <div>
            {/* Organizer card */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
                }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {organizer}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{host}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                Response within 24–48 business hours
              </div>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
              {infoItems.length > 0 ? (
                infoItems.map(item => (
                  <div key={item.label} className="contact-info-item">
                    <div className="contact-icon">{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                           rel="noopener noreferrer"
                           style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
                           onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                           onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <AlertCircle size={28} style={{ color: '#eab308', marginBottom: 10 }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Contact information will be announced soon.<br />
                    Check the <strong style={{ color: 'var(--color-primary)' }}>Notice Board</strong> for updates.
                  </p>
                </div>
              )}
            </div>

            {/* Event Quick Info */}
            <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(34,197,94,0.04)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600 }}>
                Event Info
              </div>
              {[
                ['Event', 'FASTROBOX 1.0'],
                ['Date', '14 November 2026'],
                ['Venue', 'BUBT Campus, Mirpur, Dhaka'],
                ['Registration Deadline', '20 October 2026'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(34,197,94,0.08)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{k}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 1rem' }}
              >
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)', border: '2px solid var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                }}>
                  <CheckCircle size={34} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 10 }}>
                  Message Sent!
                </h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Thank you for reaching out. The organizing team will respond within 24–48 business hours.
                </p>
                <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  Send a Message
                </h2>

                {submitError && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: 9, alignItems: 'center' }}>
                    <AlertCircle size={15} /> {submitError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Input
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your full name"
                    error={errors.name}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                </div>
                <Input
                  label="Subject"
                  required
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  placeholder="e.g., Registration Query, Technical Question"
                  error={errors.subject}
                />
                <Textarea
                  label="Message"
                  required
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  error={errors.message}
                />
                <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Send size={16} /> Send Message
                </Button>
                <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  Your message will be received by the {organizer} organizing committee.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
