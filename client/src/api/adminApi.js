// Admin API service helper

const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://127.0.0.1:5000/api';
const TOKEN_KEY = 'mdp_admin_auth_token';
const ADMIN_KEY = 'mdp_admin_auth_user';

/**
 * Safely parse JSON from a fetch response
 */
const parseResponseJson = async (response) => {
  try {
    const text = await response.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Authenticate admin with email & password against backend
 */
export const loginAdmin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await parseResponseJson(response);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'Authentication failed. Please check your credentials.';
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  if (data?.token) {
    setStoredAdminSession(data.token, data.admin);
  }

  return data;
};

/**
 * Verify current admin session with backend
 */
export const verifyAdminSession = async (tokenOverride) => {
  const token = tokenOverride || getStoredAdminToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/admin/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await parseResponseJson(response);
    if (!response.ok || !data?.success) {
      clearStoredAdminSession();
      return null;
    }

    return data.admin;
  } catch (err) {
    console.warn('[Admin Auth] Session verification error:', err);
    return null;
  }
};

/**
 * Session storage helpers
 */
export const getStoredAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const getStoredAdminUser = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY) || sessionStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAdminSession = (token, admin, remember = true) => {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    if (admin) {
      storage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }
  } catch (err) {
    console.warn('[Admin Auth] Failed to save session:', err);
  }
};

export const clearStoredAdminSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
  } catch (err) {
    console.warn('[Admin Auth] Failed to clear session:', err);
  }
};
