import mongoose from 'mongoose';
import { Setting } from '../models/Setting.js';

// In-memory cache for fast access and fallback during connection transitions
let cachedBookingStatus = true; // Default: BOOKINGS ENABLED

/**
 * Retrieve current booking status (persisted in MongoDB settings collection)
 * Defaults to true if no record exists yet.
 */
export const getBookingStatus = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await Setting.findOne({ key: 'booking_enabled' }).lean();
      if (doc !== null && doc !== undefined) {
        cachedBookingStatus = Boolean(doc.value);
        return cachedBookingStatus;
      }

      // Initialize default setting in database
      await Setting.findOneAndUpdate(
        { key: 'booking_enabled' },
        { key: 'booking_enabled', value: true, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      cachedBookingStatus = true;
      return true;
    } catch (err) {
      console.warn('[SettingService] Could not read from DB, using cached status:', err.message);
      return cachedBookingStatus;
    }
  }

  return cachedBookingStatus;
};

/**
 * Persist updated booking status to MongoDB settings collection
 */
export const setBookingStatus = async (isEnabled) => {
  const normalizedValue = Boolean(isEnabled);
  cachedBookingStatus = normalizedValue;

  if (mongoose.connection.readyState === 1) {
    try {
      await Setting.findOneAndUpdate(
        { key: 'booking_enabled' },
        { key: 'booking_enabled', value: normalizedValue, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      console.log(`[SettingService] Booking status persisted to MongoDB: ${normalizedValue ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      console.error('[SettingService] Error persisting setting to MongoDB:', err.message);
    }
  } else {
    console.warn('[SettingService] MongoDB not currently connected; booking status updated in cache:', normalizedValue);
  }

  return cachedBookingStatus;
};
