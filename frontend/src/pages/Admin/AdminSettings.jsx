import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Globe, Phone, Mail, CreditCard, Share2,
  Save, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { adminGetSettings, adminUpdateSettings } from '../../services/api';
import { Input, Button } from '../../components/UI/index.jsx';

const TABS = [
  { id: 'event', label: 'Event Info', icon: <Globe size={15} /> },
  { id: 'org', label: 'Organization', icon: <Settings size={15} /> },
  { id: 'contact', label: 'Contact', icon: <Phone size={15} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={15} /> },
  { id: 'social', label: 'Social Media', icon: <Share2 size={15} /> },
];

const FIELD_CONFIG = {
  event: [
    { key: 'event_name', label: 'Event Name', type: 'text', placeholder: 'FASTROBOX 1.0' },
    { key: 'event_tagline', label: 'Event Tagline', type: 'text', placeholder: 'National Robotics & Tech Carnival' },
    { key: 'event_date', label: 'Event Date', type: 'date' },
    { key: 'event_venue', label: 'Venue (Short)', type: 'text', placeholder: 'BUBT Campus, Mirpur, Dhaka' },
    { key: 'event_venue_address', label: 'Full Venue Address', type: 'text', placeholder: 'Rupnagar R/A, Mirpur-2, Dhaka-1216, Bangladesh' },
    { key: 'event_prize_pool', label: 'Prize Pool (Display Text)', type: 'text', placeholder: 'BDT 200K+' },
    { key: 'registration_open_date', label: 'Registration Opens', type: 'date' },
    { key: 'registration_deadline', label: 'Registration Deadline', type: 'date' },
    { key: 'registration_is_open', label: 'Registration Open? (1=Yes, 0=No)', type: 'select', options: [['1', 'Yes — Open'], ['0', 'No — Closed']] },
  ],
  org: [
    { key: 'organizer_name', label: 'Organizer Name', type: 'text', placeholder: "IEEE Students' Branch" },
    { key: 'host_university', label: 'Host University (Full Name)', type: 'text', placeholder: 'Bangladesh University of Business and Technology (BUBT)' },
  ],
  contact: [
    { key: 'contact_email', label: 'Contact Email', type: 'email', placeholder: 'organizer@bubt.edu.bd' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'text', placeholder: '+880 1XXXXXXXXX' },
    { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+8801XXXXXXXXX (include country code)' },
    { key: 'contact_address', label: 'Contact Address', type: 'text', placeholder: 'BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216' },
  ],
  payment: [
    { key: 'payment_bkash', label: 'bKash Number', type: 'text', placeholder: '01XXXXXXXXX' },
    { key: 'payment_nagad', label: 'Nagad Number', type: 'text', placeholder: '01XXXXXXXXX' },
    { key: 'payment_bank_name', label: 'Bank Name', type: 'text', placeholder: 'e.g., Dutch-Bangla Bank' },
    { key: 'payment_bank_account', label: 'Bank Account Number', type: 'text', placeholder: 'Account number' },
    { key: 'payment_bank_routing', label: 'Bank Routing Number', type: 'text', placeholder: 'Routing number (optional)' },
    { key: 'payment_instructions', label: 'Payment Instructions', type: 'textarea', placeholder: 'e.g., Send to bKash/Nagad number above. Use your Team Name as the reference. Screenshot upload required.' },
    { key: 'payment_note', label: 'Payment Note (shown in registration)', type: 'textarea', placeholder: 'Any additional payment notes...' },
  ],
  social: [
    { key: 'social_facebook', label: 'Facebook Page URL', type: 'url', placeholder: 'https://facebook.com/...' },
    { key: 'social_instagram', label: 'Instagram Profile URL', type: 'url', placeholder: 'https://instagram.com/...' },
    { key: 'social_linkedin', label: 'LinkedIn Page URL', type: 'url', placeholder: 'https://linkedin.com/...' },
    { key: 'social_youtube', label: 'YouTube Channel URL', type: 'url', placeholder: 'https://youtube.com/...' },
    { key: 'social_website', label: 'Official Website URL', type: 'url', placeholder: 'https://...' },
  ],
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('event');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGetSettings()
      .then(r => {
        // Flatten grouped settings into flat key-value map
        const data = r.data.data || {};
        const flat = {};
        Object.values(data).forEach(group => {
          if (Array.isArray(group)) {
            group.forEach(item => { flat[item.setting_key] = item.setting_value ?? ''; });
          }
        });
        setSettings(flat);
      })
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await adminUpdateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fields = FIELD_CONFIG[activeTab] || [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Settings size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Site Settings
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage event information, contact details, payment numbers, and social media links.
          Changes are reflected immediately across the public website.
        </p>
      </div>

      {/* Alert */}
      <div style={{
        padding: '12px 16px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)',
        borderRadius: 10, marginBottom: '1.5rem', display: 'flex', gap: 10, alignItems: 'flex-start',
        fontSize: '0.85rem', color: 'var(--text-muted)',
      }}>
        <AlertCircle size={16} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
        <div>
          Leave contact, payment, and social fields <strong style={{ color: 'var(--text-secondary)' }}>empty</strong> if not yet determined.
          Empty fields will display "To Be Announced" on the public website — no fake information will be shown.
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem', padding: '6px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 7 }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '3rem', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
          Loading settings...
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>

          {fields.map(field => (
            <div key={field.key} style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'none' }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={settings[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  {field.options?.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={settings[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
              ) : (
                <input
                  type={field.type}
                  value={settings[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              )}
            </div>
          ))}

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <Button variant="primary" onClick={handleSave} loading={saving} style={{ minWidth: 140 }}>
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}
              >
                Settings saved successfully.
              </motion.span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
