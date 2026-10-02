import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { Clock, Calendar, Sparkles, Info } from 'lucide-react';

export const AdminUpcomingAppointmentsPage = () => {
  return (
    <AdminLayout activeTitle="Upcoming Appointments">
      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-page-kicker">SCHEDULE MANAGEMENT</span>
          <h1 className="admin-page-heading">Upcoming Appointments</h1>
          <p className="admin-page-sub">
            Advance bookings, multi-hour craft sessions, and scheduled client intakes across all weekday dates.
          </p>
        </div>
      </div>

      {/* Scope Notice */}
      <div className="admin-notice-strip">
        <Info size={16} className="gold-icon" aria-hidden="true" />
        <span>
          <strong>Dedicated Page Prepared:</strong> This page is structured to host future appointments.
          Advance date filtering, duration sorting, and calendar integrations will be enabled in upcoming releases.
        </span>
      </div>

      {/* Stat Strip */}
      <div className="admin-stats-summary-grid">
        <div className="admin-stat-summary-card">
          <span className="assc-label">Calendar Days</span>
          <span className="assc-value">Monday – Friday</span>
          <span className="assc-sub">Closed Weekends</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Craft Catalog</span>
          <span className="assc-value">20 Styles</span>
          <span className="assc-sub">1h, 2h, and 3h Sessions</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Advance Booking</span>
          <span className="assc-value text-gold">Real-Time</span>
          <span className="assc-sub">Live availability engine</span>
        </div>
      </div>

      {/* Main Appointment Listing Shell (Visually Prepared) */}
      <div className="admin-section-block">
        <div className="asb-header">
          <h2 className="asb-title">Upcoming Bookings Schedule</h2>
          <span className="asb-badge">Future Sessions</span>
        </div>

        <div className="asb-empty-state">
          <Clock size={36} className="asb-empty-icon" aria-hidden="true" />
          <h3 className="asb-empty-title">Upcoming Schedule Ready</h3>
          <p className="asb-empty-text">
            Upcoming client appointments sorted by date and session duration will appear in this view.
            Live multi-day schedule queries are scheduled for the next task.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
