import React from 'react';
import { Calendar, AlertCircle, Info } from 'lucide-react';

export const DatePicker = ({ selectedDate, onDateChange, error }) => {
  // Format today's date as YYYY-MM-DD in Asia/Kolkata (IST) for min attribute
  const minDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val && val < minDate) {
      onDateChange(val, 'Please select today or a future appointment date.');
      return;
    }
    onDateChange(val, null);
  };

  // Generate shortcut buttons for upcoming days (all 7 days of the week, starting from today)
  const getUpcomingDays = (count = 7) => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(d);
      const dayLabel = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(d);
      dates.push({ dateStr, dayLabel });
    }
    return dates;
  };

  const quickDates = getUpcomingDays(7);

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="step-badge">2</span>
        <div>
          <h3 className="section-title">Select Appointment Date</h3>
          <p className="section-subtitle">
            Studio is open <strong>every day</strong> (Monday to Sunday, 9 AM – 9 PM)
          </p>
        </div>
      </div>

      <div className="date-selection-row">
        <div className="date-input-container">
          <label htmlFor="appointmentDate" className="form-label">
            Appointment Date <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <Calendar className="input-icon" size={18} />
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              className={`form-input date-input ${error ? 'input-error' : ''}`}
              min={minDate}
              value={selectedDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="quick-dates-container">
          <span className="quick-label">Upcoming Days:</span>
          <div className="quick-buttons-row">
            {quickDates.map((item) => (
              <button
                key={item.dateStr}
                type="button"
                className={`quick-date-btn ${selectedDate === item.dateStr ? 'active' : ''}`}
                onClick={() => onDateChange(item.dateStr, null)}
              >
                {item.dayLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="alert-box alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="alert-box alert-info">
          <Info size={16} />
          <span>Working hours: 9:00 AM – 9:00 PM (Monday to Sunday) | Continuous booking slots available</span>
        </div>
      )}
    </div>
  );
};
