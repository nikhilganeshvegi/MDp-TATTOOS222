import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout = ({ children, activeTitle = 'Dashboard' }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: "Today's Appointments", to: '/admin/today', icon: Calendar },
    { label: 'Upcoming Appointments', to: '/admin/upcoming', icon: Clock },
  ];

  return (
    <div className="admin-dashboard-layout">
      {/* ── Left Sidebar Navigation (Desktop) ── */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand" title="View Public Website">
            <img
              src="/mdp-logo.png"
              alt="MDP TATTOOS"
              className="admin-sidebar-logo"
              width="42"
              height="42"
            />
            <div className="admin-sidebar-titles">
              <span className="admin-sidebar-name">MDP TATTOOS</span>
              <span className="admin-sidebar-tag">OPERATIONS CONTROL</span>
            </div>
          </Link>
          <button
            type="button"
            className="admin-mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-nav">
          <div className="admin-nav-section-title">ADMIN NAVIGATION</div>
          <nav className="admin-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="admin-nav-section-title" style={{ marginTop: '2rem' }}>QUICK LINKS</div>
          <nav className="admin-nav-links">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
              <ExternalLink size={16} aria-hidden="true" />
              <span>Public Website</span>
            </Link>
            <Link to="/book" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
              <Calendar size={16} aria-hidden="true" />
              <span>Public Booking Page</span>
            </Link>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-user-avatar">
              <ShieldCheck size={16} className="gold-icon" />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-role">VERIFIED ADMIN</span>
              <span className="admin-user-email" title={admin?.email || 'mdptattoos10@gmail.com'}>
                {admin?.email || 'mdptattoos10@gmail.com'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-sidebar-btn"
            title="Log out of Admin Dashboard"
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main Workspace ── */}
      <div className="admin-main-wrap">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin navigation menu"
            >
              <Menu size={22} />
            </button>
            <span className="admin-topbar-kicker">MDP TATTOOS</span>
            <span className="admin-topbar-divider">/</span>
            <span className="admin-topbar-active-page">{activeTitle}</span>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-date-badge">{todayFormatted}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-topbar-logout-btn"
              title="Log Out"
            >
              <LogOut size={14} aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <main className="admin-main-content">
          <div className="admin-content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
