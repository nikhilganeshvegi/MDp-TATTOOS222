import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Check, Sparkles, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="page-root about-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="section-container">
          <p className="page-eyebrow">ABOUT MDP TATTOOS</p>
          <h1 className="page-title">
            A Single Artist.<br />
            <span className="gold-text">An Uncompromising Standard.</span>
          </h1>
          <p className="page-lead">
            MDP TATTOOS is a private tattooing practice built on the conviction that body art
            demands undivided technical mastery, anatomical consideration, and sterile precision.
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="about-narrative-section">
        <div className="section-container">
          <div className="about-grid-layout">

            {/* Left Narrative Column */}
            <div className="about-narrative-col">
              <h2 className="content-heading">Craft Over Volume</h2>
              <div className="about-paragraphs">
                <p>
                  This is not a high-volume street shop or a commercial assembly line. MDP TATTOOS
                  was established to offer clients an intimate, bespoke experience where your concept
                  receives 100% of the artist's focus.
                </p>
                <p>
                  Every piece begins with a detailed design conversation. Your chosen placement, skin tone,
                  natural body contours, and lifestyle are meticulously evaluated before pigment ever meets
                  the skin. The resulting work is tailored to heal cleanly, age gracefully, and stand the test of time.
                </p>
                <p>
                  Safety, hygiene, and client comfort are absolute priorities. We operate under rigorous
                  clinical protocols with single-use sterile cartridges, medical barrier systems, and
                  hospital-grade sterilization. You will never be rushed, and you will never share your artist's attention.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="about-key-pillars">
                <div className="key-pillar-item">
                  <div className="kpi-icon">
                    <Sparkles size={18} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="kpi-title">Consultation First</h3>
                    <p className="kpi-desc">Every booking begins with design alignment and technical sizing before any ink is placed.</p>
                  </div>
                </div>

                <div className="key-pillar-item">
                  <div className="kpi-icon">
                    <ShieldCheck size={18} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="kpi-title">Sterile Clinical Standard</h3>
                    <p className="kpi-desc">Single-use needles, autoclaved work surfaces, and hospital-grade hygiene at all times.</p>
                  </div>
                </div>

                <div className="key-pillar-item">
                  <div className="kpi-icon">
                    <Award size={18} className="gold-icon" />
                  </div>
                  <div>
                    <h3 className="kpi-title">Patience &amp; Precision</h3>
                    <p className="kpi-desc">We never rush lines to beat a clock. A piece is complete only when the standard is met.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual / Stats Column */}
            <div className="about-aside-col">
              <div className="about-quote-card">
                <div className="aq-mark">“</div>
                <p className="aq-text">
                  A tattoo is forever. The integrity and craftsmanship behind it must match that permanence.
                </p>
                <p className="aq-author">— MDP TATTOOS</p>
              </div>

              <div className="about-stats-card">
                <div className="stat-card-row">
                  <div className="stat-box">
                    <span className="sb-num">20</span>
                    <span className="sb-label">Specialised Styles</span>
                  </div>
                  <div className="stat-box">
                    <span className="sb-num">100%</span>
                    <span className="sb-label">Private Sessions</span>
                  </div>
                </div>
                <div className="stat-card-row">
                  <div className="stat-box">
                    <span className="sb-num">Mon–Sun</span>
                    <span className="sb-label">Open 7 Days</span>
                  </div>
                  <div className="stat-box">
                    <span className="sb-num">9 AM–9 PM</span>
                    <span className="sb-label">Studio Hours</span>
                  </div>
                </div>
              </div>

              <div className="about-booking-prompt">
                <h4>Ready to Discuss Your Piece?</h4>
                <p>Browse our real-time availability calendar and book directly.</p>
                <Link to="/book" className="btn-primary-hero">
                  <Calendar size={15} />
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
