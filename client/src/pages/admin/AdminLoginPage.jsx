import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export const AdminLoginPage = () => {
  const { isAuthenticated, login, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect straight to /admin/dashboard
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Admin email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Admin password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Redirect to /admin/dashboard upon successful authentication
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.warn('[Admin Login Failed]', err.message);
      setAuthError(err.message || 'Invalid admin email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-viewport">
      {/* Background aesthetic ornament */}
      <div className="admin-login-glow" aria-hidden="true" />

      <div className="admin-login-card">
        {/* Brand Lockup */}
        <div className="admin-brand-header">
          <Link to="/" className="admin-logo-link" title="Return to MDP TATTOOS Public Site">
            <img
              src="/mdp-logo.png"
              alt="MDP TATTOOS Badge Logo"
              className="admin-badge-img"
              width="64"
              height="64"
            />
          </Link>
          <div className="admin-brand-titles">
            <span className="admin-brand-kicker">PRIVATE PRACTICE · STUDIO PORTAL</span>
            <h1 className="admin-brand-name">MDP TATTOOS</h1>
          </div>
        </div>

        <div className="admin-header-divider" />

        {/* Section Heading */}
        <div className="admin-login-heading-wrap">
          <h2 className="admin-login-title">Admin Login</h2>
          <p className="admin-login-subtitle">
            Restricted access for studio owner &amp; operations management.
          </p>
        </div>

        {/* Error Alert Banner */}
        {authError && (
          <div className="admin-error-banner" role="alert">
            <ShieldAlert size={18} className="admin-error-icon" aria-hidden="true" />
            <div className="admin-error-text">
              <strong>Authentication Failed</strong>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          {/* Email Field */}
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label">
              Admin Email
            </label>
            <div className={`admin-input-wrap ${formErrors.email ? 'has-error' : ''}`}>
              <Mail size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                className="admin-input-field"
                placeholder="name@mdptattoos.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                }}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
            </div>
            {formErrors.email && (
              <span className="admin-field-error">{formErrors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <div className="admin-label-flex">
              <label htmlFor="admin-password" className="admin-form-label">
                Password
              </label>
            </div>
            <div className={`admin-input-wrap ${formErrors.password ? 'has-error' : ''}`}>
              <Lock size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input-field"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors({ ...formErrors, password: null });
                }}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formErrors.password && (
              <span className="admin-field-error">{formErrors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="admin-spin-icon" aria-hidden="true" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link back to public site */}
        <div className="admin-login-footer">
          <Link to="/" className="admin-back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
