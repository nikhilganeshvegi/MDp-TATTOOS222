import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <span className="admin-loading-text">Verifying Admin Authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated requests to /admin
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return children;
};
