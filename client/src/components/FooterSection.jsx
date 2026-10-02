import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, ShieldCheck } from 'lucide-react';

export const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-link">
              <div className="footer-brand-badge">
                <span className="footer-monogram">MDP</span>
              </div>
              <span className="footer-brand-title">MDP TATTOOS</span>
            </Link>
            <p className="footer-brand-tagline">
              Bespoke custom tattooing by private appointment.<br />
              A single resident artist. An uncompromising standard.
            </p>
            <div className="footer-pill-row">
              <span className="footer-meta-pill">
                <ShieldCheck size={12} className="gold-icon" /> Sterile Medical Protocol
              </span>
              <span className="footer-meta-pill">
                <Clock size={12} className="gold-icon" /> Open 7 Days
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-col">
            <p className="footer-col-heading">Navigation</p>
            <ul className="footer-nav-list">
              <li><Link to="/" className="footer-nav-link">Home</Link></li>
              <li><Link to="/about" className="footer-nav-link">About Us</Link></li>
              <li><Link to="/tattoo-styles" className="footer-nav-link">Tattoo Styles</Link></li>
              <li><Link to="/services" className="footer-nav-link">Services</Link></li>
              <li><Link to="/contact" className="footer-nav-link">Contact</Link></li>
              <li><Link to="/book" className="footer-nav-link highlight">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Hours & Studio Info */}
          <div className="footer-info-col">
            <p className="footer-col-heading">Operating Hours</p>
            <div className="footer-hours-block">
              <div className="footer-hours-row">
                <span className="f-day">Monday – Sunday</span>
                <span className="f-time">9:00 AM – 9:00 PM</span>
              </div>
              <div className="footer-hours-row">
                <span className="f-day">Studio Availability</span>
                <span className="f-time">Open Every Day</span>
              </div>
            </div>
            <p className="footer-notice-sub">
              Strictly private sessions. No walk-ins permitted.
            </p>
          </div>

          {/* Direct Booking / WhatsApp Action */}
          <div className="footer-booking-col">
            <p className="footer-col-heading">Reserve Session</p>
            <p className="footer-booking-text">
              Real-time available slots for custom and traditional styles are open on our calendar.
            </p>
            <div className="footer-actions">
              <Link to="/book" className="btn-primary-footer">
                <Calendar size={14} />
                <span>Book Appointment</span>
              </Link>
              <a
                href="https://wa.me/918790950577"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-footer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp: +91 8790950577</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} <strong>MDP TATTOOS</strong>. All rights reserved.
          </p>
          <p className="footer-legal">
            Exclusively bespoke body art. All sessions confirmed directly into our booking schedule.
          </p>
        </div>

      </div>
    </footer>
  );
};
