import crypto from 'crypto';

const getSecret = () => {
  return process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'mdp-tattoos-secure-salt-2026';
};

/**
 * Generate a secure HMAC-signed token with 24h expiration
 */
export const createToken = (email) => {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

/**
 * Verify HMAC-signed token
 */
export const verifyTokenString = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(encodedPayload).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

/**
 * POST /api/admin/login
 * Validates admin credentials against server/.env (never hardcoded in frontend)
 */
export const adminLogin = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.'
    });
  }

  const configuredEmail = (process.env.ADMIN_EMAIL || 'mdptattoos10@gmail.com').toLowerCase().trim();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    console.error('[Admin Auth] ADMIN_PASSWORD is not configured in server/.env');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: ADMIN_PASSWORD not configured.'
    });
  }

  const inputEmail = String(email).toLowerCase().trim();
  const inputPassword = String(password);

  // Authenticate against env credentials
  if (inputEmail !== configuredEmail || inputPassword !== configuredPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin email or password.'
    });
  }

  const token = createToken(configuredEmail);
  return res.status(200).json({
    success: true,
    message: 'Admin authentication successful.',
    token,
    admin: {
      email: configuredEmail
    }
  });
};

/**
 * GET /api/admin/verify
 * Validates active admin session token
 */
export const adminVerify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No active session token provided.'
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyTokenString(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Session has expired or is invalid. Please log in again.'
    });
  }

  return res.status(200).json({
    success: true,
    admin: {
      email: payload.email
    }
  });
};

import { getBookingStatus, setBookingStatus } from '../services/settingService.js';

/**
 * Middleware: Verify Admin Authentication from Bearer token
 */
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin authentication required.'
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyTokenString(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Session has expired or is invalid.'
    });
  }

  req.admin = payload;
  next();
};

/**
 * GET /api/admin/booking-status
 * Authenticated admin endpoint to retrieve booking availability
 */
export const getAdminBookingStatus = async (req, res) => {
  try {
    const isEnabled = await getBookingStatus();
    return res.status(200).json({
      success: true,
      isEnabled
    });
  } catch (error) {
    console.error('[Admin] Error reading booking status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking status.'
    });
  }
};

/**
 * POST /api/admin/booking-status
 * Authenticated admin endpoint to toggle booking availability
 */
export const updateAdminBookingStatus = async (req, res) => {
  try {
    const { isEnabled } = req.body || {};
    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Field "isEnabled" (boolean) is required in request body.'
      });
    }

    const updated = await setBookingStatus(isEnabled);
    return res.status(200).json({
      success: true,
      isEnabled: updated,
      message: updated ? 'Bookings are now ENABLED.' : 'Bookings are now DISABLED.'
    });
  } catch (error) {
    console.error('[Admin] Error updating booking status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status.'
    });
  }
};

import { Appointment } from '../models/Appointment.js';
import {
  formatDisplayTime,
  timeToMinutes,
  getTodayDateInKolkata,
  formatTodayDisplayInKolkata
} from '../utils/timeUtils.js';

/**
 * GET /api/admin/appointments/today
 * Protected admin endpoint to retrieve appointments scheduled for TODAY in Asia/Kolkata (IST).
 * Strictly sorted earliest start time first.
 */
