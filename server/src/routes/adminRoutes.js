import express from 'express';
import {
  adminLogin,
  adminVerify,
  requireAdminAuth,
  getAdminBookingStatus,
  updateAdminBookingStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/verify', adminVerify);

// Admin Booking Availability Management (Protected)
router.get('/booking-status', requireAdminAuth, getAdminBookingStatus);
router.post('/booking-status', requireAdminAuth, updateAdminBookingStatus);

export default router;
