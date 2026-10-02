import React from 'react';
import { CheckCircle, Calendar, Clock, User, Phone, Sparkles, X } from 'lucide-react';

export const BookingConfirmationModal = ({ appointment, onClose, onReset }) => {
  if (!appointment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="success-badge-circle">
            <CheckCircle size={36} className="success-icon" />
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2 className="confirmation-title">Appointment Confirmed!</h2>
          <p className="confirmation-subtitle">
            Your tattoo session has been reserved in the studio schedule.
          </p>

          <div className="appointment-receipt-card">
            <div className="receipt-row">
              <span className="receipt-label">Booking Reference:</span>
              <span className="receipt-value mono">{appointment.id}</span>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-grid">
              <div className="receipt-item">
                <Calendar size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Date</span>
                  <p className="receipt-maintext">{appointment.appointmentDate}</p>
                </div>
              </div>

              <div className="receipt-item">
                <Clock size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Time Window</span>
                  <p className="receipt-maintext">
                    {appointment.startFormatted} – {appointment.endFormatted}
                  </p>
                </div>
              </div>

              <div className="receipt-item">
                <Sparkles size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Tattoo Design</span>
                  <p className="receipt-maintext">{appointment.tattooType}</p>
                  <span className="receipt-detail">({appointment.durationHours} Hours Session)</span>
                </div>
              </div>

              <div className="receipt-item">
                <User size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Client</span>
                  <p className="receipt-maintext">{appointment.customerName}</p>
                  <span className="receipt-detail">Age: {appointment.customerAge} • {appointment.customerGender}</span>
                </div>
              </div>

              <div className="receipt-item full-width">
                <Phone size={16} className="gold-icon" />
                <div>
                  <span className="receipt-sublabel">Contact Phone</span>
                  <p className="receipt-maintext">{appointment.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer-notice">
            <p>
              Your appointment is confirmed in the database! Please ensure you send the pre-filled message on WhatsApp to finalize with the artist.
            </p>
          </div>
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/918790950577?text=${encodeURIComponent(
              `New Tattoo Appointment\n\nCustomer Name: ${appointment.customerName}\nAge: ${appointment.customerAge}\nGender: ${appointment.customerGender}\nPhone: ${appointment.customerPhone}\nTattoo Type: ${appointment.tattooType}\nDate: ${appointment.appointmentDate}\nStart Time: ${appointment.startTime}\nEnd Time: ${appointment.endTime}\nDuration: ${appointment.durationHours} ${appointment.durationHours === 1 ? 'Hour' : 'Hours'}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-chat"
            style={{
              background: '#25D366',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Open WhatsApp Again
          </a>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close Receipt
          </button>
          <button type="button" className="btn-primary" onClick={onReset}>
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
