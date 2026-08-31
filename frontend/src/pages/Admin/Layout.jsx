import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Bell, Layers, ClipboardList, Calendar,
  Award, HelpCircle, Image, MessageSquare, LogOut, Zap,
  Menu, X, User, ChevronRight, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { to: '/admin/notices', label: 'Notices', icon: <Bell size={18} /> },
  { to: '/admin/segments', label: 'Segments', icon: <Layers size={18} /> },
  { to: '/admin/registrations', label: 'Registrations', icon: <ClipboardList size={18} /> },
  { to: '/admin/timeline', label: 'Timeline', icon: <Calendar size={18} /> },
  { to: '/admin/sponsors', label: 'Sponsors', icon: <Award size={18} /> },
  { to: '/admin/faqs', label: 'FAQs', icon: <HelpCircle size={18} /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <Image size={18} /> },
  { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
];

function Sidebar({ open, setOpen }) {
  const { admin, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully.');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Zap size={18} color="#052e16" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: '0.95rem', color: 'var(--color-primary)',
            }}>FastRobox</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          <div style={{ padding: '0 8px 8px', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            &nbsp;Management
          </div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 8px' }}>
          {/* View Site */}
          <a
            href="/" target="_blank" rel="noreferrer"
            className="admin-nav-item"
            style={{ display: 'flex', textDecoration: 'none', marginBottom: 2 }}
          >
            <ExternalLink size={16} />
            <span>View Public Site</span>
          </a>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="admin-nav-item"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          {/* Profile */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 10px', marginTop: 4,
            background: 'rgba(34,197,94,0.04)',
            borderRadius: 10, border: '1px solid var(--border-color)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#052e16', flexShrink: 0,
            }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {admin?.name || 'Admin'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {admin?.email}
              </div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#f87171', padding: 4,
            }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1rem' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="admin-main">
        {/* Top bar */}
        <div style={{
          height: 60, display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 16,
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'none', width: 36, height: 36, borderRadius: 8,
              border: '1px solid var(--border-color)', background: 'var(--bg-card)',
              cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
            id="sidebar-toggle"
          >
            <Menu size={18} />
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            FastRobox 1.0 Admin Portal
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '24px', minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
