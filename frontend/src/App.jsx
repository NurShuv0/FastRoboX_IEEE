import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AnimatedBackground from './components/UI/AnimatedBackground';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Public Pages
import Home from './pages/Home';
import Notice from './pages/Notice';
import NoticeDetails from './pages/NoticeDetails';
import SegmentDetails from './pages/SegmentDetails';
import Timeline from './pages/Timeline';
import FAQ from './pages/FAQ';
import Register from './pages/Register';
import RegistrationStatus from './pages/RegistrationStatus';

// Admin
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './pages/Admin/Layout';
import Dashboard from './pages/Admin/Dashboard';
import AdminNotices from './pages/Admin/Notices';
import NoticeForm from './pages/Admin/NoticeForm';
import AdminSegments from './pages/Admin/Segments';
import SegmentForm from './pages/Admin/SegmentForm';
import AdminRegistrations from './pages/Admin/Registrations';
import AdminTimeline from './pages/Admin/AdminTimeline';
import AdminSponsors from './pages/Admin/AdminSponsors';
import AdminFAQs from './pages/Admin/AdminFAQs';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminMessages from './pages/Admin/AdminMessages';

// Public layout wrapper
function PublicLayout({ children }) {
  return (
    <>
      <AnimatedBackground intensity={1} />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/notice" element={<PublicLayout><Notice /></PublicLayout>} />
              <Route path="/notice/:id" element={<PublicLayout><NoticeDetails /></PublicLayout>} />
              <Route path="/segments/:id" element={<PublicLayout><SegmentDetails /></PublicLayout>} />
              <Route path="/timeline" element={<PublicLayout><Timeline /></PublicLayout>} />
              <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
              <Route path="/status" element={<PublicLayout><RegistrationStatus /></PublicLayout>} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Panel (protected via AdminLayout) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="notices" element={<AdminNotices />} />
                <Route path="notices/new" element={<NoticeForm />} />
                <Route path="notices/:id/edit" element={<NoticeForm />} />
                <Route path="segments" element={<AdminSegments />} />
                <Route path="segments/new" element={<SegmentForm />} />
                <Route path="segments/:id/edit" element={<SegmentForm />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="timeline" element={<AdminTimeline />} />
                <Route path="sponsors" element={<AdminSponsors />} />
                <Route path="faqs" element={<AdminFAQs />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={
                <PublicLayout>
                  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '1rem' }}>
                    <div style={{ fontSize: '5rem' }}>🤖</div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)' }}>404 — Page Not Found</h1>
                    <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </PublicLayout>
              } />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
