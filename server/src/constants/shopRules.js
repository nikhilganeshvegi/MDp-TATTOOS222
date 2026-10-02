// Shop operation rules and scheduling constants

export const SHOP_RULES = {
  // Working hours (24-hour HH:mm)
  OPENING_TIME: '09:00',
  CLOSING_TIME: '21:00',

  // Break time
  BREAK_START: '12:00',
  BREAK_END: '13:00',

  // Working days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  WORK_DAYS: [1, 2, 3, 4, 5], // Monday to Friday
  WEEKEND_DAYS: [0, 6],       // Sunday and Saturday

  // Scheduling step
  SLOT_INTERVAL_MINUTES: 60, // 1-hour interval for start times

  // Single artist constraint
  ARTIST_CAPACITY: 1
};
