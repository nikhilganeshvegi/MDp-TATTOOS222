import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { fetchTodayAppointments } from '../../api/adminApi.js';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  CalendarX2
} from 'lucide-react';

export const AdminTodayAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [dateFormatted, setDateFormatted] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  // Fallback date formatted in Asia/Kolkata (IST) in case API is loading
  const fallbackDateFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const loadTodayAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodayAppointments();
      if (data && data.success) {
        setAppointments(data.appointments || []);
        setDateFormatted(data.dateFormatted || fallbackDateFormatted);
        setLastSynced(new Date());
      } else {
        throw new Error(data?.message || 'Unable to load today\'s appointments.');
      }
    } catch (err) {
      console.error('[Admin Today] Fetch error:', err);
      setError(err.message || 'Unable to load today\'s appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const displayDate = dateFormatted || fallbackDateFormatted;

  return (
    <AdminLayout activeTitle="Today's Appointments">
      {/* ── Page Hero ── */}
      <div className="admin-page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="admin-page-kicker">SCHEDULE MANAGEMENT · ASIA/KOLKATA (IST)</span>
            <h1 className="admin-page-heading">Today's Appointments</h1>
            <p className="admin-page-sub">
              Chronological schedule for <strong>{displayDate}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={loadTodayAppointments}
            disabled={loading}
            className="admin-refresh-status-btn"
            title="Refresh Today's Appointments"
          >
            <RefreshCw size={14} className={loading ? 'admin-spin-icon' : ''} />
            <span>Sync Schedule</span>
          </button>
        </div>
      </div>

      {/* ── Quick Summary Stats ── */}
      <div className="admin-stats-summary-grid">
        <div className="admin-stat-summary-card">
          <span className="assc-label">Today's Date (IST)</span>
          <span className="assc-value">{displayDate.split(',')[1]?.trim() || displayDate}</span>
          <span className="assc-sub">{displayDate.split(',')[0]}</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Scheduled Sessions</span>
          <span className="assc-value text-gold">
            {loading ? '…' : `${appointments.length} ${appointments.length === 1 ? 'Session' : 'Sessions'}`}
          </span>
          <span className="assc-sub">Confirmed for today</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Operating Window</span>
          <span className="assc-value">9:00 AM – 9:00 PM</span>
          <span className="assc-sub">Mon–Sun, Open 7 Days</span>
        </div>
      </div>

      {/* ── Main Appointment Queue ── */}
      <div className="admin-section-block">
        <div className="asb-header">
          <h2 className="asb-title">Daily Session Queue</h2>
          <span className="asb-badge">
            {loading ? 'Loading…' : `${appointments.length} Total`}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="admin-loading-center">
            <RefreshCw size={28} className="admin-spin-icon gold-icon" />
            <p>Retrieving today's appointments from database…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="asb-empty-state">
            <AlertCircle size={36} color="#ef4444" className="asb-empty-icon" />
            <h3 className="asb-empty-title">Unable to Load Today's Appointments</h3>
            <p className="asb-empty-text">{error}</p>
            <button
              type="button"
              onClick={loadTodayAppointments}
              className="admin-retry-btn"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && appointments.length === 0 && (
          <div className="asb-empty-state">
            <CalendarX2 size={40} className="asb-empty-icon" />
            <h3 className="asb-empty-title">No appointments scheduled for today.</h3>
            <p className="asb-empty-text">
              There are no confirmed tattoo sessions scheduled on {displayDate}.
              New customer bookings made for today will appear here automatically.
            </p>
          </div>
        )}

        {/* Appointments List (Chronological: earliest first) */}
        {!loading && !error && appointments.length > 0 && (
          <div className="today-appointment-list">
            {appointments.map((appt, idx) => {
              const cleanPhone = String(appt.customerPhone || '').replace(/\D/g, '');
              const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                `Hello ${appt.customerName}, this is MDP TATTOOS regarding your appointment today (${appt.startFormatted} – ${appt.endFormatted}).`
              )}`;

              return (
                <div key={appt.id || appt._id || idx} className="today-appointment-card">
                  {/* Time Block */}
                  <div className="tac-time-strip">
                    <div className="tac-time-range">
                      <span>{appt.startFormatted || appt.startTime}</span>
                      <span className="tac-time-arrow">→</span>
                      <span>{appt.endFormatted || appt.endTime}</span>
                    </div>
                    <span className="tac-duration-badge">
                      <Clock size={11} />
                      <span>{appt.durationHours}h Session</span>
                    </span>
                  </div>

                  {/* Customer & Tattoo Details */}
                  <div className="tac-main">
                    <div className="tac-customer-header">
                      <h3 className="tac-customer-name">{appt.customerName}</h3>
                      <span className="tac-meta-pill">
                        {appt.customerAge} yrs · {appt.customerGender}
                      </span>
                      <span className="tac-status-tag confirmed">
                        <CheckCircle2 size={11} />
                        <span>{appt.status || 'CONFIRMED'}</span>
                      </span>
                    </div>

                    <div className="tac-tattoo-info">
                      <Sparkles size={14} className="gold-icon" />
                      <span>Tattoo Style: <strong className="tac-tattoo-name">{appt.tattooType}</strong></span>
                    </div>
                  </div>

                  {/* Contact & Actions */}
                  <div className="tac-actions">
                    <a
                      href={`tel:${appt.customerPhone}`}
                      className="tac-phone-link"
                      title="Call Customer"
                    >
                      <Phone size={14} />
                      <span>{appt.customerPhone}</span>
                    </a>
                    {cleanPhone && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tac-wa-relay-btn"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare size={14} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
