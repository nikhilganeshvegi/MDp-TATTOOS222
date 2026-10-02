import express from 'express';
import {
  getTattooTypes,
  getSlots,
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  getPublicBookingStatus
} from '../controllers/appointmentController.js';

const router = express.Router();

// Public booking intake status
router.get('/booking-status', getPublicBookingStatus);

// Tattoo types catalog
router.get('/tattoo-types', getTattooTypes);

// Available slots calculation
router.get('/slots', getSlots);

// Appointments booking and management
router.post('/appointments', createAppointment);
router.get('/appointments', getAllAppointments);
router.get('/appointments/:id', getAppointmentById);

export default router;
