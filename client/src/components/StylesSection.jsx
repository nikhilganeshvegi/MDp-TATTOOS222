import React, { useState } from 'react';
import { TATTOO_CATALOG } from '../constants/tattooCatalog.js';

// Group catalog by duration for editorial display
const DURATION_GROUPS = [
  {
    label: '01 — Quick Sessions',
    duration: 1,
    durationText: '1 Hour',
    desc: 'Refined small-scale work. Ideal for first tattoos, additions to existing pieces, or precise minimalist designs.',
  },
  {
    label: '02 — Mid-Length Sessions',
    duration: 2,
    durationText: '2 Hours',
    desc: 'The range where most artistic and geometric styles live. Enough time for complexity and clean execution.',
  },
  {
    label: '03 — Extended Sessions',
    duration: 3,
    durationText: '3 Hours',
    desc: 'Reserved for work that demands depth — portraits, realism, full cultural pieces, and complex cover-ups.',
  },
];

export const StylesSection = ({ catalog = TATTOO_CATALOG }) => {
  const [activeGroup, setActiveGroup] = useState(null);

  const getStylesByDuration = (dur) => catalog.filter((s) => s.durationHours === dur);

  return (
    <section id="styles" className="styles-section">
      <div className="section-container">

        <div className="styles-header">
          <p className="section-label">Specialisations</p>
          <h2 className="section-heading">Tattoo Styles</h2>
          <p className="styles-intro">
            Twenty distinct styles. Each carries its own demand in terms of technique,
            time, and precision. Select the category below to explore what's available.
          </p>
        </div>

        {/* Duration group tabs */}
        <div className="styles-group-tabs">
          {DURATION_GROUPS.map((group) => (
            <button
              key={group.duration}
              type="button"
              className={`style-group-tab ${activeGroup === group.duration ? 'active' : ''}`}
              onClick={() => setActiveGroup(activeGroup === group.duration ? null : group.duration)}
            >
              <span className="sgt-label">{group.label}</span>
              <span className="sgt-duration">{group.durationText}</span>
            </button>
          ))}
        </div>

        {/* Group content panels */}
        {DURATION_GROUPS.map((group) => {
          const styles = getStylesByDuration(group.duration);
          const isOpen = activeGroup === group.duration;
          return (
            <div
              key={group.duration}
              className={`styles-group-panel ${isOpen ? 'panel-open' : ''}`}
            >
              {isOpen && (
                <>
                  <p className="panel-desc">{group.desc}</p>
                  <div className="styles-list">
                    {styles.map((style, idx) => (
                      <div key={style.id} className="style-list-item">
                        <span className="style-index">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="style-item-body">
                          <span className="style-item-name">{style.name}</span>
                          <span className="style-item-desc">{style.desc}</span>
                        </div>
                        <span className="style-item-duration">{group.durationText}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Show all when nothing selected */}
        {activeGroup === null && (
          <div className="styles-all-grid">
            {DURATION_GROUPS.map((group) => {
              const styles = getStylesByDuration(group.duration);
              return (
                <div key={group.duration} className="styles-overview-col">
                  <div className="styles-overview-header">
                    <span className="soh-label">{group.durationText}</span>
                    <span className="soh-count">{styles.length} styles</span>
                  </div>
                  <ul className="styles-overview-list">
                    {styles.map((s) => (
                      <li key={s.id} className="sol-item">{s.name}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <div className="styles-footer-note">
          <p>
            Duration estimates are standard guidelines. Actual session length may vary based
            on design complexity, placement, and skin characteristics. Discussed at consultation.
          </p>
        </div>

      </div>
    </section>
  );
};
