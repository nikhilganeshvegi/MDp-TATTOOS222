import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  Calendar,
  Clock,
  CheckCircle2,
  LogOut,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  CalendarDays,
  SlidersHorizontal,
  Sparkles,
  Info
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="admin-dashboard-layout">
      {/* ── Left Sidebar Navigation (Foundation) ── */}
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand" title="View Public Website">
            <img
              src="/mdp-logo.png"
              alt="MDP TATTOOS"
              className="admin-sidebar-logo"
              width="44"
              height="44"
            />
            <div className="admin-sidebar-titles">
              <span className="admin-sidebar-name">MDP TATTOOS</span>
              <span className="admin-sidebar-tag">OPERATIONS CONTROL</span>
            </div>
          </Link>
        </div>

        <div className="admin-sidebar-nav">
          <div className="admin-nav-section-title">MANAGEMENT</div>
          <nav className="admin-nav-links">
            <button type="button" className="admin-nav-item active">
              <LayoutDashboard size={17} aria-hidden="true" />
              <span>Overview</span>
            </button>
            <button type="button" className="admin-nav-item disabled-future" title="Scheduled for upcoming release">
              <CalendarDays size={17} aria-hidden="true" />
              <span>Appointments</span>
              <span className="admin-badge-future">Upcoming</span>
            </button>
            <button type="button" className="admin-nav-item disabled-future" title="Scheduled for upcoming release">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span>Slot Rules</span>
              <span className="admin-badge-future">Upcoming</span>
            </button>
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

      {/* ── Main Dashboard Workspace ── */}
      <div className="admin-main-wrap">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-topbar-kicker">MDP TATTOOS STUDIO</span>
            <span className="admin-topbar-divider">/</span>
            <span className="admin-topbar-active-page">Admin Dashboard</span>
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

            {/* Welcome Banner */}
            <div className="admin-welcome-card">
              <div className="admin-welcome-text">
                <div className="admin-pill-badge">
                  <Sparkles size={12} className="gold-icon" />
                  <span>PHASE 1 FOUNDATION READY</span>
                </div>
                <h1 className="admin-page-heading">Admin Dashboard</h1>
                <p className="admin-page-sub">
                  Welcome to the MDP TATTOOS control foundation. Core authentication and layout
                  structures are initialized. Complete appointment filtering, management, and controls
                  will be deployed in subsequent tasks.
                </p>
              </div>
              <div className="admin-welcome-meta">
                <div className="meta-stat-box">
                  <span className="msb-label">OPERATING STATUS</span>
                  <span className="msb-value status-online">LIVE / AUTHENTICATED</span>
                </div>
              </div>
            </div>

            {/* Notice Strip */}
            <div className="admin-notice-strip">
              <Info size={16} className="gold-icon" aria-hidden="true" />
              <span>
                <strong>Foundation Notice:</strong> The sections below represent UI placeholders for Task 1.
                Real-time appointment listing and operational toggles will be integrated in upcoming tasks.
              </span>
            </div>

            {/* ── 3 Required Foundation Cards / Sections ── */}
            <div className="admin-foundation-grid">

              {/* 1. Today's Appointments Placeholder */}
              <section className="admin-dashboard-card" aria-labelledby="today-heading">
                <div className="adc-header">
                  <div className="adc-header-left">
                    <div className="adc-icon-wrap">
                      <Calendar size={18} className="gold-icon" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="today-heading" className="adc-title">Today's Appointments</h2>
                      <p className="adc-sub">Scheduled sessions for today's operating hours</p>
                    </div>
                  </div>
                  <span className="adc-tag">PLACEHOLDER</span>
                </div>

                <div className="adc-body">
                  <div className="adc-stat-row">
                    <div className="adc-stat-item">
                      <span className="adc-stat-val">0</span>
                      <span className="adc-stat-lbl">Confirmed Today</span>
                    </div>
                    <div className="adc-stat-divider" />
                    <div className="adc-stat-item">
                      <span className="adc-stat-val">9:00 AM – 9:00 PM</span>
                      <span className="adc-stat-lbl">Working Window</span>
                    </div>
                  </div>

                  <div className="adc-placeholder-box">
                    <Calendar size={28} className="adc-placeholder-icon" aria-hidden="true" />
                    <p className="adc-placeholder-primary">Today's Appointment Queue</p>
                    <p className="adc-placeholder-desc">
                      Detailed chronological breakdown of confirmed sessions will be populated here.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Upcoming Appointments Placeholder */}
              <section className="admin-dashboard-card" aria-labelledby="upcoming-heading">
                <div className="adc-header">
                  <div className="adc-header-left">
                    <div className="adc-icon-wrap">
                      <Clock size={18} className="gold-icon" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="upcoming-heading" className="adc-title">Upcoming Appointments</h2>
                      <p className="adc-sub">Future weekday client sessions &amp; catalog tiers</p>
                    </div>
                  </div>
                  <span className="adc-tag">PLACEHOLDER</span>
                </div>

                <div className="adc-body">
                  <div className="adc-stat-row">
                    <div className="adc-stat-item">
                      <span className="adc-stat-val">Mon – Fri</span>
                      <span className="adc-stat-lbl">Calendar Days</span>
                    </div>
                    <div className="adc-stat-divider" />
                    <div className="adc-stat-item">
                      <span className="adc-stat-val">20 Styles</span>
                      <span className="adc-stat-lbl">Active Catalog</span>
                    </div>
                  </div>

                  <div className="adc-placeholder-box">
                    <Clock size={28} className="adc-placeholder-icon" aria-hidden="true" />
                    <p className="adc-placeholder-primary">Upcoming Bookings Schedule</p>
                    <p className="adc-placeholder-desc">
                      Upcoming customer sessions sorted by date and duration will render in this card.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Appointment Booking Status Placeholder */}
              <section className="admin-dashboard-card" aria-labelledby="status-heading">
                <div className="adc-header">
                  <div className="adc-header-left">
                    <div className="adc-icon-wrap">
                      <CheckCircle2 size={18} className="gold-icon" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="status-heading" className="adc-title">Appointment Booking Status</h2>
                      <p className="adc-sub">Real-time availability engine &amp; public intake status</p>
                    </div>
                  </div>
                  <span className="adc-tag">PLACEHOLDER</span>
                </div>

                <div className="adc-body">
                  <div className="adc-stat-row">
                    <div className="adc-stat-item">
                      <span className="adc-stat-val text-success">Active</span>
                      <span className="adc-stat-lbl">Intake Status</span>
                    </div>
                    <div className="adc-stat-divider" />
                    <div className="adc-stat-item">
                      <span className="adc-stat-val">WhatsApp</span>
                      <span className="adc-stat-lbl">Confirmation Relay</span>
                    </div>
                  </div>

                  <div className="adc-placeholder-box">
                    <CheckCircle2 size={28} className="adc-placeholder-icon" aria-hidden="true" />
                    <p className="adc-placeholder-primary">Booking Engine Controls</p>
                    <p className="adc-placeholder-desc">
                      Studio availability toggles, vacation dates, and manual slot controls will be added here.
                    </p>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
