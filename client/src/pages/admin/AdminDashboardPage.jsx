import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import {
  fetchAdminBookingStatus,
  updateAdminBookingStatus
} from '../../api/adminApi.js';
import {
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Power,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [isBookingEnabled, setIsBookingEnabled] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch initial booking status from backend
  const loadStatus = async () => {
    try {
      setErrorMessage(null);
      const res = await fetchAdminBookingStatus();
      if (res && res.isEnabled !== undefined) {
        setIsBookingEnabled(Boolean(res.isEnabled));
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('[Admin Dashboard] Failed to load booking status:', err);
      setErrorMessage(err.message || 'Could not fetch current booking status from server.');
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleToggleBooking = async () => {
    const nextState = !isBookingEnabled;
    setIsUpdating(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const res = await updateAdminBookingStatus(nextState);
      if (res && res.success) {
        setIsBookingEnabled(res.isEnabled);
        setLastUpdated(new Date());
        setActionMessage(
          res.isEnabled
            ? 'Booking intake is now ENABLED across the public website.'
            : 'Booking intake is now DISABLED. Public customer bookings are paused.'
        );
      }
    } catch (err) {
      console.error('[Admin Dashboard] Failed to update booking status:', err);
      setErrorMessage(err.message || 'Failed to update booking status. Previous state preserved.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout activeTitle="Dashboard">
      {/* Welcome Banner */}
      <div className="admin-welcome-card">
        <div className="admin-welcome-text">
          <div className="admin-pill-badge">
            <Sparkles size={12} className="gold-icon" />
            <span>STUDIO OPERATIONS CONTROL</span>
          </div>
          <h1 className="admin-page-heading">Appointment Booking Control</h1>
          <p className="admin-page-sub">
            Real-time master control for public appointment reservations.
            Enabling or disabling bookings here immediately updates the public website and backend API.
          </p>
        </div>
        <div className="admin-welcome-meta">
          <button
            type="button"
            onClick={loadStatus}
            className="admin-refresh-status-btn"
            disabled={loadingStatus || isUpdating}
            title="Refresh status from backend"
          >
            <RefreshCw size={14} className={loadingStatus ? 'admin-spin-icon' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionMessage && (
        <div className="admin-success-banner" role="status">
          <CheckCircle2 size={18} className="admin-success-icon" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="admin-error-banner" role="alert">
          <ShieldAlert size={18} className="admin-error-icon" />
          <div>
            <strong>Operation Failed: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* ── Main Master Booking Status Control Card ── */}
      <section className="admin-control-hero-card" aria-labelledby="booking-control-title">
        <div className="achc-header">
          <div className="achc-title-group">
            <span className="achc-kicker">APPOINTMENT BOOKING</span>
            <h2 id="booking-control-title" className="achc-headline">Public Intake Status</h2>
          </div>
          <div className="achc-live-badge-wrap">
            {loadingStatus ? (
              <span className="achc-status-pill loading">
                <RefreshCw size={12} className="admin-spin-icon" />
                <span>CONNECTING…</span>
              </span>
            ) : isBookingEnabled ? (
              <span className="achc-status-pill enabled">
                <span className="pulse-dot-green" />
                <span>BOOKINGS ENABLED</span>
              </span>
            ) : (
              <span className="achc-status-pill disabled">
                <span className="pulse-dot-red" />
                <span>BOOKINGS DISABLED</span>
              </span>
            )}
          </div>
        </div>

        <div className="achc-body">
          <div className="achc-status-callout">
            {isBookingEnabled ? (
              <p className="achc-status-desc enabled">
                <strong>Customers can currently book appointments.</strong>
                <br />
                The public booking form at <code>/book</code> is open and accepting new customer reservations.
              </p>
            ) : (
              <p className="achc-status-desc disabled">
                <strong>Customers cannot currently book appointments.</strong>
                <br />
                The public booking form displays that appointments are currently closed, and backend submission is strictly rejected.
              </p>
            )}
          </div>

          <div className="achc-action-bar">
            {isBookingEnabled ? (
              <button
                type="button"
                className="btn-admin-action disable"
                onClick={handleToggleBooking}
                disabled={isUpdating || loadingStatus}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw size={16} className="admin-spin-icon" />
                    <span>UPDATING BACKEND…</span>
                  </>
                ) : (
                  <>
                    <Power size={16} />
                    <span>DISABLE BOOKINGS</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="btn-admin-action enable"
                onClick={handleToggleBooking}
                disabled={isUpdating || loadingStatus}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw size={16} className="admin-spin-icon" />
                    <span>UPDATING BACKEND…</span>
                  </>
                ) : (
                  <>
                    <Power size={16} />
                    <span>ENABLE BOOKINGS</span>
                  </>
                )}
              </button>
            )}

            {lastUpdated && (
              <span className="achc-meta-time">
                Persisted: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick Jump to Dedicated Pages ── */}
      <div className="admin-quick-grid">
        <Link to="/admin/today" className="admin-quick-card">
          <div className="aqc-icon-wrap">
            <Calendar size={20} className="gold-icon" />
          </div>
          <div className="aqc-content">
            <h3 className="aqc-title">Today's Appointments</h3>
            <p className="aqc-desc">View dedicated schedule queue for today's studio sessions.</p>
          </div>
          <span className="aqc-arrow">→</span>
        </Link>

        <Link to="/admin/upcoming" className="admin-quick-card">
          <div className="aqc-icon-wrap">
            <Clock size={20} className="gold-icon" />
          </div>
          <div className="aqc-content">
            <h3 className="aqc-title">Upcoming Appointments</h3>
            <p className="aqc-desc">View advance 7-day booking schedule and client appointments.</p>
          </div>
          <span className="aqc-arrow">→</span>
        </Link>
      </div>
    </AdminLayout>
  );
};
