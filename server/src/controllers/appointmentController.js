import { TATTOO_CATALOG, getTattooByName } from '../constants/tattooCatalog.js';
import { Appointment } from '../models/Appointment.js';
import {
  checkSlotAvailability,
  getAvailableSlotsForDate
} from '../services/slotService.js';
import {
  addHoursToTime,
  formatDisplayTime,
  isWeekend,
  parseLocalDate
} from '../utils/timeUtils.js';

/**
 * GET /api/tattoo-types
 * Returns full tattoo catalog with estimated durations
 */
// Mutex lock to serialize critical availability checks and insertions against race conditions
let bookingMutex = Promise.resolve();

const executeWithBookingLock = (fn) => {
  return new Promise((resolve, reject) => {
    bookingMutex = bookingMutex
      .then(() => fn().then(resolve).catch(reject))
      .catch(() => fn().then(resolve).catch(reject));
  });
};

/**
 * GET /api/tattoo-types
 * Returns full tattoo catalog with estimated durations
 */
export const getTattooTypes = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: TATTOO_CATALOG
    });
  } catch (error) {
    console.error('Error fetching tattoo types:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch tattoo types'
    });
  }
};

/**
 * GET /api/slots?date=YYYY-MM-DD&tattooType=...
 * Calculates available slots for a given date and tattoo type
 */
export const getSlots = async (req, res) => {
  try {
    const { date, tattooType, duration } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "date" (YYYY-MM-DD) is required.',
        message: 'Query parameter "date" (YYYY-MM-DD) is required.'
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Expected YYYY-MM-DD.',
        message: 'Invalid date format. Expected YYYY-MM-DD.'
      });
    }

    const parsedDate = parseLocalDate(date);
    if (!parsedDate) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date. Expected a valid calendar date in YYYY-MM-DD format.',
        message: 'Invalid date. Expected a valid calendar date in YYYY-MM-DD format.'
      });
    }

    if (isWeekend(date)) {
      return res.status(400).json({
        success: false,
        error: 'The studio is closed on Saturdays and Sundays. Please select a weekday (Monday to Friday).',
        message: 'The studio is closed on Saturdays and Sundays. Please select a weekday (Monday to Friday).'
      });
    }

    // Determine duration and validate tattooType
    let durationHours = 1;
    let matchedTattoo = null;

    if (!tattooType && !duration) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "tattooType" is required.',
        message: 'Query parameter "tattooType" is required.'
      });
    }

    if (tattooType) {
      matchedTattoo = getTattooByName(tattooType);
      if (!matchedTattoo) {
        return res.status(400).json({
          success: false,
          error: `Invalid tattoo type: "${tattooType}". Please select a valid style from the catalog.`,
          message: `Invalid tattoo type: "${tattooType}". Please select a valid style from the catalog.`
        });
      }
      durationHours = matchedTattoo.durationHours;
    } else if (duration) {
      const parsed = parseFloat(duration);
      if (isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid duration query parameter.',
          message: 'Invalid duration query parameter.'
        });
      }
      durationHours = parsed;
    }

    const slotResult = await getAvailableSlotsForDate(date, durationHours);
    const resolvedTattooName = matchedTattoo ? matchedTattoo.name : (tattooType || 'Custom Session');

    return res.status(200).json({
      success: true,
      date,
      tattooType: resolvedTattooName,
      durationHours,
      slots: slotResult.slots,
      data: {
        date,
        tattooType: resolvedTattooName,
        durationHours,
        slots: slotResult.slots,
        totalSlots: slotResult.slots.length,
        availableSlotsCount: slotResult.availableSlotsCount
      }
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to calculate available slots'
    });
  }
};

/**
 * POST /api/appointments
 * Full server-side validation + final availability re-check + MongoDB save.
 */
