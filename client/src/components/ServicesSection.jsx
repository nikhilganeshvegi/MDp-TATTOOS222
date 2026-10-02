import React from 'react';

const SERVICES = [
  {
    number: '01',
    title: 'Custom Tattoo Design',
    body:
      'Every tattoo begins as an original drawing. Reference images, mood boards, and your personal direction are incorporated into a design made exclusively for your body and placement.',
  },
  {
    number: '02',
    title: 'Tattoo Consultation',
    body:
      'Before any booking is confirmed, a consultation ensures the design intent, size, placement, and style are fully aligned. No guesswork, no surprises on the day.',
  },
  {
    number: '03',
    title: 'Tattoo Sessions',
    body:
      'Sessions are conducted one client at a time in a clean, private studio space. Timing follows the complexity of the work — not an arbitrary hourly rate or quota.',
  },
  {
    number: '04',
    title: 'Cover-Up Work',
    body:
      'Old, unwanted, or poorly aged tattoos can often be transformed into something considered and intentional. Cover-up consultations assess the original tattoo before any commitment is made.',
  },
  {
    number: '05',
    title: 'Aftercare Guidance',
    body:
      'Clear, written aftercare instructions are provided with every session. Long-term care advice is available and healing questions are always welcome.',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="services-section">
      <div className="section-container">

        <div className="services-header">
          <p className="section-label">What We Offer</p>
          <h2 className="section-heading">Services</h2>
        </div>

        <div className="services-layout">
          <div className="services-intro-col">
            <p className="services-intro-text">
              The studio offers a complete tattooing experience — from the first idea
              to healed skin. Every service listed below is carried out by the same
              artist, maintaining continuity and craft throughout.
            </p>
            <div className="services-availability">
              <span className="availability-dot" aria-hidden="true" />
              <span>Accepting new clients — book through the form below</span>
            </div>
          </div>

          <div className="services-list-col">
            {SERVICES.map((svc, idx) => (
              <div key={svc.number} className="service-row">
                <div className="service-row-top">
                  <span className="service-number">{svc.number}</span>
                  <h3 className="service-title">{svc.title}</h3>
                </div>
                <p className="service-body">{svc.body}</p>
                {idx < SERVICES.length - 1 && (
                  <div className="service-divider" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
