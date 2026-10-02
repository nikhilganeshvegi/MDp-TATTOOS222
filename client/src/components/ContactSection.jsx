import React from 'react';

export const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="section-container">

        <div className="contact-header">
          <p className="section-label">Find Us</p>
          <h2 className="section-heading">Contact &amp; Location</h2>
        </div>

        <div className="contact-layout">

          {/* Left — Details */}
          <div className="contact-details-col">

            <div className="contact-block">
              <p className="contact-block-label">Studio Address</p>
              <p className="contact-block-value placeholder-text">
                [Studio address will be listed here]
              </p>
            </div>

            <div className="contact-block">
              <p className="contact-block-label">Phone</p>
              <p className="contact-block-value placeholder-text">
                [Phone number will be listed here]
              </p>
            </div>

            <div className="contact-block">
              <p className="contact-block-label">Instagram</p>
              <p className="contact-block-value placeholder-text">
                [@handle will be listed here]
              </p>
            </div>

            <div className="contact-block">
              <p className="contact-block-label">Studio Hours</p>
              <div className="contact-hours-grid">
                <span className="hours-day">Monday – Sunday</span>
                <span className="hours-time">9:00 AM – 9:00 PM</span>
                <span className="hours-day">Appointments</span>
                <span className="hours-time">Open 7 Days</span>
              </div>
            </div>

            <div className="contact-block">
              <p className="contact-block-label">Appointments</p>
              <p className="contact-block-value">
                All sessions are by appointment only. Use the booking form above
                to reserve your slot in real time.
              </p>
            </div>

          </div>

          {/* Right — Map placeholder */}
          <div className="contact-map-col">
            <div className="contact-map-placeholder" aria-label="Map location placeholder">
              <div className="map-placeholder-inner">
                <div className="map-pin-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <p className="map-placeholder-text">Location map coming soon</p>
                <p className="map-placeholder-sub">Address details will be added here</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
