import React from 'react';
import { Clock, Ban, CheckCircle2, Coffee, Moon, AlertTriangle, Loader2 } from 'lucide-react';

export const SlotPicker = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  dateSelected,
  tattooSelected,
  error
}) => {
  if (!dateSelected || !tattooSelected) {
    return (
      <div className="section-card slot-picker-placeholder">
        <div className="placeholder-content">
          <Clock size={36} className="placeholder-icon" />
          <h4>Time Slots Locked</h4>
          <p>Please select your appointment date and tattoo style above to view available slots.</p>
        </div>
      </div>
    );
  }

  const getReasonBadge = (reason) => {
    switch (reason) {
      case 'OVERLAPS_BREAK':
        return (
          <span className="slot-badge badge-break">
            <Coffee size={12} /> Lunch Break (12–1 PM)
          </span>
        );
      case 'EXCEEDS_CLOSING_TIME':
        return (
          <span className="slot-badge badge-closing">
            <Moon size={12} /> Past 9:00 PM Closing
          </span>
        );
      case 'ALREADY_BOOKED':
        return (
          <span className="slot-badge badge-booked">
            <Ban size={12} /> Already Booked
          </span>
        );
      case 'PAST_TIME':
        return (
          <span className="slot-badge badge-past">
            <Clock size={12} /> Passed Today
          </span>
        );
      default:
        return (
          <span className="slot-badge badge-unavailable">
            <AlertTriangle size={12} /> Unavailable
          </span>
        );
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="step-badge">4</span>
        <div className="header-flex">
          <div>
            <h3 className="section-title">Select Time Slot</h3>
            <p className="section-subtitle">
              Slots are generated hourly. Unavailable slots are blurred & disabled according to shop rules.
            </p>
          </div>
          {loading && (
            <div className="loading-badge">
              <Loader2 size={16} className="spinner-icon" />
              <span>Checking real-time availability...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="slots-loading-state">
          <Loader2 size={32} className="spinner-icon" />
          <p>Querying artist schedule & verifying bookings...</p>
        </div>
      ) : slots && slots.length > 0 ? (
        <div className="slots-grid">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.startTime === slot.startTime;
            const isAvailable = slot.available;

            return (
              <div
                key={slot.startTime}
                className={`slot-card ${
                  isSelected ? 'slot-selected' : ''
                } ${isAvailable ? 'slot-available' : 'slot-disabled-blurred'}`}
                onClick={() => {
                  if (isAvailable) {
                    onSelectSlot(slot);
                  }
                }}
                role="button"
                tabIndex={isAvailable ? 0 : -1}
                aria-disabled={!isAvailable}
              >
                {/* Slot Status / Indicator */}
                <div className="slot-top-row">
                  <span className="slot-time-range">
                    {slot.startFormatted} – {slot.endFormatted}
                  </span>
                  {isAvailable ? (
                    <span className="available-pill">
                      <CheckCircle2 size={13} /> Available
                    </span>
                  ) : (
                    getReasonBadge(slot.conflictReason)
                  )}
                </div>

                <div className="slot-duration-info">
                  <Clock size={13} />
                  <span>{slot.durationHours} hr session</span>
                </div>

                {/* Unavailable message note */}
                {!isAvailable && (
                  <p className="slot-conflict-note" title={slot.message}>
                    {slot.message}
                  </p>
                )}

                {/* Selected checkbox check */}
                {isSelected && (
                  <div className="slot-selected-mark">
                    <CheckCircle2 size={16} /> Selected Slot
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !error ? (
        <div className="no-slots-box">
          <p>No slots found for this date. The shop may be closed or on holiday.</p>
        </div>
      ) : null}
    </div>
  );
};
