import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Phone, MessageSquare, Clock, MapPin, ShieldCheck, Mail } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="page-root contact-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-container">
          <p className="page-eyebrow">MDP TATTOOS · CONNECT</p>
          <h1 className="page-title">
            Contact &amp;<br />
            <span className="gold-text">Studio Details.</span>
          </h1>
          <p className="page-lead">
            Direct communication with the artist. All bookings are managed through our
            live calendar and confirmed on WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="contact-details-section">
        <div className="section-container">
          <div className="contact-grid-wrap">

            {/* Direct Contact Cards */}
            <div className="contact-cards-col">

              {/* WhatsApp & Phone */}
              <div className="contact-info-card">
                <div className="cic-header">
                  <div className="cic-icon-box">
                    <MessageSquare size={20} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="cic-card-title">WhatsApp &amp; Direct Phone</h3>
                    <p className="cic-card-sub">Fastest response for appointments &amp; inquiries</p>
                  </div>
                </div>
                <div className="cic-card-body">
                  <a
                    href="https://wa.me/918790950577"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-action-link"
                  >
                    <span>+91 8790950577</span>
                    <span className="link-tag">Open WhatsApp Chat →</span>
                  </a>
                </div>
              </div>

              {/* Operational Hours */}
              <div className="contact-info-card">
                <div className="cic-header">
                  <div className="cic-icon-box">
                    <Clock size={20} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="cic-card-title">Operating Schedule</h3>
                    <p className="cic-card-sub">Hourly sessions strictly by confirmed booking</p>
                  </div>
                </div>
                <div className="cic-card-body">
                  <div className="hours-table">
                    <div className="hours-row">
                      <span className="hr-day">Monday – Sunday</span>
                      <span className="hr-val">9:00 AM – 9:00 PM</span>
                    </div>
                    <div className="hours-row highlight-row">
                      <span className="hr-day">Appointment Availability</span>
                      <span className="hr-val">Open 7 Days (Continuous Sessions)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio Policy */}
              <div className="contact-info-card">
                <div className="cic-header">
                  <div className="cic-icon-box">
                    <ShieldCheck size={20} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="cic-card-title">Studio Policies</h3>
                    <p className="cic-card-sub">Preserving a quiet, clinical creative environment</p>
                  </div>
                </div>
                <div className="cic-card-body">
                  <ul className="policy-list">
                    <li><strong>No Walk-Ins Permitted:</strong> Every appointment is scheduled in advance to preserve undivided focus.</li>
                    <li><strong>Consultation Included:</strong> Every session includes sizing and placement alignment before tattooing begins.</li>
                    <li><strong>One Client at a Time:</strong> No guests in the technical tattooing area to maintain sterile field integrity.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Right Side: Appointment Reservation Prompt */}
            <div className="contact-action-col">
              <div className="contact-reserve-box">
                <div className="crb-top">
                  <span className="crb-badge">OFFICIAL BOOKING</span>
                  <h3>Online Calendar Reservation</h3>
                  <p>
                    You don't need to wait for business hours to lock in your date.
                    Our live appointment engine allows you to browse confirmed availability
                    and instantly secure a slot.
                  </p>
                </div>

                <div className="crb-features">
                  <div className="crb-feature-item">
                    <span className="bullet">◆</span>
                    <span>Direct MongoDB database confirmation</span>
                  </div>
                  <div className="crb-feature-item">
                    <span className="bullet">◆</span>
                    <span>Guaranteed single-booking per slot</span>
                  </div>
                  <div className="crb-feature-item">
                    <span className="bullet">◆</span>
                    <span>Automatic WhatsApp dispatch to artist</span>
                  </div>
                </div>

                <Link to="/book" className="btn-primary-hero btn-full">
                  <Calendar size={16} />
                  <span>BOOK AN APPOINTMENT</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
