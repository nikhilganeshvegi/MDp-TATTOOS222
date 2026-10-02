import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { fetchUpcomingAppointments } from '../../api/adminApi.js';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  CalendarX2,
  CalendarDays
} from 'lucide-react';

export const AdminUpcomingAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [todayDate, setTodayDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const loadUpcoming = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUpcomingAppointments();
      if (data && data.success) {
        setAppointments(data.appointments || []);
        setGroups(data.groups || []);
        setTotalUpcoming(data.totalUpcoming || (data.appointments ? data.appointments.length : 0));
        setTodayDate(data.todayDate || '');
        setLastSynced(new Date());
      } else {
        throw new Error(data?.message || 'Unable to load upcoming appointments.');
      }
    } catch (err) {
      console.error('[Admin Upcoming] Fetch error:', err);
      setError(err.message || 'Unable to load upcoming appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpcoming();
  }, []);

  // Determine earliest future date for stat banner
  const nextSessionDate = appointments.length > 0 ? appointments[0].fullDateLabel : null;

  return (
    <AdminLayout activeTitle="Upcoming Appointments">
      {/* ── Page Hero ── */}
      <div className="admin-page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="admin-page-kicker">SCHEDULE MANAGEMENT · ASIA/KOLKATA (IST)</span>
            <h1 className="admin-page-heading">Upcoming Appointments</h1>
            <p className="admin-page-sub">
              Advance bookings organized chronologically across upcoming days, months, and years.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUpcoming}
            disabled={loading}
            className="admin-refresh-status-btn"
            title="Refresh Upcoming Appointments"
          >
            <RefreshCw size={14} className={loading ? 'admin-spin-icon' : ''} />
            <span>Sync Schedule</span>
          </button>
        </div>
      </div>

      {/* ── Quick Summary Stats ── */}
      <div className="admin-stats-summary-grid">
        <div className="admin-stat-summary-card">
          <span className="assc-label">Upcoming Sessions</span>
          <span className="assc-value text-gold">
            {loading ? '…' : `${totalUpcoming} ${totalUpcoming === 1 ? 'Session' : 'Sessions'}`}
          </span>
          <span className="assc-sub">Scheduled for future dates</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Next Scheduled Session</span>
          <span className="assc-value" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loading ? '…' : (nextSessionDate ? appointments[0].dayLabel : 'None Scheduled')}
          </span>
          <span className="assc-sub">
            {nextSessionDate ? `${appointments[0].startFormatted} · ${appointments[0].year}` : 'Awaiting bookings'}
          </span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Operating Window</span>
          <span className="assc-value">9:00 AM – 9:00 PM</span>
          <span className="assc-sub">Mon–Sun, Open 7 Days</span>
        </div>
      </div>

      {/* ── Main Section Block ── */}
      <div className="admin-section-block">
        <div className="asb-header">
          <h2 className="asb-title">Chronological Advance Schedule</h2>
          <span className="asb-badge">
            {loading ? 'Loading…' : `${totalUpcoming} Total Upcoming`}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="admin-loading-center">
            <RefreshCw size={28} className="admin-spin-icon gold-icon" />
            <p>Retrieving upcoming appointments from database…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="asb-empty-state">
            <AlertCircle size={36} color="#ef4444" className="asb-empty-icon" />
            <h3 className="asb-empty-title">Unable to Load Upcoming Appointments</h3>
            <p className="asb-empty-text">{error}</p>
            <button
              type="button"
              onClick={loadUpcoming}
              className="admin-retry-btn"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && totalUpcoming === 0 && (
          <div className="asb-empty-state">
            <CalendarX2 size={40} className="asb-empty-icon" />
            <h3 className="asb-empty-title">NO UPCOMING APPOINTMENTS</h3>
            <p className="asb-empty-text">
              There are currently no future appointments scheduled.
            </p>
          </div>
        )}

        {/* Hierarchical Display: YEAR -> MONTH -> DAY -> APPOINTMENT TIME */}
        {!loading && !error && groups.length > 0 && (
          <div className="upcoming-schedule-wrapper">
            {groups.map((yearGroup) => {
              const yearTotal = yearGroup.months.reduce(
                (sum, m) => sum + m.days.reduce((dSum, d) => dSum + d.appointments.length, 0),
                0
              );

              return (
                <div key={yearGroup.year} className="upcoming-year-block">
                  <div className="upcoming-year-heading">
                    <Calendar size={18} className="gold-icon" aria-hidden="true" />
                    <span>{yearGroup.year}</span>
                    <span className="upcoming-year-badge">
                      {yearTotal} {yearTotal === 1 ? 'Booking' : 'Bookings'}
                    </span>
                  </div>

                  {yearGroup.months.map((monthGroup) => {
                    const monthTotal = monthGroup.days.reduce(
                      (dSum, d) => dSum + d.appointments.length,
                      0
                    );

                    return (
                      <div key={`${yearGroup.year}-${monthGroup.monthIndex}`} className="upcoming-month-block">
                        {/* Month Header */}
                        <div className="upcoming-month-header">
                          <div className="upcoming-month-title">
                            <CalendarDays size={16} className="gold-icon" aria-hidden="true" />
                            <span>{monthGroup.monthYearLabel}</span>
                          </div>
                          <span className="upcoming-month-count-badge">
                            {monthTotal} {monthTotal === 1 ? 'Session' : 'Sessions'}
                          </span>
                        </div>

                        {/* Days inside Month */}
                        {monthGroup.days.map((dayGroup) => (
                          <div key={dayGroup.date} className="upcoming-day-block">
                            <div className="upcoming-day-header">
                              <div className="upcoming-day-info">
                                <span className="upcoming-day-pill">{dayGroup.dayLabel}</span>
                                <span className="upcoming-day-weekday">{dayGroup.dayOfWeek}</span>
                              </div>
                              <span className="upcoming-day-count">
                                {dayGroup.appointments.length} {dayGroup.appointments.length === 1 ? 'Session' : 'Sessions'}
                              </span>
                            </div>

                            {/* Appointments on this day (Sorted by Time: earliest first) */}
                            <div className="upcoming-day-appointments">
                              {dayGroup.appointments.map((appt, idx) => {
                                const cleanPhone = String(appt.customerPhone || '').replace(/\D/g, '');
                                const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                  `Hello ${appt.customerName}, this is MDP TATTOOS regarding your upcoming appointment on ${appt.fullDateLabel} (${appt.startFormatted} – ${appt.endFormatted}).`
                                )};`;

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
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
