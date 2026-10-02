import express from 'express';
import {
  getTattooTypes,
  getSlots,
  createAppointment,
  getAppointmentById,
  getAllAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

// Tattoo types catalog
router.get('/tattoo-types', getTattooTypes);

// Available slots calculation
router.get('/slots', getSlots);

// Appointments booking and management
router.post('/appointments', createAppointment);
router.get('/appointments', getAllAppointments);
router.get('/appointments/:id', getAppointmentById);

export default router;
