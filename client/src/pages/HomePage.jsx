import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection.jsx';
import { Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Selected Work Images (Verified HD tattoo photography) ── */
const SELECTED_WORK = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=900&q=85',
    alt: 'Detailed blackwork tattoo on forearm',
    label: 'Blackwork',
    tier: '2-Hour Session',
    size: 'large',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=700&q=85',
    alt: 'Fine line botanical tattoo',
    label: 'Fine Line',
    tier: '1-Hour Session',
    size: 'small',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=700&q=85',
    alt: 'Geometric dotwork tattoo',
    label: 'Dotwork',
    tier: '2-Hour Session',
    size: 'small',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?auto=format&fit=crop&w=1200&q=85',
    alt: 'Full sleeve realism tattoo',
    label: 'Realism',
    tier: '3-Hour Session',
    size: 'wide',
  },
];

/* ── Tattoo Style Preview Data (Verified HD photography) ── */
const STYLE_PREVIEW = [
  {
    title: 'Fine Line & Minimalist',
    tier: '1 Hour',
    desc: 'Single-needle precision. Delicate geometry, micro-script, and botanical motifs.',
    imgSrc: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Fine line tattoo close up',
  },
  {
    title: 'Blackwork & Geometry',
    tier: '2 Hours',
    desc: 'Bold contrast, mandala forms, dotwork, and neo-traditional composition.',
    imgSrc: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Blackwork tattoo on arm',
  },
  {
    title: 'Realism & Statement',
    tier: '3 Hours',
    desc: 'Deep tonal portraits, Japanese irezumi, and complex cover-up architecture.',
    imgSrc: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Realism portrait tattoo',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
export const HomePage = () => {
  const bookingRef  = useReveal();
  const workRef     = useReveal();
  const introRef    = useReveal();
  const stylesRef   = useReveal();
  const finalCtaRef = useReveal();

  return (
    <div className="homepage-root">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. CINEMATIC HERO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HeroSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. BOOKING CTA BAND
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="home-booking-band" ref={bookingRef} data-reveal>
        <div className="hbb-inner section-container">
          <div className="hbb-left">
            <div className="hbb-live-dot">
              <span className="live-pulse" />
              <span className="hbb-live-label">LIVE CALENDAR ACTIVE</span>
            </div>
            <h2 className="hbb-heading">Reserve Your Session</h2>
            <p className="hbb-sub">
              20 curated styles · 7 days a week · instant WhatsApp confirmation.
              No double-bookings. No walk-ins.
            </p>
          </div>
          <div className="hbb-right">
            <div className="hbb-meta">
              <Clock size={14} className="gold-icon" aria-hidden="true" />
              <span>Mon–Sun · 9 AM – 9 PM · By Appointment Only</span>
            </div>
            <Link to="/book" className="btn-primary-hero hbb-cta">
              <Calendar size={15} aria-hidden="true" />
              <span>BOOK APPOINTMENT</span>
            </Link>
            <Link to="/tattoo-styles" className="hbb-browse-link">
              Browse 20 Styles <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SELECTED WORK — Editorial masonry gallery
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="home-selected-work" ref={workRef} data-reveal>
        <div className="section-container">
          <div className="sw-header">
            <div>
              <p className="section-label">Craft &amp; Execution</p>
              <h2 className="section-heading">Selected Work</h2>
            </div>
            <Link to="/tattoo-styles" className="sw-view-all">
              Explore All Styles <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {/* Masonry editorial grid */}
          <div className="sw-grid">
            {/* Large left */}
            <div className="sw-item sw-item-large">
              <div className="sw-img-wrap">
                <img
                  src={SELECTED_WORK[0].src}
                  alt={SELECTED_WORK[0].alt}
                  className="sw-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="sw-img-overlay">
                  <span className="sw-label">{SELECTED_WORK[0].label}</span>
                  <span className="sw-tier">{SELECTED_WORK[0].tier}</span>
                </div>
              </div>
            </div>

            {/* Right column: two stacked */}
            <div className="sw-col-right">
              <div className="sw-item sw-item-small">
                <div className="sw-img-wrap">
                  <img
                    src={SELECTED_WORK[1].src}
                    alt={SELECTED_WORK[1].alt}
                    className="sw-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="sw-img-overlay">
                    <span className="sw-label">{SELECTED_WORK[1].label}</span>
                    <span className="sw-tier">{SELECTED_WORK[1].tier}</span>
                  </div>
                </div>
              </div>
              <div className="sw-item sw-item-small">
                <div className="sw-img-wrap">
                  <img
                    src={SELECTED_WORK[2].src}
                    alt={SELECTED_WORK[2].alt}
                    className="sw-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="sw-img-overlay">
                    <span className="sw-label">{SELECTED_WORK[2].label}</span>
                    <span className="sw-tier">{SELECTED_WORK[2].tier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wide bottom */}
            <div className="sw-item sw-item-wide">
              <div className="sw-img-wrap">
                <img
                  src={SELECTED_WORK[3].src}
                  alt={SELECTED_WORK[3].alt}
                  className="sw-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="sw-img-overlay">
                  <span className="sw-label">{SELECTED_WORK[3].label}</span>
                  <span className="sw-tier">{SELECTED_WORK[3].tier}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="sw-footnote">
            All work is original. No flash references. No stock designs. Every piece is drawn specifically for each client.
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. BRAND / ARTIST INTRODUCTION — Editorial split
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="home-intro-section" ref={introRef} data-reveal>
        {/* Full-width dark section with subtle warm tone */}
        <div className="hi-layout section-container">

          {/* Text Column */}
          <div className="hi-text-col">
            <p className="section-label">The Discipline</p>
            <h2 className="hi-heading">
              One artist.<br />
              <span className="gold-text">No compromises.</span>
            </h2>
            <div className="hi-body">
              <p>
                MDP TATTOOS is not a commercial studio. It is a private practice built on the
                conviction that body art deserves complete, undivided technical attention.
                One client. One session. One standard.
              </p>
              <p>
                Every tattoo begins with a design consultation before any ink is placed.
                Placement, skin tone, anatomy, and personal narrative are all considered.
                The result is work that ages with intention.
              </p>
            </div>
            <div className="hi-pillars">
              <div className="hi-pillar">
                <ShieldCheck size={16} className="gold-icon" aria-hidden="true" />
                <span>Sterile clinical protocols. Single-use needles only.</span>
              </div>
              <div className="hi-pillar">
                <ShieldCheck size={16} className="gold-icon" aria-hidden="true" />
                <span>Zero walk-ins. Fully private sessions.</span>
              </div>
              <div className="hi-pillar">
                <ShieldCheck size={16} className="gold-icon" aria-hidden="true" />
                <span>Every piece drafted from scratch for each client.</span>
              </div>
            </div>
            <Link to="/about" className="hi-link">
              Read About MDP <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Image Column */}
          <div className="hi-img-col">
            <div className="hi-img-frame">
              <img
                src="https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=800&q=85"
                alt="Tattoo artist at work in private studio"
                className="hi-img"
                loading="lazy"
                decoding="async"
              />
              <div className="hi-img-caption">
                <span className="hic-label">Private session in progress</span>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="hi-accent-block">
              <span className="hi-accent-text">"YOUR STORY. PERMANENTLY EXPRESSED."</span>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. TATTOO STYLE PREVIEW — Editorial with imagery
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="home-styles-preview" ref={stylesRef} data-reveal>
        <div className="section-container">
          <div className="sp-header">
            <div>
              <p className="section-label">Specialisations</p>
              <h2 className="section-heading">Signature Styles</h2>
            </div>
            <Link to="/tattoo-styles" className="sw-view-all">
              All 20 Styles <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="sp-list">
            {STYLE_PREVIEW.map((style, i) => (
              <div className="sp-item" key={i}>
                <div className="sp-img-wrap">
                  <img
                    src={style.imgSrc}
                    alt={style.imgAlt}
                    className="sp-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="sp-text">
                  <span className="sp-tier-badge">{style.tier}</span>
                  <h3 className="sp-title">{style.title}</h3>
                  <p className="sp-desc">{style.desc}</p>
                  <Link to="/tattoo-styles" className="sp-link">
                    Explore <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. FINAL BOOKING CTA — Full-bleed dark visual
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="home-final-cta" ref={finalCtaRef} data-reveal>
        {/* Background: tattoo process image with dark overlay */}
        <div className="hfc-bg" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="hfc-bg-img"
            loading="lazy"
            decoding="async"
          />
          <div className="hfc-bg-overlay" />
        </div>

        <div className="hfc-content section-container">
          <p className="section-label" style={{ color: 'rgba(197,168,128,0.9)' }}>Appointments Open</p>
          <h2 className="hfc-heading">Book Your Next Tattoo</h2>
          <p className="hfc-sub">
            Real-time availability. Confirmed into our database. Sent directly to the artist's WhatsApp.
            Open 7 days a week — reserve now while slots are open.
          </p>
          <div className="hfc-actions">
            <Link to="/book" className="btn-primary-hero hfc-btn">
              <Calendar size={16} aria-hidden="true" />
              <span>BOOK AN APPOINTMENT</span>
            </Link>
            <Link to="/tattoo-styles" className="btn-ghost-hero hfc-btn-secondary">
              <span>EXPLORE STYLES</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <p className="hfc-note">
            <Clock size={12} aria-hidden="true" />
            Monday–Sunday · 9 AM–9 PM · No walk-ins
          </p>
        </div>
      </section>

    </div>
  );
};
