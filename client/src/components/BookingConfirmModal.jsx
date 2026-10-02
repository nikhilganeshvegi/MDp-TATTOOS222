import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const BookingConfirmModal = ({
  isOpen,
  appointmentData,
  onConfirm,
  onCancel,
  isSubmitting,
  error
}) => {
  if (!isOpen || !appointmentData) return null;

  const { formData, selectedDate, selectedTattoo, selectedSlot } = appointmentData;

  const durationText = `${selectedTattoo.durationHours} ${selectedTattoo.durationHours === 1 ? 'Hour' : 'Hours'}`;
  const timeWindowText = `${selectedSlot.startFormatted || selectedSlot.startTime} – ${selectedSlot.endFormatted || selectedSlot.endTime}`;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="modal-container">
        <div className="modal-header">
          <div className="confirm-badge-circle" style={{
            width: '3.25rem',
            height: '3.25rem',
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.35)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HelpCircle size={30} className="gold-icon" />
          </div>
        </div>

        <div className="modal-body">
          <h2 id="confirm-modal-title" className="confirmation-title" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>
            Do you really want to book this appointment?
          </h2>
          <p className="confirmation-subtitle">
            Please verify your session details before confirming.
          </p>

          <div className="appointment-receipt-card">
            <div className="receipt-grid">
              <div className="receipt-item">
                <User size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Client</span>
                  <p className="receipt-maintext">{formData.customerName}</p>
                  <span className="receipt-detail">Age: {formData.customerAge} • {formData.customerGender}</span>
                </div>
              </div>

              <div className="receipt-item">
                <Phone size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Phone Number</span>
                  <p className="receipt-maintext">{formData.customerPhone}</p>
                </div>
              </div>

              <div className="receipt-item">
                <Calendar size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Appointment Date</span>
                  <p className="receipt-maintext">{selectedDate}</p>
                </div>
              </div>

              <div className="receipt-item">
                <Clock size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Time Window</span>
                  <p className="receipt-maintext">{timeWindowText}</p>
                  <span className="receipt-detail">({durationText} Session)</span>
                </div>
              </div>

              <div className="receipt-item full-width">
                <Sparkles size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Tattoo Style</span>
                  <p className="receipt-maintext">{selectedTattoo.name}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert-box alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-footer-notice">
            <p>
              Your appointment will be saved directly into our studio database, and WhatsApp will open with your pre-filled booking details to send to the artist.
            </p>
          </div>
        </div>

        {/* ONLY TWO BUTTONS ARE AVAILABLE */}
        <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-whatsapp-confirm"
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              background: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              opacity: isSubmitting ? 0.75 : 1,
              transition: 'background 0.15s, transform 0.1s'
            }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="spinner-icon" />
                Saving &amp; Opening WhatsApp…
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                Send Appointment to WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
