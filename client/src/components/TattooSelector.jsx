import React, { useState } from 'react';
import { Clock, Check, Sparkles } from 'lucide-react';
import { TATTOO_CATALOG } from '../constants/tattooCatalog.js';

export const TattooSelector = ({ selectedTattoo, onSelectTattoo, catalog = TATTOO_CATALOG }) => {
  const [filterDuration, setFilterDuration] = useState('ALL');

  const filteredItems = catalog.filter((item) => {
    if (filterDuration === 'ALL') return true;
    return item.durationHours === Number(filterDuration);
  });

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="step-badge">3</span>
        <div>
          <h3 className="section-title">Choose Tattoo Style</h3>
          <p className="section-subtitle">
            The session duration is automatically determined based on your selection
          </p>
        </div>
      </div>

      {/* Filter Tabs by Duration */}
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filterDuration === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterDuration('ALL')}
        >
          All Styles ({catalog.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterDuration === '1' ? 'active' : ''}`}
          onClick={() => setFilterDuration('1')}
        >
          1 Hour (Small & Line)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterDuration === '2' ? 'active' : ''}`}
          onClick={() => setFilterDuration('2')}
        >
          2 Hours (Artistic & Geometric)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterDuration === '3' ? 'active' : ''}`}
          onClick={() => setFilterDuration('3')}
        >
          3 Hours (Realism & Large)
        </button>
      </div>

      {/* Tattoo Cards Grid */}
      <div className="tattoo-grid">
        {filteredItems.map((item) => {
          const isSelected = selectedTattoo?.name === item.name;

          return (
            <div
              key={item.id}
              className={`tattoo-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectTattoo(item)}
            >
              <div className="tattoo-card-top">
                <span className="tattoo-category">{item.category}</span>
                <span className={`duration-pill duration-${item.durationHours}h`}>
                  <Clock size={12} />
                  {item.durationHours} {item.durationHours === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>

              <h4 className="tattoo-name">{item.name}</h4>
              <p className="tattoo-desc">{item.desc || 'Custom studio tattoo service'}</p>

              <div className="tattoo-card-footer">
                {isSelected ? (
                  <span className="selected-indicator">
                    <Check size={14} /> Selected
                  </span>
                ) : (
                  <span className="select-prompt">Click to select</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTattoo && (
        <div className="selected-tattoo-summary">
          <Sparkles size={18} className="gold-icon" />
          <span>
            Selected: <strong>{selectedTattoo.name}</strong> • Estimated Session Duration:{' '}
            <strong>{selectedTattoo.durationHours} {selectedTattoo.durationHours === 1 ? 'Hour' : 'Hours'}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
