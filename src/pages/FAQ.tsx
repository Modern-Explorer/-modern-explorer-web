import { useState } from 'react';
import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

const faqs = [
  {
    category: 'Tours & Booking',
    items: [
      { q: 'How do I book a tour?', a: 'All tour reservations are handled through FareHarbor. Click any "Book a Tour" button on the site and you\'ll be taken directly to the booking calendar. You can filter by tour type, date, and group size.' },
      { q: 'How many people are on each tour?', a: 'We keep groups small—typically 6 to 12 participants. This is intentional. Small groups mean more access, more conversation with your guide, and a better overall experience.' },
      { q: 'What is your cancellation policy?', a: 'Full refunds are available up to 72 hours before your tour. Cancellations within 72 hours may be rescheduled but are not eligible for a refund. Weather-related cancellations initiated by us are always fully refunded or rescheduled.' },
      { q: 'Can I book a private group tour?', a: 'Yes. We offer private bookings for groups of 4 or more. Contact us directly to discuss custom itineraries, dates, and pricing.' },
      { q: 'Do you offer gift cards or gift bookings?', a: 'Not yet, but this is on our roadmap. Sign up on the Coming Soon page and we\'ll notify you when gift options are available.' },
    ],
  },
  {
    category: 'What to Expect',
    items: [
      { q: 'What should I wear and bring?', a: 'Comfortable hiking shoes or boots are strongly recommended. Bring water (at least 32oz), a light snack, sunscreen, and a layer for temperature changes. Colorado weather shifts fast—even on summer tours, a light jacket is wise. We\'ll send a full gear list after booking.' },
      { q: 'How strenuous are the tours?', a: 'Most of our walking tours involve 2–5 miles of terrain ranging from easy to moderate. Wilderness trips and field research expeditions are more demanding and may involve significant elevation gain. Each tour listing includes a difficulty rating.' },
      { q: 'What\'s the minimum age for tours?', a: 'Most tours are suitable for ages 10 and up when accompanied by an adult. Some wilderness and night tours are for ages 16+ only. Check individual tour listings for specifics.' },
      { q: 'Are tours wheelchair or mobility-accessible?', a: 'Our current routes are not fully accessible for wheelchairs or mobility devices due to the terrain. We\'re actively working on developing accessible experiences. Contact us and we\'ll do our best to accommodate your situation.' },
    ],
  },
  {
    category: 'The Experience',
    items: [
      { q: 'How much of the tour is actually about cryptids and the paranormal?', a: 'It varies by tour. All of our tours blend local history, geology, and folklore—the "unexplained" is one thread among many. We\'re not performance entertainers; we take the subject seriously and present what is documented without sensationalism.' },
      { q: 'Are these tours "scary"?', a: 'Not intentionally. Our guides are knowledgeable and grounded. You\'ll hear genuinely strange and thought-provoking stories, but we prioritize curiosity over fear. If you\'re looking for a haunted house experience, this probably isn\'t it.' },
      { q: 'What happens if nothing unusual is observed on a tour?', a: 'You still get a great hike, real local history, and a good story. We never manufacture experiences or create false anomalies. The authenticity is the point—and honestly, most tours surface something interesting regardless.' },
      { q: 'Do you share your field research findings publicly?', a: 'Yes, through our Field Reports section and eventually through our forthcoming podcast and database. We believe in open documentation. Nothing gets locked behind a paywall.' },
    ],
  },
  {
    category: 'Practical Info',
    items: [
      { q: 'Where do tours start? Is parking available?', a: 'Tour meeting points vary by route. All details including exact location, parking instructions, and what3words coordinates are included in your confirmation email. We recommend arriving 10–15 minutes early.' },
      { q: 'Is there cell service at tour locations?', a: 'Some areas have spotty or no cell coverage. We operate with satellite communication on wilderness expeditions. If you have a condition that requires reliable emergency contact, let us know and we\'ll plan accordingly.' },
      { q: 'Do you offer tours year-round?', a: 'Currently our walking tours run spring through fall (April–October). Winter tours and specialty events are in development. Sign up for updates to be notified when winter offerings launch.' },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(o => o === key ? null : key);

  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="FAQ | Modern Explorer — Crestone, Colorado Tours"
        description="Frequently asked questions about Modern Explorer guided tours in Crestone, Colorado. What to expect, how to book, group sizes, difficulty, and what makes the San Luis Valley and Sangre de Cristo mountains unique."
        url="/faq"
      />
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/content/Nature/20250510_091707-EDIT.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div className="container-narrow" style={{ position: 'relative' }}>
          <span className="eyebrow">Got Questions?</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Frequently Asked<br />Questions</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65 }}>
            Everything you need to know before your first expedition. Don't see your answer? <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Contact us directly.</a>
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="section">
        <div className="container-narrow">
          {faqs.map(section => (
            <div key={section.category} style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span className="tag">{section.category}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map((item, idx) => {
                  const key = `${section.category}-${idx}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} style={{ background: 'var(--bg-card)', border: `1px solid ${isOpen ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 4, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                      <button
                        onClick={() => toggle(key)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: isOpen ? 'var(--accent)' : 'var(--text)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', paddingRight: 16, lineHeight: 1.25 }}>
                          {item.q}
                        </span>
                        <span style={{ color: isOpen ? 'var(--accent)' : 'var(--text-dim)', fontSize: 20, flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 24px 24px' }}>
                          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-alt)', fontSize: 15, lineHeight: 1.75 }}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 16 }}>Still Have Questions?</h2>
          <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, maxWidth: 480, margin: '0 auto 36px' }}>
            We're a small team and we read every message. Reach out and we'll get back to you within 48 hours.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" className="btn btn-outline" style={{ fontSize: 14 }}>Contact Us</a>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 14 }}>Book a Tour</a>
          </div>
        </div>
      </section>
    </main>
  );
}
