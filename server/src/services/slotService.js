import { SHOP_RULES } from '../constants/shopRules.js';
import { Appointment } from '../models/Appointment.js';
import {
  timeToMinutes,
  minutesToTime,
  addHoursToTime,
  intervalsOverlap,
  isWeekend,
  formatDisplayTime,
  parseLocalDate
} from '../utils/timeUtils.js';

/**
 * Validates whether a requested appointment time window is valid and non-overlapping.
 * Used for both slot generation and pre-save database verification.
 */
export const checkSlotAvailability = async ({
  appointmentDate,
  startTime,
  endTime,
  durationHours,
  excludeAppointmentId = null
}) => {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const openMin = timeToMinutes(SHOP_RULES.OPENING_TIME);   // 09:00 (540)
  const closeMin = timeToMinutes(SHOP_RULES.CLOSING_TIME); // 21:00 (1260)

  // 2. Shop opening hours check
  if (startMin < openMin) {
    return {
      available: false,
      reason: 'BEFORE_OPENING_TIME',
      message: `Studio opens at ${formatDisplayTime(SHOP_RULES.OPENING_TIME)}.`
    };
  }

  if (endMin > closeMin) {
    return {
      available: false,
      reason: 'EXCEEDS_CLOSING_TIME',
      message: `Appointment ends at ${formatDisplayTime(endTime)}, which exceeds closing time of ${formatDisplayTime(SHOP_RULES.CLOSING_TIME)}.`
    };
  }

  // 4. Past time check if date is today in Asia/Kolkata
  const kolkataDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const isToday = appointmentDate === kolkataDateStr;
  if (isToday) {
    const kolkataTimeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
    const [kh, km] = kolkataTimeStr.split(':').map(Number);
    const currentMinutes = kh * 60 + km;

    if (startMin <= currentMinutes) {
      return {
        available: false,
        reason: 'PAST_TIME',
        message: 'This time slot has already passed for today.'
      };
    }
  }

  // 5. Database check: Overlap with any existing confirmed appointment on that date
  const query = {
    appointmentDate,
    status: 'CONFIRMED'
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const existingAppointments = await Appointment.find(query).lean();

  for (const appt of existingAppointments) {
    if (intervalsOverlap(startTime, endTime, appt.startTime, appt.endTime)) {
      return {
        available: false,
        reason: 'ALREADY_BOOKED',
        message: `This slot conflicts with an existing booking (${formatDisplayTime(appt.startTime)} – ${formatDisplayTime(appt.endTime)}).`,
        conflictWith: {
          startTime: appt.startTime,
          endTime: appt.endTime
        }
      };
    }
  }

  return {
    available: true,
    reason: null,
    message: 'Slot is available'
  };
};

/**
 * Calculates and returns all 1-hour candidate slots across the working day (9:00 AM - 9:00 PM)
 * along with their availability status and conflict reasons.
 */
export const getAvailableSlotsForDate = async (appointmentDate, durationHours) => {
  const openMin = timeToMinutes(SHOP_RULES.OPENING_TIME);   // 540 (09:00)
  const closeMin = timeToMinutes(SHOP_RULES.CLOSING_TIME); // 1260 (21:00)
  const stepMin = SHOP_RULES.SLOT_INTERVAL_MINUTES;        // 60 minutes

  // Fetch confirmed appointments for this day from DB once
  const existingAppointments = await Appointment.find({
    appointmentDate,
    status: 'CONFIRMED'
  }).lean();

  // Determine if appointmentDate is today in Asia/Kolkata (IST)
  const kolkataDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const isToday = appointmentDate === kolkataDateStr;
  let currentMinutes = 0;
  if (isToday) {
    const kolkataTimeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
    const [kh, km] = kolkataTimeStr.split(':').map(Number);
    currentMinutes = kh * 60 + km;
  }

  const slots = [];

  // Generate 1-hour start slots from opening time until 1 step before closing time
  for (let start = openMin; start < closeMin; start += stepMin) {
    const startTime = minutesToTime(start);
    const endTime = addHoursToTime(startTime, durationHours);
    const end = timeToMinutes(endTime);

    let isAvailable = true;
    let conflictReason = null;
    let message = 'Available';

    // Check past time if today
    if (isToday && start <= currentMinutes) {
      isAvailable = false;
      conflictReason = 'PAST_TIME';
      message = 'Time slot has already passed';
    }
    // Check shop closing overrun
    else if (end > closeMin) {
      isAvailable = false;
      conflictReason = 'EXCEEDS_CLOSING_TIME';
      message = `Session of ${durationHours}h exceeds closing time (${formatDisplayTime(SHOP_RULES.CLOSING_TIME)})`;
    }
    // Check existing confirmed appointment collision
    else {
      const conflictAppt = existingAppointments.find((appt) =>
        intervalsOverlap(startTime, endTime, appt.startTime, appt.endTime)
      );

      if (conflictAppt) {
        isAvailable = false;
        conflictReason = 'ALREADY_BOOKED';
        message = `Already booked (${formatDisplayTime(conflictAppt.startTime)} – ${formatDisplayTime(conflictAppt.endTime)})`;
      }
    }

    slots.push({
      startTime,
      endTime,
      startFormatted: formatDisplayTime(startTime),
      endFormatted: formatDisplayTime(endTime),
      durationHours,
      available: isAvailable,
      conflictReason,
      message
    });
  }

  return {
    date: appointmentDate,
    isWeekend: false,
    durationHours,
    slots,
    totalSlots: slots.length,
    availableSlotsCount: slots.filter((s) => s.available).length
  };
};
