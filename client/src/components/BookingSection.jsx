import React from 'react';
import { CustomerForm } from './CustomerForm.jsx';
import { DatePicker } from './DatePicker.jsx';
import { TattooSelector } from './TattooSelector.jsx';
import { SlotPicker } from './SlotPicker.jsx';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';

export const BookingSection = ({
  // Customer form
  formData,
  onInputChange,
  formErrors,
  // Date
  selectedDate,
  onDateChange,
  dateError,
  // Tattoo
  catalog,
  selectedTattoo,
  onSelectTattoo,
  // Slots
  slots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  slotsError,
  // Booking
  isSubmitting,
  bookingError,
  onBookSlot,
  // DB warning
  serverStatus,
}) => {
  return (
    <section id="appointment" className="booking-section">
      <div className="section-container">

        <div className="booking-section-header">
          <p className="section-label">Reserve Your Session</p>
          <h2 className="section-heading">Book an Appointment</h2>
          <p className="booking-section-intro">
            Availability is calculated in real time based on confirmed bookings.
            Select your date and style, then choose an open slot. All sessions are
            Monday to Friday, 9 AM – 9 PM.
          </p>
        </div>

        {/* DB connectivity warning */}
        {serverStatus?.checked && !serverStatus?.databaseConnected && (
          <div className="booking-db-notice">
            <AlertCircle size={16} />
            <span>
              Booking system is starting up. If slots don't load, the server may still be
              initialising — please refresh in a moment.
            </span>
          </div>
        )}

        {/* Booking steps */}
        <div className="booking-steps-wrapper">
          <CustomerForm
            formData={formData}
            onChange={onInputChange}
            errors={formErrors}
          />

          <DatePicker
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            error={dateError}
          />

          <TattooSelector
            selectedTattoo={selectedTattoo}
            onSelectTattoo={onSelectTattoo}
            catalog={catalog}
          />

          <SlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={onSelectSlot}
            loading={loadingSlots}
            dateSelected={Boolean(selectedDate && !dateError)}
            tattooSelected={Boolean(selectedTattoo)}
            error={slotsError}
          />

          {/* Booking error */}
          {bookingError && (
            <div className="booking-error-row">
              <AlertCircle size={18} />
              <div>
                <strong>Booking Alert</strong>
                <p>{bookingError}</p>
              </div>
            </div>
          )}

          {/* Submit bar */}
          <div className="booking-submit-bar">
            <div className="submit-bar-summary">
              {selectedTattoo && selectedDate && selectedSlot ? (
                <p>
                  <span className="summary-ready">Ready to confirm: </span>
                  <strong>{selectedTattoo.name}</strong> · {selectedDate} ·{' '}
                  {selectedSlot.startFormatted} – {selectedSlot.endFormatted}
                </p>
              ) : (
                <p className="summary-incomplete">
                  Complete all steps above to unlock booking.
                </p>
              )}
            </div>

            <button
              type="button"
              className="btn-confirm-booking"
              disabled={
                !formData.customerName ||
                !formData.customerPhone ||
                !selectedDate ||
                Boolean(dateError) ||
                !selectedTattoo ||
                !selectedSlot ||
                isSubmitting
              }
              onClick={onBookSlot}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="spinner-icon" />
                  Verifying &amp; Booking…
                </>
              ) : (
                <>
                  <Check size={16} />
                  Book Appointment
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
