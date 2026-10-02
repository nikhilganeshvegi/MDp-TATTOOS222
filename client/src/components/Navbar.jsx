import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'HOME', to: '/' },
    { label: 'ABOUT US', to: '/about' },
    { label: 'TATTOO STYLES', to: '/tattoo-styles' },
    { label: 'SERVICES', to: '/services' },
    { label: 'CONTACT', to: '/contact' },
  ];

  return (
    <nav className={`studio-navbar ${isScrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Primary navigation">
      <div className="navbar-container">

        {/* Logo Image — /mdp-logo.png */}
        <Link to="/" className="navbar-brand-logo" aria-label="MDP TATTOOS – Go Home">
          <img
            src="/mdp-logo.png"
            alt="MDP TATTOOS Logo"
            className="nav-logo-img"
            width="52"
            height="52"
          />
          <div className="nav-brand-text">
            <span className="nav-brand-name">MDP TATTOOS</span>
            <span className="nav-brand-sub">BESPOKE BODY ART</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu-desktop">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="navbar-cta-wrapper">
          <NavLink
            to="/book"
            className={({ isActive }) => `btn-navbar-cta ${isActive ? 'btn-navbar-cta-active' : ''}`}
          >
            <Calendar size={13} aria-hidden="true" />
            <span>BOOK APPOINTMENT</span>
          </NavLink>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-drawer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'drawer-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="mobile-menu-drawer"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          {/* Drawer Header */}
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-logo-wrap" onClick={() => setMobileMenuOpen(false)}>
              <img src="/mdp-logo.png" alt="MDP TATTOOS" className="mobile-logo-img" width="40" height="40" />
              <span className="nav-brand-name">MDP TATTOOS</span>
            </Link>
            <button
              type="button"
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="mobile-menu-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mobile-cta-wrapper">
              <NavLink
                to="/book"
                className="btn-navbar-cta mobile-cta-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={14} />
                <span>BOOK APPOINTMENT</span>
              </NavLink>
            </div>

            <div className="mobile-drawer-footer">
              <p className="mobile-hours-label">BY APPOINTMENT ONLY</p>
              <p className="mobile-hours-val">Monday – Friday · 9:00 AM – 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
