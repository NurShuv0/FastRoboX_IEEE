import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFaqs } from '../services/api';
import { SectionHeader, Loader } from '../components/UI/index.jsx';

// Static fallback FAQs if DB is empty — matches official PDF data
const STATIC_FAQS = [
  { id: 1, question: 'Who can participate in FASTROBOX 1.0?', answer: 'FASTROBOX 1.0 is open to students across Bangladesh. Eligibility varies: Robo Soccer and Line Following Robot are open to undergraduate college and university students. Project Showcasing has Junior (Class 5–12) and Senior (University & Polytechnic) categories. Techathon accepts undergraduate students (cross-university teams allowed). Poster Presentation is open to undergraduate students from recognized institutions.' },
  { id: 2, question: 'What are the five competition segments?', answer: 'FASTROBOX 1.0 features five competitions:\n1. Project Showcasing — Junior & Senior categories for innovative tech projects.\n2. Line Following Robot (LFR) — fastest autonomous track robot.\n3. Robo Soccer — wireless-controlled robot soccer matches.\n4. Techathon — two-round IoT Hackathon.\n5. Poster Presentation — academic research across 6 tracks.' },
  { id: 3, question: 'What are the registration fees?', answer: 'Project Showcasing: BDT 2,000 for 1–4 members (+BDT 500/extra member).\nLine Following Robot: BDT 2,000 for 1–4 members (+BDT 500/extra member).\nRobo Soccer: BDT 2,000 for 1–4 members (+BDT 500/extra member).\nTechathon Round 1: BDT 100/team (Grand Finale for qualified teams: BDT 2,400).\nPoster Presentation: BDT 400/member (team of 3–4 members).' },
  { id: 4, question: 'When is the registration deadline?', answer: 'Registration for FASTROBOX 1.0 is open from 7 September 2026 to 20 October 2026. No late registrations will be accepted after the deadline.' },
  { id: 5, question: 'When and where is the event?', answer: 'FASTROBOX 1.0 will be held on 14 November 2026 at BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216. Organized by the IEEE Students\' Branch.' },
  { id: 6, question: 'Can team members be from different universities?', answer: 'For the Techathon, cross-university teams are explicitly allowed. For other segments, teams should generally be from the same institution. Check the official rulebook for specific segment eligibility rules.' },
  { id: 7, question: 'How does payment work for registration?', answer: 'After submitting your registration online, pay the registration fee via bKash or Nagad (payment numbers will be announced). Use your team name as the reference. Upload the payment screenshot in the registration form. Our team verifies payments within 24–48 hours and updates your registration status.' },
  { id: 8, question: 'What are the LFR robot requirements?', answer: 'Line Following Robots must be fully autonomous (no wireless control). Maximum dimensions: 25cm × 25cm × 15cm. Maximum weight: 1 kg. Maximum battery voltage: 16V DC. Onboard power only. Ready-made robots are prohibited. The robot must not damage the track.' },
  { id: 9, question: 'Is wireless communication required for Robo Soccer?', answer: 'Yes — Robo Soccer robots MUST use wireless communication (RF, NRF, or Bluetooth). Wired communication is strictly prohibited. Maximum onboard voltage is 12V. A kill switch is required. Ready-made toy car chassis and controllers are prohibited.' },
  { id: 10, question: 'Can I participate in multiple competitions?', answer: 'Yes, you may register for multiple competitions separately. Note that if event schedules overlap on the day, you may be unable to compete in both simultaneously. Plan accordingly when registering.' },
  { id: 11, question: 'Where can I find the official rulebook?', answer: 'The complete rulebook for all five competitions is available on the Rulebook page of this website. Read all rules carefully before preparing for your competition.' },
  { id: 12, question: 'How do I check my registration status?', answer: 'Visit the Registration Status page and enter your Registration ID (provided after submission) and team leader email. You can track whether your registration is Pending, Approved, or Rejected.' },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      className="glass-card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        borderColor: isOpen ? 'rgba(34,197,94,0.3)' : 'var(--border-color)',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{ borderColor: 'rgba(34,197,94,0.25)' }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '1.25rem 1.5rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
            background: isOpen ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-primary)', transition: 'all 0.2s',
          }}>
            <HelpCircle size={14} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700,
            color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
            lineHeight: 1.4,
          }}>
            {faq.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0, color: 'var(--color-primary)' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div style={{
              padding: '0 1.5rem 1.25rem 3.5rem',
              color: 'var(--text-muted)', fontSize: '0.9rem',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
            }}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(1); // First open by default

  useEffect(() => {
    getFaqs()
      .then(r => {
        const data = r.data.data || [];
        setFaqs(data.length > 0 ? data : STATIC_FAQS);
      })
      .catch(() => setFaqs(STATIC_FAQS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 0' }}>
        <SectionHeader
          tag="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about FASTROBOX 1.0. Can't find your answer? Contact us directly."
        />

        {loading ? (
          <Loader text="Loading FAQ..." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map(faq => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(prev => prev === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '3rem', textAlign: 'center' }}
        >
          <div className="glass-card" style={{ display: 'inline-block', padding: '1.5rem 2.5rem', borderColor: 'rgba(34,197,94,0.15)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Still have questions? The organizing team is here to help.
            </p>
            <a href="/contact" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
