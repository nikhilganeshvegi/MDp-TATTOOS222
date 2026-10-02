import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ── Shared UI components ───────────────────────────────────────────────────
import { ScrollToTop }          from './components/ScrollToTop.jsx';
import { Navbar }               from './components/Navbar.jsx';
import { FooterSection }        from './components/FooterSection.jsx';

// ── Dedicated Pages ────────────────────────────────────────────────────────
import { HomePage }             from './pages/HomePage.jsx';
import { AboutPage }            from './pages/AboutPage.jsx';
import { TattooStylesPage }     from './pages/TattooStylesPage.jsx';
import { ServicesPage }         from './pages/ServicesPage.jsx';
import { ContactPage }          from './pages/ContactPage.jsx';
import { BookingPage }          from './pages/BookingPage.jsx';

// ── Admin Pages & Guard ────────────────────────────────────────────────────
import { AdminAuthProvider }    from './context/AdminAuthContext.jsx';
import { AdminLoginPage }       from './pages/admin/AdminLoginPage.jsx';
import { AdminDashboardPage }   from './pages/admin/AdminDashboardPage.jsx';
import { AdminProtectedRoute }  from './components/admin/AdminProtectedRoute.jsx';

// ── Existing Booking Modals (Unchanged) ────────────────────────────────────
import { BookingConfirmModal } from './components/BookingConfirmModal.jsx';
import { BookingConfirmationModal } from './components/BookingConfirmationModal.jsx';

// ── API + constants (Unchanged) ───────────────────────────────────────────
import {
  fetchTattooTypes,
  fetchAvailableSlots,
  bookAppointment,
  checkServerHealth,
} from './api/appointmentApi.js';
import { TATTOO_CATALOG } from './constants/tattooCatalog.js';

import './App.css';
import './premium.css';
import './admin.css';

