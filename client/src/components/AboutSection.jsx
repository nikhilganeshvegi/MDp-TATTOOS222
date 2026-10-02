import React from 'react';

export const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="section-container">

        {/* Left — Text column */}
        <div className="about-text-col">
          <p className="section-label">About the Studio</p>
          <h2 className="section-heading">
            A Single Artist.<br />A Single Standard.
          </h2>

          <div className="about-body-text">
            <p>
              This is not a high-volume commercial studio. It is a private practice built
              around the belief that every tattoo deserves the full, undivided attention of
              its artist. One client at a time. One session at a time.
            </p>
            <p>
              Each piece begins with a consultation. Your placement, skin tone, lifestyle, and
              vision are all considered before a single line is drawn. The result is work that
              is designed to age well and feel entirely personal.
            </p>
            <p>
              Hygiene and client safety are non-negotiable. The studio operates under strict
              single-use needle and sterile field protocols. You will never be rushed, and you
              will never share your artist.
            </p>
          </div>

          <div className="about-pillars">
            <div className="pillar">
              <span className="pillar-marker" aria-hidden="true">—</span>
              <div>
                <p className="pillar-title">Consultation First</p>
                <p className="pillar-desc">Every booking begins with a design discussion before any commitment.</p>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-marker" aria-hidden="true">—</span>
              <div>
                <p className="pillar-title">Sterile Environment</p>
                <p className="pillar-desc">Single-use needles, medical-grade surfaces, and clinical hygiene standards.</p>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-marker" aria-hidden="true">—</span>
              <div>
                <p className="pillar-title">No Compromises</p>
                <p className="pillar-desc">Sessions are never rushed. The work is finished when it is correct, not when the clock says so.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Visual column */}
        <div className="about-visual-col" aria-hidden="true">
          <div className="about-visual-block">
            <div className="about-visual-inner">
              <div className="about-quote-mark">"</div>
              <p className="about-quote-text">
                The tattoo is permanent. The approach to making it should be too.
              </p>
            </div>
            <div className="about-visual-corner about-vc-tl" />
            <div className="about-visual-corner about-vc-br" />
          </div>

          <div className="about-stat-row">
            <div className="about-stat">
              <span className="stat-num">20+</span>
              <span className="stat-label">Tattoo Styles</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="stat-num">Mon–Fri</span>
              <span className="stat-label">Operating Days</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="stat-num">1</span>
              <span className="stat-label">Dedicated Artist</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
