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
