// Shop operation rules and scheduling constants

export const SHOP_RULES = {
  // Working hours (24-hour HH:mm)
  OPENING_TIME: '09:00',
  CLOSING_TIME: '21:00',

  // Break time (None - continuous sessions throughout operating window)
  BREAK_START: null,
  BREAK_END: null,

  // Working days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  WORK_DAYS: [0, 1, 2, 3, 4, 5, 6], // Monday to Sunday (All 7 days open)
  WEEKEND_DAYS: [],                 // Studio is open all 7 days

  // Scheduling step
  SLOT_INTERVAL_MINUTES: 60, // 1-hour interval for start times

  // Single artist constraint
  ARTIST_CAPACITY: 1
};
