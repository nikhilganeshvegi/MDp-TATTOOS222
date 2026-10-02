import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

/* ── Cinematic Hero Section ──────────────────────────────────────────────
   Full-bleed viewport hero with HD tattoo photography on the right,
   staggered text entrance, and edge-fade image integration.
   ─────────────────────────────────────────────────────────────────────── */
export const HeroSection = ({ onBookClick }) => {
  const heroRef = useRef(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const img = heroRef.current?.querySelector('.hero-photo-layer');
    if (!img) return;
    const onScroll = () => {
      const offset = window.scrollY * 0.28;
      img.style.transform = `translateY(${offset}px) scale(1.06)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      {/* ── Background Layers ── */}
      <div className="hero-noise-overlay" aria-hidden="true" />

      {/* Right-side tattoo photography — fades into dark on the left */}
      <div className="hero-photo-column" aria-hidden="true">
        <div className="hero-photo-layer">
          <img
            src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85"
            alt="Detailed blackwork tattoo artistry"
            className="hero-photo-img"
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Gradient fade from left (dark) over the photo */}
        <div className="hero-photo-fade-left" aria-hidden="true" />
        {/* Gradient at bottom */}
        <div className="hero-photo-fade-bottom" aria-hidden="true" />
      </div>

      {/* ── Content ── */}
      <div className="hero-content-wrap">
        <div className="hero-content">

          {/* Eyebrow */}
          <p className="hero-eyebrow animate-fade-up delay-1">
            <span className="eyebrow-dot" />
            Private Practice · Mon–Fri · By Appointment Only
          </p>

          {/* Main Headline */}
          <h1 className="hero-headline animate-fade-up delay-2">
            Your Story.<br />
            <span className="hero-headline-accent">Permanently<br />Expressed.</span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-body animate-fade-up delay-3">
            Dedicated resident artistry tailored exclusively to your anatomy,
            personal narrative, and skin. Every design is drafted original —
            executed in a private, sterile setting with undivided focus.
          </p>

          {/* CTAs */}
          <div className="hero-actions animate-fade-up delay-4">
            {onBookClick ? (
              <button type="button" className="btn-primary-hero" onClick={onBookClick}>
                <Calendar size={15} aria-hidden="true" />
                <span>BOOK APPOINTMENT</span>
              </button>
            ) : (
              <Link to="/book" className="btn-primary-hero">
                <Calendar size={15} aria-hidden="true" />
                <span>BOOK APPOINTMENT</span>
              </Link>
            )}

            <Link to="/tattoo-styles" className="btn-ghost-hero">
              <span>EXPLORE TATTOOS</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {/* Trust metrics strip */}
          <div className="hero-metrics animate-fade-up delay-5">
            <div className="hero-metric">
              <span className="metric-val">20</span>
              <span className="metric-label">Curated Styles</span>
            </div>
            <span className="metric-sep" aria-hidden="true" />
            <div className="hero-metric">
              <span className="metric-val">100%</span>
              <span className="metric-label">Custom Drafted</span>
            </div>
            <span className="metric-sep" aria-hidden="true" />
            <div className="hero-metric">
              <span className="metric-val">1:1</span>
              <span className="metric-label">Private Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Info Strip ── */}
      <div className="hero-info-strip">
        <span>MON – FRI</span>
        <span className="strip-sep">◆</span>
        <span>9:00 AM – 9:00 PM</span>
        <span className="strip-sep">◆</span>
        <span>NO WALK-INS</span>
        <span className="strip-sep">◆</span>
        <span>WHATSAPP CONFIRMED BOOKINGS</span>
      </div>
    </section>
  );
};
