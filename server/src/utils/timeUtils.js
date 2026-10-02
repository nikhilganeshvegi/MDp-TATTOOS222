// Time calculation and interval overlap utilities

/**
 * Converts "HH:mm" (24-hour) string to minutes from midnight
 * e.g., "09:00" -> 540, "13:30" -> 810
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts minutes from midnight to "HH:mm" (24-hour) string
 * e.g., 540 -> "09:00", 810 -> "13:30"
 */
export const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Adds duration in hours to a "HH:mm" start time
 */
export const addHoursToTime = (startTime, durationHours) => {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + Math.round(durationHours * 60);
  return minutesToTime(endMin);
};

/**
 * Checks if two open-ended time intervals [startA, endA) and [startB, endB) overlap.
 * Adjacent intervals (e.g. 09:00-11:00 and 11:00-12:00) do NOT overlap.
 */
export const intervalsOverlap = (startA, endA, startB, endB) => {
  const sA = typeof startA === 'string' ? timeToMinutes(startA) : startA;
  const eA = typeof endA === 'string' ? timeToMinutes(endA) : endA;
  const sB = typeof startB === 'string' ? timeToMinutes(startB) : startB;
  const eB = typeof endB === 'string' ? timeToMinutes(endB) : endB;

  return Math.max(sA, sB) < Math.min(eA, eB);
};

/**
 * Parse YYYY-MM-DD safely in local calendar without UTC shift
 */
export const parseLocalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

/**
 * Checks if a given YYYY-MM-DD falls on Saturday (6) or Sunday (0)
 */
export const isWeekend = (dateStr) => {
  const date = parseLocalDate(dateStr);
  if (!date) return false;
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Converts "HH:mm" (24-hour) to user-friendly "h:mm A" string
 * e.g., "09:00" -> "9:00 AM", "13:00" -> "1:00 PM"
 */
export const formatDisplayTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours24, minutes] = timeStr.split(':').map(Number);
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};
