import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TATTOO_CATALOG } from '../constants/tattooCatalog.js';
import { Clock, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';

const DURATION_GROUPS = [
  {
    duration: 1,
    title: '01 — Quick Precision Sessions',
    timeLabel: '1 Hour',
    desc: 'Refined, high-precision single needle and minimalist work. Ideal for delicate placements, script, symbols, and geometric accents.',
    badge: '1 HOUR'
  },
  {
    duration: 2,
    title: '02 — Mid-Length Creative Sessions',
    timeLabel: '2 Hours',
    desc: 'The sweet spot for detailed artistic styles: dotwork mandalas, traditional bold lines, neotraditional motifs, and complex blackwork.',
    badge: '2 HOURS'
  },
  {
    duration: 3,
    title: '03 — Extended Deep Work Sessions',
    timeLabel: '3 Hours',
    desc: 'Dedicated to intensive compositions requiring maximum technical depth — realism, realistic portraits, full Japanese irezumi elements, and cover-ups.',
    badge: '3 HOURS'
  }
];

export const TattooStylesPage = ({ catalog = TATTOO_CATALOG, onSelectTattoo }) => {
  const [selectedDuration, setSelectedDuration] = useState('ALL');

  const filteredStyles = catalog.filter(item => {
    if (selectedDuration === 'ALL') return true;
    return item.durationHours === Number(selectedDuration);
  });

  return (
    <div className="page-root styles-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-container">
          <p className="page-eyebrow">MDP TATTOOS · SPECIALISATIONS</p>
          <h1 className="page-title">
            Tattoo Styles &amp;<br />
            <span className="gold-text">Craft Disciplines.</span>
          </h1>
          <p className="page-lead">
            Twenty distinct tattoo styles across 1-hour, 2-hour, and 3-hour sessions.
            Every style carries its own technical mastery, needle configuration, and healing profile.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Content */}
      <section className="styles-catalog-section">
        <div className="section-container">

          {/* Filter Bar */}
          <div className="styles-filter-bar">
            <span className="filter-label">Filter by Duration:</span>
            <div className="filter-btn-group">
              <button
                type="button"
                className={`filter-pill-btn ${selectedDuration === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedDuration('ALL')}
              >
                All 20 Styles
              </button>
              <button
                type="button"
                className={`filter-pill-btn ${selectedDuration === '1' ? 'active' : ''}`}
                onClick={() => setSelectedDuration('1')}
              >
                1 Hour (5 Styles)
              </button>
              <button
                type="button"
                className={`filter-pill-btn ${selectedDuration === '2' ? 'active' : ''}`}
                onClick={() => setSelectedDuration('2')}
              >
                2 Hours (8 Styles)
              </button>
              <button
                type="button"
                className={`filter-pill-btn ${selectedDuration === '3' ? 'active' : ''}`}
                onClick={() => setSelectedDuration('3')}
              >
                3 Hours (7 Styles)
              </button>
            </div>
          </div>

          {/* Duration Overview Cards */}
          <div className="duration-overview-grid">
            {DURATION_GROUPS.map((group) => {
              const count = catalog.filter(s => s.durationHours === group.duration).length;
              const isCurrent = selectedDuration === String(group.duration);
              return (
                <div
                  key={group.duration}
                  className={`duration-overview-card ${isCurrent ? 'selected-tier' : ''}`}
                  onClick={() => setSelectedDuration(isCurrent ? 'ALL' : String(group.duration))}
                >
                  <div className="doc-top">
                    <span className="doc-time">{group.timeLabel}</span>
                    <span className="doc-count">{count} Styles</span>
                  </div>
                  <h3 className="doc-title">{group.title}</h3>
                  <p className="doc-desc">{group.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Catalog Cards Grid */}
          <div className="catalog-grid">
            {filteredStyles.map((item, index) => (
              <div key={item.id} className="catalog-item-card">
                <div className="cic-top">
                  <span className="cic-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`duration-badge dur-${item.durationHours}`}>
                    <Clock size={12} />
                    <span>{item.durationHours} {item.durationHours === 1 ? 'Hour' : 'Hours'}</span>
                  </span>
                </div>

                <div className="cic-category">{item.category}</div>
                <h3 className="cic-name">{item.name}</h3>
                <p className="cic-desc">{item.desc || 'Custom tattoo craftsmanship crafted exclusively for your session.'}</p>

                <div className="cic-footer">
                  <Link
                    to="/book"
                    className="cic-book-link"
                    onClick={() => {
                      if (onSelectTattoo) onSelectTattoo(item);
                    }}
                  >
                    <span>Book This Style</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="styles-bottom-cta">
            <div className="sbc-inner">
              <Sparkles size={20} className="gold-icon" />
              <div>
                <h3>Ready to reserve your chosen style?</h3>
                <p>Appointments are live on our real-time calendar with zero double bookings.</p>
              </div>
              <Link to="/book" className="btn-primary-hero">
                <Calendar size={15} />
                <span>GO TO BOOKING</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