export const createAppointment = async (req, res) => {
  return executeWithBookingLock(async () => {
    try {
      const {
        customerName,
        customerAge,
        customerGender,
        customerPhone,
        appointmentDate,
        tattooType,
        startTime
      } = req.body;

      // ── 1. Required-field validation ──────────────────────────────────────
      if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
        return res.status(400).json({
          success: false,
          error: 'customerName is required.',
          message: 'customerName is required.'
        });
      }

      if (customerAge === undefined || customerAge === null || isNaN(Number(customerAge))) {
        return res.status(400).json({
          success: false,
          error: 'customerAge must be a valid number.',
          message: 'customerAge must be a valid number.'
        });
      }

      if (!customerGender || typeof customerGender !== 'string' || !customerGender.trim()) {
        return res.status(400).json({
          success: false,
          error: 'customerGender is required.',
          message: 'customerGender is required.'
        });
      }

      if (!customerPhone || typeof customerPhone !== 'string' || !customerPhone.trim()) {
        return res.status(400).json({
          success: false,
          error: 'customerPhone is required.',
          message: 'customerPhone is required.'
        });
      }

      // ── 2. Date validation (format + calendar validity + weekday) ─────────
      if (!appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
        return res.status(400).json({
          success: false,
          error: 'appointmentDate must be a valid date in YYYY-MM-DD format.',
          message: 'appointmentDate must be a valid date in YYYY-MM-DD format.'
        });
      }

      const parsedDate = parseLocalDate(appointmentDate);
      if (!parsedDate) {
        return res.status(400).json({
          success: false,
          error: 'appointmentDate is not a valid calendar date.',
          message: 'appointmentDate is not a valid calendar date.'
        });
      }

      if (isWeekend(appointmentDate)) {
        return res.status(400).json({
          success: false,
          error: 'Appointments are available Monday to Friday only. The studio is closed on weekends.',
          message: 'Appointments are available Monday to Friday only. The studio is closed on weekends.'
        });
      }

      // ── 3. Tattoo type — MUST exist in server-side catalog ────────────────
      if (!tattooType || typeof tattooType !== 'string' || !tattooType.trim()) {
        return res.status(400).json({
          success: false,
          error: 'tattooType is required.',
          message: 'tattooType is required.'
        });
      }

      const matchedTattoo = getTattooByName(tattooType);
      if (!matchedTattoo) {
        return res.status(400).json({
          success: false,
          error: `Invalid tattoo type: "${tattooType}". Please select a valid style from the catalog.`,
          message: `Invalid tattoo type: "${tattooType}". Please select a valid style from the catalog.`
        });
      }

      // Duration is ALWAYS taken from the server-side catalog — client value ignored entirely
      const durationHours = matchedTattoo.durationHours;

      // ── 4. Start time — must be one of the 12 allowed hourly slots ─────────
      const ALLOWED_START_TIMES = [
        '09:00','10:00','11:00','12:00','13:00','14:00',
        '15:00','16:00','17:00','18:00','19:00','20:00'
      ];

      if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
        return res.status(400).json({
          success: false,
          error: 'startTime must be in HH:mm format (e.g. "09:00").',
          message: 'startTime must be in HH:mm format (e.g. "09:00").'
        });
      }

      if (!ALLOWED_START_TIMES.includes(startTime)) {
        return res.status(400).json({
          success: false,
          error: `"${startTime}" is not a valid appointment start time. Allowed: ${ALLOWED_START_TIMES.join(', ')}.`,
          message: `"${startTime}" is not a valid appointment start time. Allowed: ${ALLOWED_START_TIMES.join(', ')}.`
        });
      }

      // ── 5. Calculate end time on the server ───────────────────────────────
      const endTime = addHoursToTime(startTime, durationHours);

      // ── 6. FINAL AVAILABILITY RE-CHECK against the live database ─────────
      // This is the authoritative gate — prevents double-booking even if the
      // frontend's slot list was stale when the user selected their slot.
      const availability = await checkSlotAvailability({
        appointmentDate,
        startTime,
        endTime,
        durationHours
      });

      if (!availability.available) {
        const isConflict = availability.reason === 'ALREADY_BOOKED';
        return res.status(isConflict ? 409 : 400).json({
          success: false,
          error: availability.message || 'This appointment slot is not available.',
          message: availability.message || 'This appointment slot is not available.',
          reason: availability.reason,
          conflictWith: availability.conflictWith || null
        });
      }

      // ── 7. Save to MongoDB ────────────────────────────────────────────────
      const newAppointment = await Appointment.create({
        customerName:    customerName.trim(),
        customerAge:     Number(customerAge),
        customerGender:  customerGender.trim(),
        customerPhone:   customerPhone.trim(),
        appointmentDate,
        tattooType:      matchedTattoo.name,   // normalised from catalog
        durationHours,                          // from catalog — never from client
        startTime,
        endTime,
        status: 'CONFIRMED'
        // createdAt handled automatically by Mongoose timestamps: true
      });

      // ── 8. Success response ───────────────────────────────────────────────
      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment: {
          id:              newAppointment._id,
          customerName:    newAppointment.customerName,
          customerAge:     newAppointment.customerAge,
          customerGender:  newAppointment.customerGender,
          customerPhone:   newAppointment.customerPhone,
          appointmentDate: newAppointment.appointmentDate,
          tattooType:      newAppointment.tattooType,
          durationHours:   newAppointment.durationHours,
          startTime:       newAppointment.startTime,
          endTime:         newAppointment.endTime,
          startFormatted:  formatDisplayTime(startTime),
          endFormatted:    formatDisplayTime(endTime),
          status:          newAppointment.status,
          createdAt:       newAppointment.createdAt
        }
      });
    } catch (error) {
      console.error('[createAppointment] Unexpected error:', error);
      // Never expose stack traces or internal error details to the client
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create appointment due to a server error. Please try again.'
      });
    }
  });
};

/**
 * GET /api/appointments/:id
 * Retrieve appointment confirmation by ID
 */
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...appointment,
        startFormatted: formatDisplayTime(appointment.startTime),
        endFormatted: formatDisplayTime(appointment.endTime)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error fetching appointment'
    });
  }
};

/**
 * GET /api/appointments
 * Retrieve appointments for verification or admin listing
 */
export const getAllAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) filter.appointmentDate = date;

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, startTime: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments.map((appt) => ({
        ...appt,
        startFormatted: formatDisplayTime(appt.startTime),
        endFormatted: formatDisplayTime(appt.endTime)
      }))
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error fetching appointments'
    });
  }
};
