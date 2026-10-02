import React from 'react';
import { Calendar, AlertCircle, Info } from 'lucide-react';

export const DatePicker = ({ selectedDate, onDateChange, error }) => {
  // Format today's date as YYYY-MM-DD for min attribute
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const minDate = `${year}-${month}-${day}`;

  // Helper to test if a date string is Saturday or Sunday
  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0=Sun, 6=Sat
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (isWeekend(val)) {
      onDateChange(val, 'Saturdays and Sundays are holidays. The studio is open Monday to Friday.');
      return;
    }
    onDateChange(val, null);
  };

  // Generate shortcut buttons for upcoming weekdays
  const getUpcomingWeekdays = (count = 5) => {
    const dates = [];
    let current = new Date();
    // Start from today or tomorrow
    let checked = 0;
    while (dates.length < count && checked < 14) {
      const d = new Date(current);
      d.setDate(d.getDate() + checked);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dt = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${dt}`;
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        dates.push({ dateStr, dayLabel });
      }
      checked++;
    }
    return dates;
  };

  const quickDates = getUpcomingWeekdays(5);

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="step-badge">2</span>
        <div>
          <h3 className="section-title">Select Appointment Date</h3>
          <p className="section-subtitle">
            Studio is open <strong>Monday to Friday</strong> (Saturday & Sunday are closed)
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
          <span className="quick-label">Upcoming Weekdays:</span>
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
          <span>Working hours: 9:00 AM – 9:00 PM | Artist break: 12:00 PM – 1:00 PM</span>
        </div>
      )}
    </div>
  );
};
