import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { Calendar, Clock, ShieldCheck, Info } from 'lucide-react';

export const AdminTodayAppointmentsPage = () => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <AdminLayout activeTitle="Today's Appointments">
      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-page-kicker">SCHEDULE MANAGEMENT</span>
          <h1 className="admin-page-heading">Today's Appointments</h1>
          <p className="admin-page-sub">
            Chronological schedule for <strong>{todayFormatted}</strong>.
            Sessions run Monday through Friday from 9:00 AM to 9:00 PM.
          </p>
        </div>
      </div>

      {/* Scope Notice */}
      <div className="admin-notice-strip">
        <Info size={16} className="gold-icon" aria-hidden="true" />
        <span>
          <strong>Dedicated Page Prepared:</strong> This page is structured to host live daily session queues.
          Advanced appointment filtering, customer notes, and completion actions will be added in upcoming tasks.
        </span>
      </div>

      {/* Stat Strip */}
      <div className="admin-stats-summary-grid">
        <div className="admin-stat-summary-card">
          <span className="assc-label">Operating Window</span>
          <span className="assc-value">9:00 AM – 9:00 PM</span>
          <span className="assc-sub">Mon–Fri Weekday Schedule</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Session Format</span>
          <span className="assc-value">1-on-1 Private</span>
          <span className="assc-sub">No overlapping bookings</span>
        </div>
        <div className="admin-stat-summary-card">
          <span className="assc-label">Confirmation Relay</span>
          <span className="assc-value text-gold">WhatsApp Direct</span>
          <span className="assc-sub">+91 87909 50577</span>
        </div>
      </div>

      {/* Main Appointment Listing Shell (Visually Prepared) */}
      <div className="admin-section-block">
        <div className="asb-header">
          <h2 className="asb-title">Daily Session Queue</h2>
          <span className="asb-badge">Today</span>
        </div>

        <div className="asb-empty-state">
          <Calendar size={36} className="asb-empty-icon" aria-hidden="true" />
          <h3 className="asb-empty-title">Today's Appointment Schedule Ready</h3>
          <p className="asb-empty-text">
            Confirmed appointments booked for today will be displayed in this chronological queue.
            Live appointment data filtering is scheduled for the next task.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
