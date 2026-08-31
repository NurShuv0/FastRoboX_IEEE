import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFaqs } from '../services/api';
import { SectionHeader, Loader, EmptyState } from '../components/UI/index.jsx';
import { Link } from 'react-router-dom';

function AccordionItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`accordion-item ${open ? 'open' : ''}`}
    >
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: open ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--color-primary)', marginTop: 2,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {faq.question}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="accordion-body">{faq.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaqs()
      .then(r => setFaqs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
        <SectionHeader
          tag="Help Center"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about FastRobox 1.0. Can't find an answer? Contact us directly."
        />

        {loading ? (
          <Loader text="Loading FAQs..." />
        ) : faqs.length === 0 ? (
          <EmptyState icon={<HelpCircle size={28} />} title="FAQs Coming Soon" message="We're preparing answers to your questions." />
        ) : (
          <div>
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.id} faq={faq} index={i} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{
            padding: '2rem', marginTop: '2.5rem', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(163,230,53,0.03))',
          }}
        >
          <HelpCircle size={32} style={{ color: 'var(--color-primary)', marginBottom: 12 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8 }}>
            Still have questions?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Reach out to our organizing committee and we'll get back to you within 24 hours.
          </p>
          <a href="mailto:info@fastrobox.bubt.edu.bd" className="btn btn-primary btn-sm">
            Email Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
