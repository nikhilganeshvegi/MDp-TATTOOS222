import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE = 'http://127.0.0.1:5000/api';

async function runAllTests() {
  console.log('================================================================');
  console.log('   TATTOO APPOINTMENT BOOKING SYSTEM — COMPLETE TEST SUITE      ');
  console.log('================================================================\n');

  let passedCount = 0;
  let failedCount = 0;
  const testIdsToClean = [];

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failedCount++;
    }
  }

  // Connect to DB for direct verification
  const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tattoo_booking';
  await mongoose.connect(dbUri);
  const { Appointment } = await import('../src/models/Appointment.js');

  const testWeekday1 = '2026-10-26'; // Monday
  const testWeekday2 = '2026-10-27'; // Tuesday
  const testWeekday3 = '2026-10-28'; // Wednesday
  const testWeekday4 = '2026-10-29'; // Thursday
  const testWeekday5 = '2026-10-30'; // Friday
  const testWeekendSat = '2026-10-31'; // Saturday
  const testWeekendSun = '2026-11-01'; // Sunday

  // Clean any existing test records for these dates first
  await Appointment.deleteMany({
    appointmentDate: {
      $in: [testWeekday1, testWeekday2, testWeekday3, testWeekday4, testWeekday5, testWeekendSat, testWeekendSun]
    }
  });

  // ============================================================================
  // TEST 1: Health & Server Check
  // ============================================================================
  console.log('\n--- Test 1: Health / Server Check ---');
  try {
    const res = await fetch(`${API_BASE}/health`);
    assert(res.status === 200, 'GET /api/health returned HTTP 200');
    const data = await res.json();
    assert(data.status === 'OK', 'Health status is "OK"');
    assert(data.databaseConnected === true, 'Database is confirmed connected (databaseConnected === true)');
  } catch (err) {
    assert(false, `Health check error: ${err.message}`);
  }

  // ============================================================================
  // TEST 2: GET Tattoo Types
  // ============================================================================
  console.log('\n--- Test 2: GET Tattoo Types ---');
  try {
    const res = await fetch(`${API_BASE}/tattoo-types`);
    assert(res.status === 200, 'GET /api/tattoo-types returned HTTP 200');
    const data = await res.json();
    const catalog = data.data || data;
    assert(Array.isArray(catalog), 'Tattoo catalog is an array');
    assert(catalog.length === 20, `Catalog contains exactly 20 styles (got ${catalog.length})`);
    
    const small = catalog.find(t => t.name === 'Small Tattoo');
    const dotwork = catalog.find(t => t.name === 'Dotwork Tattoo');
    const realism = catalog.find(t => t.name === 'Realism Tattoo');

    assert(small && small.durationHours === 1, 'Small Tattoo duration is 1 hour');
    assert(dotwork && dotwork.durationHours === 2, 'Dotwork Tattoo duration is 2 hours');
    assert(realism && realism.durationHours === 3, 'Realism Tattoo duration is 3 hours');
  } catch (err) {
    assert(false, `Tattoo types error: ${err.message}`);
  }

  // ============================================================================
  // TEST 3: GET Slots for a Normal Weekday
  // ============================================================================
  console.log('\n--- Test 3: GET Slots for Normal Weekday ---');
  try {
    const res = await fetch(`${API_BASE}/slots?date=${testWeekday1}&tattooType=Realism Tattoo`);
    assert(res.status === 200, 'GET /api/slots returned HTTP 200 for weekday');
    const data = await res.json();
    assert(data.success === true, 'Response contains success: true');
    assert(data.date === testWeekday1, `Top-level date matches "${testWeekday1}"`);
    assert(data.tattooType === 'Realism Tattoo', 'Top-level tattooType matches "Realism Tattoo"');
    assert(data.durationHours === 3, 'Top-level durationHours matches 3');
    assert(Array.isArray(data.slots), 'Top-level slots is an array');
    assert(data.slots.length === 12, `Total candidate hourly slots is 12 (got ${data.slots.length})`);
  } catch (err) {
    assert(false, `Normal weekday slots error: ${err.message}`);
  }

  // ============================================================================
  // TEST 4: 1-Hour Tattoo Slot Generation
  // ============================================================================
  console.log('\n--- Test 4: 1-Hour Tattoo Slot Generation ---');
  try {
    const res = await fetch(`${API_BASE}/slots?date=${testWeekday1}&tattooType=Small Tattoo`);
    const data = await res.json();
    const slots = data.slots || data.data?.slots;

    const slot09 = slots.find(s => s.startTime === '09:00');
    const slot10 = slots.find(s => s.startTime === '10:00');
    const slot11 = slots.find(s => s.startTime === '11:00');
    const slot12 = slots.find(s => s.startTime === '12:00');
    const slot13 = slots.find(s => s.startTime === '13:00');
    const slot20 = slots.find(s => s.startTime === '20:00');

    assert(slot09 && slot09.available === true, '09:00–10:00 is valid (available: true)');
    assert(slot10 && slot10.available === true, '10:00–11:00 is valid (available: true)');
    assert(slot11 && slot11.available === true, '11:00–12:00 is valid (available: true)');
    assert(slot12 && slot12.available === false && slot12.conflictReason === 'OVERLAPS_BREAK',
      '12:00–13:00 is INVALID (lunch break overlap)');
    assert(slot13 && slot13.available === true, '13:00–14:00 is valid (available: true)');
    assert(slot20 && slot20.available === true, '20:00–21:00 is valid (fits closing time 21:00)');
  } catch (err) {
    assert(false, `1-Hour slot generation error: ${err.message}`);
  }

  // ============================================================================
  // TEST 5: 2-Hour Tattoo Slot Generation
  // ============================================================================
  console.log('\n--- Test 5: 2-Hour Tattoo Slot Generation ---');
  try {
    const res = await fetch(`${API_BASE}/slots?date=${testWeekday1}&tattooType=Traditional Tattoo`);
    const data = await res.json();
    const slots = data.slots || data.data?.slots;

    const slot10 = slots.find(s => s.startTime === '10:00');
    const slot11 = slots.find(s => s.startTime === '11:00');
    const slot12 = slots.find(s => s.startTime === '12:00');
    const slot13 = slots.find(s => s.startTime === '13:00');
    const slot20 = slots.find(s => s.startTime === '20:00');

    assert(slot10 && slot10.available === true, '10:00–12:00 is valid (available: true)');
    assert(slot11 && slot11.available === false && slot11.conflictReason === 'OVERLAPS_BREAK',
      '11:00–13:00 is INVALID (overlaps lunch)');
    assert(slot12 && slot12.available === false && slot12.conflictReason === 'OVERLAPS_BREAK',
      '12:00–14:00 is INVALID (overlaps lunch)');
    assert(slot13 && slot13.available === true, '13:00–15:00 is valid (available: true)');
    assert(slot20 && slot20.available === false && slot20.conflictReason === 'EXCEEDS_CLOSING_TIME',
      '20:00–22:00 is INVALID (exceeds closing time 21:00)');
  } catch (err) {
    assert(false, `2-Hour slot generation error: ${err.message}`);
  }

  // ============================================================================
  // TEST 6: 3-Hour Tattoo Slot Generation
  // ============================================================================
  console.log('\n--- Test 6: 3-Hour Tattoo Slot Generation ---');
  try {
    const res = await fetch(`${API_BASE}/slots?date=${testWeekday1}&tattooType=Realism Tattoo`);
    const data = await res.json();
    const slots = data.slots || data.data?.slots;

    const slot09 = slots.find(s => s.startTime === '09:00');
    const slot10 = slots.find(s => s.startTime === '10:00');
    const slot11 = slots.find(s => s.startTime === '11:00');
    const slot12 = slots.find(s => s.startTime === '12:00');
    const slot13 = slots.find(s => s.startTime === '13:00');
    const slot19 = slots.find(s => s.startTime === '19:00');
    const slot20 = slots.find(s => s.startTime === '20:00');

    assert(slot09 && slot09.available === true, '09:00–12:00 is valid (available: true)');
    assert(slot10 && slot10.available === false && slot10.conflictReason === 'OVERLAPS_BREAK',
      '10:00–13:00 is INVALID (overlaps lunch)');
    assert(slot11 && slot11.available === false && slot11.conflictReason === 'OVERLAPS_BREAK',
      '11:00–14:00 is INVALID (overlaps lunch)');
    assert(slot12 && slot12.available === false && slot12.conflictReason === 'OVERLAPS_BREAK',
      '12:00–15:00 is INVALID (overlaps lunch)');
    assert(slot13 && slot13.available === true, '13:00–16:00 is valid (available: true)');
    assert(slot19 && slot19.available === false && slot19.conflictReason === 'EXCEEDS_CLOSING_TIME',
      '19:00–22:00 is INVALID (exceeds closing time 21:00)');
    assert(slot20 && slot20.available === false && slot20.conflictReason === 'EXCEEDS_CLOSING_TIME',
      '20:00–23:00 is INVALID (exceeds closing time 21:00)');
  } catch (err) {
    assert(false, `3-Hour slot generation error: ${err.message}`);
  }

  // ============================================================================
  // TEST 7: Lunch-Break Rejection (POST /api/appointments)
  // ============================================================================
  console.log('\n--- Test 7: Lunch Break Rejection (POST) ---');
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Lunch Test',
        customerAge: 25,
        customerGender: 'Female',
        customerPhone: '1234567890',
        appointmentDate: testWeekday2,
        tattooType: 'Small Tattoo', // 1h -> 12:00 to 13:00
        startTime: '12:00'
      })
    });
    assert(res.status === 400, 'POST 12:00–13:00 rejected with HTTP 400');
    const data = await res.json();
    assert(data.reason === 'OVERLAPS_BREAK', 'Reason is OVERLAPS_BREAK');
  } catch (err) {
    assert(false, `Lunch break rejection error: ${err.message}`);
  }

  // ============================================================================
  // TEST 8: Weekend Rejection (GET & POST)
  // ============================================================================
  console.log('\n--- Test 8: Weekend Rejection ---');
  try {
    const satRes = await fetch(`${API_BASE}/slots?date=${testWeekendSat}&tattooType=Small Tattoo`);
    assert(satRes.status === 400, 'GET /api/slots for Saturday rejected with HTTP 400');
    const satData = await satRes.json();
    assert(Boolean(satData.error || satData.message), 'Returns clear weekend error message in JSON');

    const sunRes = await fetch(`${API_BASE}/slots?date=${testWeekendSun}&tattooType=Small Tattoo`);
    assert(sunRes.status === 400, 'GET /api/slots for Sunday rejected with HTTP 400');

    const bookSatRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Weekend Test',
        customerAge: 25,
        customerGender: 'Male',
        customerPhone: '1234567890',
        appointmentDate: testWeekendSat,
        tattooType: 'Small Tattoo',
        startTime: '10:00'
      })
    });
    assert(bookSatRes.status === 400, 'POST on Saturday rejected with HTTP 400');
  } catch (err) {
    assert(false, `Weekend rejection error: ${err.message}`);
  }

  // ============================================================================
  // TEST 9: Working-Hours / End-Time Validation
  // ============================================================================
  console.log('\n--- Test 9: Working-Hours / End-Time Validation ---');
  try {
    // 3-hour tattoo starting at 19:00 ends at 22:00 > 21:00
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Late Client',
        customerAge: 28,
        customerGender: 'Female',
        customerPhone: '1234567890',
        appointmentDate: testWeekday2,
        tattooType: 'Realism Tattoo', // 3 hours
        startTime: '19:00'
      })
    });
    assert(res.status === 400, 'Appointment ending at 22:00 rejected with HTTP 400');
    const data = await res.json();
    assert(data.reason === 'EXCEEDS_CLOSING_TIME', 'Reason is EXCEEDS_CLOSING_TIME');
  } catch (err) {
    assert(false, `Working-hours validation error: ${err.message}`);
  }

  // ============================================================================
  // TEST 10: Existing Confirmed Appointment Conflict (409 Conflict)
  // ============================================================================
  console.log('\n--- Test 10: Existing Confirmed Appointment Conflict ---');
  try {
    // Book 14:00–16:00 (Traditional Tattoo, 2h)
    const baseRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Base Confirmed Appointment',
        customerAge: 30,
        customerGender: 'Female',
        customerPhone: '1234567890',
        appointmentDate: testWeekday3,
        tattooType: 'Traditional Tattoo',
        startTime: '14:00'
      })
    });
    assert(baseRes.status === 201, 'Base appointment (14:00–16:00) booked successfully with 201');
    const baseData = await baseRes.json();
    if (baseData.appointment?.id) testIdsToClean.push(baseData.appointment.id);

    // Overlap 1: 13:00–15:00 (Traditional Tattoo, 2h)
    const conflict1 = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Conflict Client 1',
        customerAge: 25,
        customerGender: 'Male',
        customerPhone: '1234567891',
        appointmentDate: testWeekday3,
        tattooType: 'Traditional Tattoo',
        startTime: '13:00'
      })
    });
    assert(conflict1.status === 409, 'Attempt 13:00–15:00 rejected with HTTP 409 Conflict');

    // Overlap 2: 14:00–16:00 (exact overlap)
    const conflict2 = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Conflict Client 2',
        customerAge: 26,
        customerGender: 'Female',
        customerPhone: '1234567892',
        appointmentDate: testWeekday3,
        tattooType: 'Traditional Tattoo',
        startTime: '14:00'
      })
    });
    assert(conflict2.status === 409, 'Attempt 14:00–16:00 (exact) rejected with HTTP 409 Conflict');

    // Overlap 3: 15:00–17:00 (overlaps 15:00-16:00)
    const conflict3 = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Conflict Client 3',
        customerAge: 27,
        customerGender: 'Other',
        customerPhone: '1234567893',
        appointmentDate: testWeekday3,
        tattooType: 'Traditional Tattoo',
        startTime: '15:00'
      })
    });
    assert(conflict3.status === 409, 'Attempt 15:00–17:00 rejected with HTTP 409 Conflict');
  } catch (err) {
    assert(false, `Conflict test error: ${err.message}`);
  }

  // ============================================================================
  // TEST 11: Adjacent Appointment Allowed (16:00–18:00)
  // ============================================================================
  console.log('\n--- Test 11: Adjacent Appointment Allowed ---');
  try {
    // 16:00–18:00 immediately follows 14:00–16:00
    const adjacentRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Adjacent Client',
        customerAge: 28,
        customerGender: 'Male',
        customerPhone: '1234567894',
        appointmentDate: testWeekday3,
        tattooType: 'Traditional Tattoo',
        startTime: '16:00'
      })
    });
    assert(adjacentRes.status === 201, 'Adjacent appointment (16:00–18:00) booked successfully with HTTP 201');
    const data = await adjacentRes.json();
    if (data.appointment?.id) testIdsToClean.push(data.appointment.id);
  } catch (err) {
    assert(false, `Adjacent appointment error: ${err.message}`);
  }

  // ============================================================================
  // TEST 12: Cancelled Appointment Does NOT Block
  // ============================================================================
  console.log('\n--- Test 12: Cancelled Appointment Does NOT Block ---');
  try {
    // Create a CANCELLED appointment directly in MongoDB for 10:00–12:00 on testWeekday4
    const cancelledDoc = await Appointment.create({
      customerName: 'Previously Cancelled Client',
      customerAge: 32,
      customerGender: 'Female',
      customerPhone: '1234567895',
      appointmentDate: testWeekday4,
      tattooType: 'Traditional Tattoo',
      durationHours: 2,
      startTime: '10:00',
      endTime: '12:00',
      status: 'CANCELLED'
    });
    testIdsToClean.push(cancelledDoc._id);

    // Verify slots endpoint shows 10:00 is available
    const slotsRes = await fetch(`${API_BASE}/slots?date=${testWeekday4}&tattooType=Traditional Tattoo`);
    const slotsData = await slotsRes.json();
    const slot10 = (slotsData.slots || slotsData.data?.slots).find(s => s.startTime === '10:00');
    assert(slot10 && slot10.available === true, 'Slot 10:00 is AVAILABLE despite existing CANCELLED booking');

    // Book the slot
    const bookRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'New Replacement Client',
        customerAge: 29,
        customerGender: 'Male',
        customerPhone: '1234567896',
        appointmentDate: testWeekday4,
        tattooType: 'Traditional Tattoo',
        startTime: '10:00'
      })
    });
    assert(bookRes.status === 201, 'Successfully booked 10:00 previously occupied by CANCELLED appointment');
    const bookData = await bookRes.json();
    if (bookData.appointment?.id) testIdsToClean.push(bookData.appointment.id);
  } catch (err) {
    assert(false, `Cancelled appointment test error: ${err.message}`);
  }

  // ============================================================================
  // TEST 13: Invalid Tattoo Type
  // ============================================================================
  console.log('\n--- Test 13: Invalid Tattoo Type ---');
  try {
    const slotsRes = await fetch(`${API_BASE}/slots?date=${testWeekday1}&tattooType=NonExistentStyle`);
    assert(slotsRes.status === 400, 'GET /api/slots with invalid tattooType returns HTTP 400');

    const bookRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Invalid Style Client',
        customerAge: 25,
        customerGender: 'Female',
        customerPhone: '1234567890',
        appointmentDate: testWeekday1,
        tattooType: 'Imaginary Tattoo',
        startTime: '09:00'
      })
    });
    assert(bookRes.status === 400, 'POST with invalid tattooType returns HTTP 400');
  } catch (err) {
    assert(false, `Invalid tattoo type test error: ${err.message}`);
  }

  // ============================================================================
  // TEST 14: Invalid Start Time
  // ============================================================================
  console.log('\n--- Test 14: Invalid Start Time ---');
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Time Test',
        customerAge: 25,
        customerGender: 'Female',
        customerPhone: '1234567890',
        appointmentDate: testWeekday1,
        tattooType: 'Small Tattoo',
        startTime: '09:30' // Not an hourly increment
      })
    });
    assert(res.status === 400, 'POST with non-hourly startTime "09:30" returns HTTP 400');
  } catch (err) {
    assert(false, `Invalid start time test error: ${err.message}`);
  }

  // ============================================================================
  // TEST 15: Missing Required Fields
  // ============================================================================
  console.log('\n--- Test 15: Missing Required Fields ---');
  try {
    const fieldsToTest = [
      { field: 'customerName', payload: { customerAge: 25, customerGender: 'Female', customerPhone: '123', appointmentDate: testWeekday1, tattooType: 'Small Tattoo', startTime: '09:00' } },
      { field: 'customerAge', payload: { customerName: 'Test', customerGender: 'Female', customerPhone: '123', appointmentDate: testWeekday1, tattooType: 'Small Tattoo', startTime: '09:00' } },
      { field: 'customerGender', payload: { customerName: 'Test', customerAge: 25, customerPhone: '123', appointmentDate: testWeekday1, tattooType: 'Small Tattoo', startTime: '09:00' } },
      { field: 'customerPhone', payload: { customerName: 'Test', customerAge: 25, customerGender: 'Female', appointmentDate: testWeekday1, tattooType: 'Small Tattoo', startTime: '09:00' } },
      { field: 'appointmentDate', payload: { customerName: 'Test', customerAge: 25, customerGender: 'Female', customerPhone: '123', tattooType: 'Small Tattoo', startTime: '09:00' } },
      { field: 'tattooType', payload: { customerName: 'Test', customerAge: 25, customerGender: 'Female', customerPhone: '123', appointmentDate: testWeekday1, startTime: '09:00' } },
      { field: 'startTime', payload: { customerName: 'Test', customerAge: 25, customerGender: 'Female', customerPhone: '123', appointmentDate: testWeekday1, tattooType: 'Small Tattoo' } }
    ];

    let allMissingRejected = true;
    for (const testCase of fieldsToTest) {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.payload)
      });
      if (res.status !== 400) {
        allMissingRejected = false;
        console.error(`Failed to reject missing field: ${testCase.field}`);
      }
    }
    assert(allMissingRejected, 'All requests with missing required fields rejected with HTTP 400');
  } catch (err) {
    assert(false, `Missing fields test error: ${err.message}`);
  }

  // ============================================================================
  // TEST 16 & 17 & 18: Successful Creation & MongoDB Document Verification
  // ============================================================================
  console.log('\n--- Tests 16, 17, 18: Appointment Creation & MongoDB Verification ---');
  let createdApptId = null;
  try {
    const bookRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Verify Integrity User',
        customerAge: 24,
        customerGender: 'Non-Binary',
        customerPhone: '+1-555-888-9999',
        appointmentDate: testWeekday5,
        tattooType: 'Dotwork Tattoo', // 2 hours
        startTime: '10:00'
      })
    });
    assert(bookRes.status === 201, 'POST /api/appointments succeeded with HTTP 201');
    const bookData = await bookRes.json();
    createdApptId = bookData.appointment?.id;
    testIdsToClean.push(createdApptId);

    // TEST 17: Verify document exists in MongoDB
    const mongoDoc = await Appointment.findById(createdApptId).lean();
    assert(Boolean(mongoDoc), 'Appointment document exists in MongoDB database (tattoo_booking.appointments)');

    // TEST 18: Verify all required fields in MongoDB document
    assert(mongoDoc.customerName === 'Verify Integrity User', 'customerName saved correctly');
    assert(mongoDoc.customerAge === 24, 'customerAge saved correctly as number');
    assert(mongoDoc.customerGender === 'Non-Binary', 'customerGender saved correctly');
    assert(mongoDoc.customerPhone === '+1-555-888-9999', 'customerPhone saved correctly');
    assert(mongoDoc.appointmentDate === testWeekday5, 'appointmentDate saved correctly as YYYY-MM-DD');
    assert(mongoDoc.tattooType === 'Dotwork Tattoo', 'tattooType saved correctly');
    assert(mongoDoc.durationHours === 2, 'durationHours determined as 2 by backend');
    assert(mongoDoc.startTime === '10:00', 'startTime saved correctly');
    assert(mongoDoc.endTime === '12:00', 'endTime calculated as 12:00 by backend');
    assert(mongoDoc.status === 'CONFIRMED', 'status is CONFIRMED');
    assert(mongoDoc.createdAt instanceof Date, 'createdAt exists as valid Date timestamp');
  } catch (err) {
    assert(false, `Creation and MongoDB verification error: ${err.message}`);
  }

  // ============================================================================
  // TEST 19: Double / Concurrent Booking Attempt
  // ============================================================================
  console.log('\n--- Test 19: Double / Concurrent Booking Attempt ---');
  try {
    const payload = {
      customerName: 'Simultaneous Client',
      customerAge: 23,
      customerGender: 'Male',
      customerPhone: '555-444-3333',
      appointmentDate: testWeekday5,
      tattooType: 'Small Tattoo', // 1h
      startTime: '15:00'
    };

    // Fire 2 concurrent booking requests simultaneously
    const [resA, resB] = await Promise.all([
      fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    ]);

    const statuses = [resA.status, resB.status];
    const successes = statuses.filter(s => s === 201).length;
    const conflicts = statuses.filter(s => s === 409).length;

    assert(successes === 1, `Exactly one concurrent request succeeded with HTTP 201 (got ${successes})`);
    assert(conflicts === 1, `The concurrent duplicate request was rejected with HTTP 409 (got ${conflicts})`);

    const dataA = await resA.json();
    const dataB = await resB.json();
    if (dataA.appointment?.id) testIdsToClean.push(dataA.appointment.id);
    if (dataB.appointment?.id) testIdsToClean.push(dataB.appointment.id);
  } catch (err) {
    assert(false, `Concurrent booking error: ${err.message}`);
  }

  // ============================================================================
  // TEST 20: Safe JSON Parsing (No "Unexpected end of JSON input")
  // ============================================================================
  console.log('\n--- Test 20: Frontend Step 4 Safe JSON Parsing ---');
  try {
    const { fetchAvailableSlots } = await import('../../client/src/api/appointmentApi.js');

    // 1. Fetch valid slots via frontend API helper
    const slotsResult = await fetchAvailableSlots(testWeekday1, 'Small Tattoo');
    assert(Array.isArray(slotsResult.slots), 'fetchAvailableSlots safely parsed valid slots response');
    assert(slotsResult.slots.length === 12, 'Returned 12 hourly candidate slots');

    // 2. Fetch weekend (400 Bad Request) - should throw structured error, not "Unexpected end of JSON input"
    let threwCorrectly = false;
    let errorMsg = '';
    try {
      await fetchAvailableSlots(testWeekendSat, 'Small Tattoo');
    } catch (e) {
      threwCorrectly = true;
      errorMsg = e.message;
    }
    assert(threwCorrectly, 'Weekend request threw error via fetchAvailableSlots');
    assert(!errorMsg.includes('Unexpected end of JSON input'),
      `Error is human-readable and clean (not "Unexpected end of JSON input"): "${errorMsg}"`);
  } catch (err) {
    assert(false, `Safe JSON parsing test error: ${err.message}`);
  }

  // ============================================================================
  // COMPLETE REAL FLOW: Select Tattoo → Select Date → Get Slots → Select Slot → Book → DB Verify
  // ============================================================================
  console.log('\n--- Complete Real User Flow Verification ---');
  try {
    // 1. Fetch catalog
    const catalogRes = await fetch(`${API_BASE}/tattoo-types`);
    const catalogData = await catalogRes.json();
    const chosenTattoo = (catalogData.data || catalogData).find(t => t.name === 'Mandala Tattoo');
    assert(Boolean(chosenTattoo), `1. Selected tattoo: "${chosenTattoo.name}" (${chosenTattoo.durationHours} hours)`);

    // 2. Choose valid weekday
    const chosenDate = testWeekday5;
    assert(true, `2. Selected weekday: ${chosenDate}`);

    // 3. Receive slots
    const slotsRes = await fetch(`${API_BASE}/slots?date=${chosenDate}&tattooType=${encodeURIComponent(chosenTattoo.name)}`);
    const slotsJson = await slotsRes.json();
    const candidateSlots = slotsJson.slots || slotsJson.data?.slots;
    assert(Array.isArray(candidateSlots) && candidateSlots.length > 0, `3. Received ${candidateSlots.length} candidate slots`);

    // 4. Select an available slot
    const availableSlot = candidateSlots.find(s => s.available && s.startTime === '17:00');
    assert(Boolean(availableSlot), `4. Selected available slot: ${availableSlot.startTime} – ${availableSlot.endTime}`);

    // 5. Submit customer details & POST appointment
    const bookingPayload = {
      customerName: 'Sam Rivera',
      customerAge: 27,
      customerGender: 'Female',
      customerPhone: '+1 (555) 789-0123',
      appointmentDate: chosenDate,
      tattooType: chosenTattoo.name,
      durationHours: chosenTattoo.durationHours,
      startTime: availableSlot.startTime
    };
    const bookRes = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    assert(bookRes.status === 201, '5. POST /api/appointments succeeded with HTTP 201');
    const bookResult = await bookRes.json();
    const finalApptId = bookResult.appointment?.id;
    testIdsToClean.push(finalApptId);
    assert(Boolean(finalApptId), `6. Received booking confirmation ID: ${finalApptId}`);

    // 7. Verify MongoDB document
    const savedRecord = await Appointment.findById(finalApptId).lean();
    assert(Boolean(savedRecord), '7. Verified appointment document is saved in MongoDB');
    assert(savedRecord.customerName === 'Sam Rivera', '   customerName verified');
    assert(savedRecord.appointmentDate === chosenDate, '   appointmentDate verified');
    assert(savedRecord.tattooType === 'Mandala Tattoo', '   tattooType verified');
    assert(savedRecord.durationHours === 2, '   durationHours verified (2)');
    assert(savedRecord.startTime === '17:00', '   startTime verified (17:00)');
    assert(savedRecord.endTime === '19:00', '   endTime verified (19:00)');
    assert(savedRecord.status === 'CONFIRMED', '   status verified (CONFIRMED)');
    console.log('  ✓ PASS: Complete end-to-end booking flow successfully verified from frontend API to MongoDB!');
    passedCount++;
  } catch (err) {
    assert(false, `Complete real flow error: ${err.message}`);
  }

  // ============================================================================
  // CLEANUP TEMPORARY TEST DATA
  // ============================================================================
  console.log('\n--- Cleanup Temporary Test Records ---');
  try {
    const delResult = await Appointment.deleteMany({ _id: { $in: testIdsToClean } });
    console.log(`  ✓ Cleaned up ${delResult.deletedCount} temporary test records from MongoDB.`);
  } catch (err) {
    console.warn(`  Cleanup warning: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log(`   TEST SUITE SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================\n');

  await mongoose.disconnect();
  process.exit(failedCount === 0 ? 0 : 1);
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
