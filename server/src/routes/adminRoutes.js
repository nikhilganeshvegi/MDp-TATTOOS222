import express from 'express';
import {
  adminLogin,
  adminVerify,
  requireAdminAuth,
  getAdminBookingStatus,
  updateAdminBookingStatus,
  getAdminTodayAppointments,
  getAdminUpcomingAppointments
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/verify', adminVerify);

// Admin Booking Availability Management (Protected)
router.get('/booking-status', requireAdminAuth, getAdminBookingStatus);
router.post('/booking-status', requireAdminAuth, updateAdminBookingStatus);

// Admin Today's Appointments (Protected)
router.get('/appointments/today', requireAdminAuth, getAdminTodayAppointments);

// Admin Upcoming Appointments (Protected)
router.get('/appointments/upcoming', requireAdminAuth, getAdminUpcomingAppointments);

export default router;
