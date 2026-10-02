// API service helper for interacting with backend REST endpoints

const API_BASE = typeof window !== 'undefined' ? '/api' : (process.env.API_BASE || 'http://127.0.0.1:5000/api');

/**
 * Safely parses JSON from a Fetch response.
 * Never throws "Unexpected end of JSON input" on empty bodies or non-JSON error pages.
 */
const parseResponseJson = async (response) => {
  try {
    const text = await response.text();
    if (!text || !text.trim()) {
      return null;
    }
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
};

export const fetchTattooTypes = async () => {
  const response = await fetch(`${API_BASE}/tattoo-types`);
  const data = await parseResponseJson(response);

  if (!response.ok) {
    const msg = data?.message || data?.error || `Failed to fetch tattoo catalog (HTTP ${response.status})`;
    throw new Error(msg);
  }

  if (!data) return [];
  return Array.isArray(data) ? data : (data.data || data);
};

export const fetchAvailableSlots = async (date, tattooType) => {
  const url = `${API_BASE}/slots?date=${encodeURIComponent(date)}&tattooType=${encodeURIComponent(tattooType)}`;
  const response = await fetch(url);
  const data = await parseResponseJson(response);

  if (!response.ok) {
    const msg = data?.message || data?.error || `Failed to fetch slots for this date (HTTP ${response.status})`;
    const error = new Error(msg);
    error.status = response.status;
    throw error;
  }

  if (!data) {
    return { slots: [] };
  }

  // Support both { slots: [...] } and { data: { slots: [...] } }
  return data.data || data;
};

export const bookAppointment = async (payload) => {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await parseResponseJson(response);

  if (!response.ok) {
    const msg = data?.message || data?.error || `Booking failed (HTTP ${response.status})`;
    const error = new Error(msg);
    error.status = response.status;
    error.reason = data?.reason;
    error.conflictWith = data?.conflictWith;
    throw error;
  }

  return data?.appointment || data;
};

export const fetchAppointment = async (id) => {
  const response = await fetch(`${API_BASE}/appointments/${id}`);
  const data = await parseResponseJson(response);

  if (!response.ok) {
    const msg = data?.message || data?.error || `Failed to fetch appointment (HTTP ${response.status})`;
    throw new Error(msg);
  }

  return data?.data || data;
};

export const checkServerHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await parseResponseJson(res);
    return data || { status: 'OFFLINE', databaseConnected: false };
  } catch (err) {
    return { status: 'OFFLINE', databaseConnected: false };
  }
};
