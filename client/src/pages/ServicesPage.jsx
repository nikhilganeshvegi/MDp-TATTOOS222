import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, ShieldAlert, Sparkles, Feather, FileText, HeartPulse } from 'lucide-react';

const SERVICES = [
  {
    num: '01',
    icon: Sparkles,
    title: 'Custom Original Design',
    highlight: 'Drawn original for each client',
    body: 'Every project begins as a dedicated drawing tailored to your specific anatomical placement, proportions, and personal aesthetic. We never tattoo flash sheets or duplicated internet designs without significant bespoke reinterpretation.'
  },
  {
    num: '02',
    icon: FileText,
    title: 'Anatomical Consultation',
    highlight: 'Comprehensive pre-session planning',
    body: 'Before needles touch skin, a focused consultation clarifies size, orientation, longevity, skin tone interaction, and flow with adjacent anatomy. You leave with full confidence and clear expectations.'
  },
  {
    num: '03',
    icon: Feather,
    title: 'Private Tattoo Sessions',
    highlight: '1-on-1 private studio environment',
    body: 'Tattoo sessions are conducted one client at a time in our private setting. No drop-in foot traffic, no loud crowds, and no multitasking artists. The pace follows technical precision, not an arbitrary quota.'
  },
  {
    num: '04',
    icon: ShieldAlert,
    title: 'Cover-Up & Rework Architecture',
    highlight: 'Thoughtful transformation of existing ink',
    body: 'Faded, unwanted, or poorly aging tattoos can be intelligently reworked into striking, purposeful pieces. We assess skin saturation, depth, and undertones to engineer a design that truly conceals.'
  },
  {
    num: '05',
    icon: HeartPulse,
    title: 'Clinical Aftercare Guidance',
    highlight: 'Step-by-step healing protocols',
    body: 'The longevity of your tattoo depends on proper healing. We provide medical-grade barrier dressings, clear written daily regimens, and direct follow-up availability throughout your recovery window.'
  }
];

export const ServicesPage = () => {
  return (
    <div className="page-root services-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-container">
          <p className="page-eyebrow">MDP TATTOOS · WHAT WE OFFER</p>
          <h1 className="page-title">
            Comprehensive<br />
            <span className="gold-text">Tattoo Services.</span>
          </h1>
          <p className="page-lead">
            From the initial anatomical concept to healed skin years later.
            Every service is handled exclusively by the resident artist to ensure continuity and craftsmanship.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-body-section">
        <div className="section-container">
          <div className="services-list-grid">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="service-feature-card">
                  <div className="sfc-top">
                    <span className="sfc-num">{s.num}</span>
                    <div className="sfc-icon-wrap">
                      <Icon size={20} className="gold-icon" />
                    </div>
                  </div>
                  <h3 className="sfc-title">{s.title}</h3>
                  <div className="sfc-highlight">{s.highlight}</div>
                  <p className="sfc-body">{s.body}</p>
                </div>
              );
            })}
          </div>

          {/* Booking Notice Strip */}
          <div className="services-cta-banner">
            <div className="scb-content">
              <h3>Have a specific service in mind?</h3>
              <p>Book your session online through our live calendar. Sessions are Monday through Friday.</p>
            </div>
            <Link to="/book" className="btn-primary-hero">
              <Calendar size={15} />
              <span>BOOK APPOINTMENT</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