export default function App() {
  // ── 1. Customer form state ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    customerName: '',
    customerAge: '',
    customerGender: '',
    customerPhone: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // ── 2. Date state ───────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState('');
  const [dateError,    setDateError]    = useState(null);

  // ── 3. Tattoo catalog & selection ───────────────────────────────────────
  const [catalog,       setCatalog]       = useState(TATTOO_CATALOG);
  const [selectedTattoo, setSelectedTattoo] = useState(null);

  // ── 4. Slot state ───────────────────────────────────────────────────────
  const [slots,        setSlots]        = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError,   setSlotsError]   = useState(null);

  // ── 5. Confirmation step & submission state ──────────────────────────────
  const [showConfirmModal,    setShowConfirmModal]    = useState(false);
  const [pendingBookingData,  setPendingBookingData]  = useState(null);
  const [confirmError,        setConfirmError]        = useState(null);
  const [isSubmitting,        setIsSubmitting]        = useState(false);
  const [bookingError,        setBookingError]        = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // ── 6. Server / DB health ────────────────────────────────────────────────
  const [serverStatus, setServerStatus] = useState({ connected: false, checked: false });

  // ── Init: health check + catalog load ───────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const health = await checkServerHealth();
        setServerStatus({
          connected: health.status === 'OK',
          databaseConnected: health.databaseConnected,
          checked: true,
        });
        const backendCatalog = await fetchTattooTypes();
        if (backendCatalog && backendCatalog.length > 0) {
          setCatalog(backendCatalog);
        }
      } catch (err) {
        console.warn('Server check:', err);
        setServerStatus({ connected: false, checked: true });
      }
    };
    init();
  }, []);

  // ── Fetch slots on date / tattoo change ──────────────────────────────────
  useEffect(() => {
    if (!selectedDate || !selectedTattoo || dateError) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);
      try {
        const result = await fetchAvailableSlots(selectedDate, selectedTattoo.name);
        if (mounted) {
          const slotsList = (result && (result.slots || (Array.isArray(result) ? result : []))) || [];
          setSlots(slotsList);
        }
      } catch (err) {
        if (mounted) {
          setSlotsError(err.message || 'Unable to retrieve available slots');
          setSlots([]);
        }
      } finally {
        if (mounted) setLoadingSlots(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [selectedDate, selectedTattoo, dateError]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (dateVal, errorMsg) => {
    setSelectedDate(dateVal);
    setDateError(errorMsg);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Please enter your full name';
    if (!formData.customerAge || isNaN(formData.customerAge)) errors.customerAge = 'Please enter your age';
    if (!formData.customerGender) errors.customerGender = 'Please select your gender';
    if (!formData.customerPhone.trim()) errors.customerPhone = 'Please enter your phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Step A: Customer clicks "Book Appointment" (validates & opens confirmation step without saving)
  const handleInitiateBooking = () => {
    setBookingError(null);
    setConfirmError(null);

    if (!validateForm()) {
      document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!selectedDate || dateError) {
      setBookingError('Please choose a valid weekday appointment date.');
      return;
    }
    if (!selectedTattoo) {
      setBookingError('Please choose a tattoo style.');
      return;
    }
    if (!selectedSlot) {
      setBookingError('Please select an available time slot.');
      return;
    }

    // Capture pending details and open confirmation modal
    setPendingBookingData({
      formData: { ...formData },
      selectedDate,
      selectedTattoo,
      selectedSlot
    });
    setShowConfirmModal(true);
    // CRITICAL: The appointment is NOT saved here. No POST request is made.
  };

  // ── Step B: Customer clicks "Cancel" on confirmation step
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmError(null);
    setPendingBookingData(null);
    // Closes confirmation step, returns to form, nothing saved, WhatsApp not opened
  };

  // ── Step C: Customer clicks "Send Appointment to WhatsApp" (finalizes booking & saves to MongoDB)
  const handleConfirmAndSendToWhatsApp = async () => {
    if (isSubmitting || !pendingBookingData) return;
    setIsSubmitting(true);
    setConfirmError(null);

    try {
      const payload = {
        customerName: pendingBookingData.formData.customerName.trim(),
        customerAge: Number(pendingBookingData.formData.customerAge),
        customerGender: pendingBookingData.formData.customerGender,
        customerPhone: pendingBookingData.formData.customerPhone.trim(),
        appointmentDate: pendingBookingData.selectedDate,
        tattooType: pendingBookingData.selectedTattoo.name,
        durationHours: pendingBookingData.selectedTattoo.durationHours,
        startTime: pendingBookingData.selectedSlot.startTime,
      };

      // 1. Send appointment to backend -> backend validates -> checks conflicts -> saves to MongoDB
      const result = await bookAppointment(payload);

      if (!result || !result.id) {
        throw new Error('Appointment was not created in the database.');
      }

      // 2. Only after MongoDB confirms insert, construct WhatsApp pre-filled message
      const durationText = `${result.durationHours} ${result.durationHours === 1 ? 'Hour' : 'Hours'}`;
      const rawMessage = `New Tattoo Appointment

Customer Name: ${result.customerName}
Age: ${result.customerAge}
Gender: ${result.customerGender}
Phone: ${result.customerPhone}
Tattoo Type: ${result.tattooType}
Date: ${result.appointmentDate}
Start Time: ${result.startTime}
End Time: ${result.endTime}
Duration: ${durationText}`;

      const destinationNumber = '918790950577';
      const whatsappUrl = `https://wa.me/${destinationNumber}?text=${encodeURIComponent(rawMessage)}`;

      // 3. Open WhatsApp click-to-chat
      try {
        const newWin = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!newWin) {
          window.location.href = whatsappUrl;
        }
      } catch (openErr) {
        console.warn('Window open notice:', openErr);
      }

      // 4. Update frontend state to confirmed booking receipt
      setConfirmedAppointment(result);
      setShowConfirmModal(false);

      // Refresh slots in background so the newly booked slot shows up as booked
      try {
        const refreshed = await fetchAvailableSlots(pendingBookingData.selectedDate, pendingBookingData.selectedTattoo.name);
        const slotsList = (refreshed && (refreshed.slots || (Array.isArray(refreshed) ? refreshed : []))) || [];
        setSlots(slotsList);
        setSelectedSlot(null);
      } catch (_) { /* silent */ }

      setPendingBookingData(null);

    } catch (err) {
      console.error('Booking error:', err);
      setConfirmError(
        err.message || 'Failed to save appointment. Please try again.'
      );
      if (err.status === 409) {
        try {
          const refreshed = await fetchAvailableSlots(pendingBookingData.selectedDate, pendingBookingData.selectedTattoo.name);
          const slotsList = (refreshed && (refreshed.slots || (Array.isArray(refreshed) ? refreshed : []))) || [];
          setSlots(slotsList);
          setSelectedSlot(null);
        } catch (_) { /* silent */ }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ customerName: '', customerAge: '', customerGender: '', customerPhone: '' });
    setFormErrors({});
    setSelectedDate('');
    setDateError(null);
    setSelectedTattoo(null);
    setSelectedSlot(null);
    setSlots([]);
    setBookingError(null);
    setConfirmedAppointment(null);
    setShowConfirmModal(false);
    setConfirmError(null);
    setPendingBookingData(null);
  };

  // ── Render with BrowserRouter, AdminAuthProvider & Multi-Page Layout ─────
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ScrollToTop />
        <AppContent
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          dateError={dateError}
          catalog={catalog}
          selectedTattoo={selectedTattoo}
          setSelectedTattoo={setSelectedTattoo}
          slots={slots}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          loadingSlots={loadingSlots}
          slotsError={slotsError}
          isSubmitting={isSubmitting}
          bookingError={bookingError}
          handleInitiateBooking={handleInitiateBooking}
          serverStatus={serverStatus}
          showConfirmModal={showConfirmModal}
          pendingBookingData={pendingBookingData}
          handleConfirmAndSendToWhatsApp={handleConfirmAndSendToWhatsApp}
          handleCancelConfirm={handleCancelConfirm}
          confirmError={confirmError}
          confirmedAppointment={confirmedAppointment}
          setConfirmedAppointment={setConfirmedAppointment}
          handleReset={handleReset}
        />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

function AppContent({
  formData,
  handleInputChange,
  formErrors,
  selectedDate,
  handleDateChange,
  dateError,
  catalog,
  selectedTattoo,
  setSelectedTattoo,
  slots,
  selectedSlot,
  setSelectedSlot,
  loadingSlots,
  slotsError,
  isSubmitting,
  bookingError,
  handleInitiateBooking,
  serverStatus,
  showConfirmModal,
  pendingBookingData,
  handleConfirmAndSendToWhatsApp,
  handleCancelConfirm,
  confirmError,
  confirmedAppointment,
  setConfirmedAppointment,
  handleReset
}) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`site-root ${isAdminRoute ? 'is-admin-mode' : ''}`}>

      {/* Global Navbar — Public pages only */}
      {!isAdminRoute && <Navbar />}

      {/* Multi-Page Routes */}
      <main className={isAdminRoute ? 'admin-main-viewport' : 'main-content-area'}>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/tattoo-styles"
            element={
              <TattooStylesPage
                catalog={catalog}
                onSelectTattoo={setSelectedTattoo}
              />
            }
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/book"
            element={
              <BookingPage
                formData={formData}
                onInputChange={handleInputChange}
                formErrors={formErrors}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                dateError={dateError}
                catalog={catalog}
                selectedTattoo={selectedTattoo}
                onSelectTattoo={setSelectedTattoo}
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                loadingSlots={loadingSlots}
                slotsError={slotsError}
                isSubmitting={isSubmitting}
                bookingError={bookingError}
                onBookSlot={handleInitiateBooking}
                serverStatus={serverStatus}
              />
            }
          />
          {/* Alias /appointment to /book */}
          <Route path="/appointment" element={<Navigate to="/book" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer — Public pages only */}
      {!isAdminRoute && <FooterSection />}

      {/* Step 4b — Confirmation step modal ("Do you really want to book this appointment?") */}
      {showConfirmModal && pendingBookingData && (
        <BookingConfirmModal
          isOpen={showConfirmModal}
          appointmentData={pendingBookingData}
          onConfirm={handleConfirmAndSendToWhatsApp}
          onCancel={handleCancelConfirm}
          isSubmitting={isSubmitting}
          error={confirmError}
        />
      )}

      {/* Booking confirmation receipt modal (after successful MongoDB save & WhatsApp open) */}
      {confirmedAppointment && (
        <BookingConfirmationModal
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
          onReset={handleReset}
        />
      )}

    </div>
  );
}
