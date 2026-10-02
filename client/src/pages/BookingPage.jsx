import React from 'react';
import { BookingSection } from '../components/BookingSection.jsx';
import { ShieldCheck, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const BookingPage = ({
  formData,
  onInputChange,
  formErrors,
  selectedDate,
  onDateChange,
  dateError,
  catalog,
  selectedTattoo,
  onSelectTattoo,
  slots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  slotsError,
  isSubmitting,
  bookingError,
  onBookSlot,
  serverStatus,
  isBookingEnabled = true,
}) => {
  return (
    <div className="page-root booking-page">
      {/* Page Header */}
      <section className="page-hero booking-page-hero">
        <div className="section-container">
          <p className="page-eyebrow">MDP TATTOOS · APPOINTMENT RESERVATIONS</p>
          <h1 className="page-title">
            Reserve Your<br />
            <span className="gold-text">Private Session.</span>
          </h1>
          <p className="page-lead">
            Select your preferred style and date to calculate live hourly availability.
            Once selected, clicking Book Appointment presents your session summary to send directly to the artist's WhatsApp.
          </p>

          <div className="booking-info-pills">
            <div className="bip-item">
              <Clock size={14} className="gold-icon" />
              <span>Mon–Sun (9:00 AM – 9:00 PM)</span>
            </div>
            <div className="bip-item">
              <ShieldCheck size={14} className="gold-icon" />
              <span>Strict 1-on-1 Private Sessions</span>
            </div>
            <div className="bip-item">
              <CheckCircle2 size={14} className="gold-icon" />
              <span>No Double Bookings Allowed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Booking System (Unchanged functionality) */}
      <div className="booking-page-body">
        <BookingSection
          formData={formData}
          onInputChange={onInputChange}
          formErrors={formErrors}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          dateError={dateError}
          catalog={catalog}
          selectedTattoo={selectedTattoo}
          onSelectTattoo={onSelectTattoo}
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          loadingSlots={loadingSlots}
          slotsError={slotsError}
          isSubmitting={isSubmitting}
          bookingError={bookingError}
          onBookSlot={onBookSlot}
          serverStatus={serverStatus}
          isBookingEnabled={isBookingEnabled}
        />
      </div>
    </div>
  );
};
