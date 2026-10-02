import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAdmin,
  verifyAdminSession,
  getStoredAdminToken,
  getStoredAdminUser,
  clearStoredAdminSession
} from '../api/adminApi.js';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredAdminToken());
  const [admin, setAdmin] = useState(() => getStoredAdminUser());
  const [loading, setLoading] = useState(true);

  // Verify stored token on initial mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const storedToken = getStoredAdminToken();
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const verifiedAdmin = await verifyAdminSession(storedToken);
        if (isMounted) {
          if (verifiedAdmin) {
            setAdmin(verifiedAdmin);
            setToken(storedToken);
          } else {
            setAdmin(null);
            setToken(null);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setAdmin(null);
          setToken(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await loginAdmin({ email, password });
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    clearStoredAdminSession();
    setToken(null);
    setAdmin(null);
  };

  const value = {
    isAuthenticated: Boolean(token),
    admin,
    token,
    loading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
