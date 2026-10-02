// Independent test to verify all slot calculations and collision rules
import { TATTOO_CATALOG, getTattooByName } from '../src/constants/tattooCatalog.js';
import {
  timeToMinutes,
  minutesToTime,
  addHoursToTime,
  intervalsOverlap,
  isWeekend
} from '../src/utils/timeUtils.js';

console.log('--- Testing Tattoo Catalog ---');
console.assert(TATTOO_CATALOG.length === 20, `Expected 20 tattoos, got ${TATTOO_CATALOG.length}`);
const realism = getTattooByName('Realism Tattoo');
console.assert(realism && realism.durationHours === 3, 'Realism Tattoo should be 3 hours');
const minimalist = getTattooByName('Minimalist Tattoo');
console.assert(minimalist && minimalist.durationHours === 1, 'Minimalist Tattoo should be 1 hour');
const dotwork = getTattooByName('Dotwork Tattoo');
console.assert(dotwork && dotwork.durationHours === 2, 'Dotwork Tattoo should be 2 hours');
console.log('✓ Catalog tests passed.');

console.log('--- Testing Time Utils ---');
console.assert(timeToMinutes('09:00') === 540, '09:00 should be 540');
console.assert(timeToMinutes('12:00') === 720, '12:00 should be 720');
console.assert(timeToMinutes('13:00') === 780, '13:00 should be 780');
console.assert(timeToMinutes('21:00') === 1260, '21:00 should be 1260');

console.assert(minutesToTime(540) === '09:00', '540 should format to 09:00');
console.assert(addHoursToTime('09:00', 2) === '11:00', '09:00 + 2h should be 11:00');
console.assert(addHoursToTime('14:00', 3) === '17:00', '14:00 + 3h should be 17:00');

// Overlap tests:
// Adjacent intervals must NOT overlap:
console.assert(!intervalsOverlap('09:00', '11:00', '11:00', '12:00'), 'Adjacent slots should not overlap');
console.assert(!intervalsOverlap('11:00', '12:00', '12:00', '13:00'), '11-12 and break 12-13 should not overlap');

// Break collision tests:
// Lunch break is 12:00 to 13:00
console.assert(intervalsOverlap('11:00', '13:00', '12:00', '13:00'), '11:00-13:00 must collide with break 12-13');
console.assert(intervalsOverlap('12:00', '14:00', '12:00', '13:00'), '12:00-14:00 must collide with break 12-13');
console.assert(intervalsOverlap('10:00', '13:00', '12:00', '13:00'), '10:00-13:00 (3h) must collide with break 12-13');
console.assert(!intervalsOverlap('09:00', '12:00', '12:00', '13:00'), '09:00-12:00 (3h) finishes at 12:00, does not overlap break');
console.assert(!intervalsOverlap('13:00', '16:00', '12:00', '13:00'), '13:00-16:00 starts at 13:00, does not overlap break');

// Weekend tests:
// 2026-10-03 is Saturday, 2026-10-04 is Sunday, 2026-10-05 is Monday
console.assert(isWeekend('2026-10-03') === true, 'Saturday must be detected as weekend');
console.assert(isWeekend('2026-10-04') === true, 'Sunday must be detected as weekend');
console.assert(isWeekend('2026-10-05') === false, 'Monday must not be weekend');
console.log('✓ All logic assertions passed successfully!');