export const getAdminTodayAppointments = async (req, res) => {
  try {
    const todayKolkata = getTodayDateInKolkata(); // e.g. "2026-10-03"
    const todayFormatted = formatTodayDisplayInKolkata(); // e.g. "Saturday, October 3, 2026"

    // Query appointments belonging strictly to TODAY in Asia/Kolkata
    const rawAppointments = await Appointment.find({
      $or: [
        { appointmentDate: todayKolkata },
        {
          appointmentDate: {
            $gte: new Date(`${todayKolkata}T00:00:00+05:30`),
            $lte: new Date(`${todayKolkata}T23:59:59.999+05:30`)
          }
        }
      ]
    }).lean();

    // Sort earliest time first (normalized by minutes from midnight)
    const sorted = [...rawAppointments].sort((a, b) => {
      const minA = timeToMinutes(a.startTime);
      const minB = timeToMinutes(b.startTime);
      return minA - minB;
    });

    const appointments = sorted.map((appt) => ({
      id: appt._id,
      _id: appt._id,
      customerName: appt.customerName,
      customerAge: appt.customerAge,
      customerGender: appt.customerGender,
      customerPhone: appt.customerPhone,
      appointmentDate: appt.appointmentDate,
      tattooType: appt.tattooType,
      durationHours: appt.durationHours,
      startTime: appt.startTime,
      endTime: appt.endTime,
      startFormatted: formatDisplayTime(appt.startTime),
      endFormatted: formatDisplayTime(appt.endTime),
      status: appt.status || 'CONFIRMED',
      createdAt: appt.createdAt
    }));

    return res.status(200).json({
      success: true,
      date: todayKolkata,
      dateFormatted: todayFormatted,
      timezone: 'Asia/Kolkata',
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('[Admin] Error fetching today\'s appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve today\'s appointments.'
    });
  }
};

/**
 * GET /api/admin/appointments/upcoming
 * Protected admin endpoint to retrieve appointments scheduled AFTER TODAY in Asia/Kolkata (IST).
 * Strictly sorted chronologically: Year -> Month -> Day -> Time.
 * Returns both flat sorted list and hierarchical grouping (Year -> Month -> Day -> Appointments).
 */
export const getAdminUpcomingAppointments = async (req, res) => {
  try {
    const todayKolkata = getTodayDateInKolkata(); // e.g. "2026-10-03"

    // Query appointments strictly after today in Asia/Kolkata
    const rawAppointments = await Appointment.find({
      $or: [
        { appointmentDate: { $gt: todayKolkata } },
        {
          appointmentDate: {
            $gt: new Date(`${todayKolkata}T23:59:59.999+05:30`)
          }
        }
      ]
    }).lean();

    // Secondary safety filter: ensure appointmentDate string is strictly greater than todayKolkata
    const filtered = rawAppointments.filter((appt) => {
      let dStr = appt.appointmentDate;
      if (dStr instanceof Date) {
        dStr = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(dStr);
      }
      return typeof dStr === 'string' && dStr > todayKolkata;
    });

    // Chronological Sort:
    // Priority 1: Year (earliest first)
    // Priority 2: Month (earliest first)
    // Priority 3: Day (earliest first)
    // Priority 4: Time (earliest first)
    filtered.sort((a, b) => {
      const dateA = String(a.appointmentDate);
      const dateB = String(b.appointmentDate);
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      const minA = timeToMinutes(a.startTime);
      const minB = timeToMinutes(b.startTime);
      return minA - minB;
    });

    const appointments = filtered.map((appt) => {
      const dateStr = String(appt.appointmentDate);
      const [yearStr, monthStr, dayStr] = dateStr.split('-');
      const y = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);
      const d = parseInt(dayStr, 10);

      // Local date instance for formatted day/month labels
      const dateObj = new Date(y, m - 1, d);
      const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
      const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' });
      const dayLabel = `${monthName} ${d}`;
      const fullDateLabel = `${dayOfWeek}, ${monthName} ${d}, ${y}`;

      return {
        id: appt._id,
        _id: appt._id,
        customerName: appt.customerName,
        customerAge: appt.customerAge,
        customerGender: appt.customerGender,
        customerPhone: appt.customerPhone,
        appointmentDate: dateStr,
        tattooType: appt.tattooType,
        durationHours: appt.durationHours,
        startTime: appt.startTime,
        endTime: appt.endTime,
        startFormatted: formatDisplayTime(appt.startTime),
        endFormatted: formatDisplayTime(appt.endTime),
        status: appt.status || 'CONFIRMED',
        year: y,
        month: m,
        monthName,
        monthYearLabel: `${monthName.toUpperCase()} ${y}`,
        day: d,
        dayLabel,
        dayOfWeek,
        fullDateLabel,
        createdAt: appt.createdAt
      };
    });

    // Build hierarchical grouping: YEAR -> MONTH -> DAY -> APPOINTMENTS
    const yearMap = new Map();
    for (const appt of appointments) {
      const y = appt.year;
      if (!yearMap.has(y)) {
        yearMap.set(y, {
          year: y,
          monthsMap: new Map()
        });
      }
      const yEntry = yearMap.get(y);
      const m = appt.month;
      if (!yEntry.monthsMap.has(m)) {
        yEntry.monthsMap.set(m, {
          monthIndex: m,
          monthName: appt.monthName,
          year: y,
          monthYearLabel: appt.monthYearLabel,
          daysMap: new Map()
        });
      }
      const mEntry = yEntry.monthsMap.get(m);
      const d = appt.day;
      if (!mEntry.daysMap.has(d)) {
        mEntry.daysMap.set(d, {
          date: appt.appointmentDate,
          dayNumber: d,
          dayLabel: appt.dayLabel,
          dayOfWeek: appt.dayOfWeek,
          fullDateLabel: appt.fullDateLabel,
          appointments: []
        });
      }
      const dEntry = mEntry.daysMap.get(d);
      dEntry.appointments.push(appt);
    }

    const groups = Array.from(yearMap.values()).map((yEntry) => ({
      year: yEntry.year,
      months: Array.from(yEntry.monthsMap.values()).map((mEntry) => ({
        monthIndex: mEntry.monthIndex,
        monthName: mEntry.monthName,
        year: mEntry.year,
        monthYearLabel: mEntry.monthYearLabel,
        days: Array.from(mEntry.daysMap.values())
      }))
    }));

    return res.status(200).json({
      success: true,
      todayDate: todayKolkata,
      timezone: 'Asia/Kolkata',
      totalUpcoming: appointments.length,
      appointments,
      groups
    });
  } catch (error) {
    console.error('[Admin] Error fetching upcoming appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve upcoming appointments.'
    });
  }
};


