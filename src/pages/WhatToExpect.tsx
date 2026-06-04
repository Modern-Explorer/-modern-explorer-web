import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

const sections = [
  {
    icon: '📍',
    title: 'Meeting Location',
    body: `Tours meet at a designated point in central Crestone — exact coordinates and parking instructions are included in your confirmation email after booking. We recommend arriving 10–15 minutes early.\n\nCrestone is located at the base of the Sangre de Cristo Mountains in the San Luis Valley, approximately 4 hours from Denver and 3 hours from Colorado Springs. A GPS signal can be inconsistent in the area — we'll send what3words coordinates as a backup.\n\nLimited parking is available near the meeting point. If you're coming from out of town, the nearest overnight accommodations are in Crestone itself or in Moffat, 15 miles west.`,
  },
  {
    icon: '🎒',
    title: 'What to Bring',
    body: `Comfortable closed-toe shoes or hiking boots — the terrain is unpaved in sections. No technical footwear required for the standard walking tour.\n\nWater: minimum 16–32 oz per person. Even on a 60-minute tour, staying hydrated at 7,900 feet matters.\n\nA light layer. Mountain weather moves fast — a jacket or long-sleeve is wise even in summer. Mornings and evenings can drop 20–30°F from the afternoon high.\n\nSunscreen and sunglasses. At high altitude, UV exposure is significantly stronger than at sea level.\n\nYour phone for photos. We don't restrict photography — we encourage it.\n\nAnything else you need will be covered in your booking confirmation.`,
  },
  {
    icon: '⛅',
    title: 'Weather at 7,900 Feet',
    body: `Crestone sits at 7,930 feet elevation. The weather here behaves differently than lower elevations, and it's worth understanding before you come.\n\nAfternoon thunderstorms are common from June through August, typically building by 2–3 PM. Our tours are scheduled with this in mind — most morning and midday tours complete before afternoon weather arrives.\n\nTemperature swings of 30°F in a single day are normal. A 75°F afternoon can drop to 45°F by sunset. Bring layers regardless of the forecast.\n\nSnow is possible at any time of year above 10,000 feet, and light snow can occur in Crestone itself in early spring and late fall.\n\nIf we need to cancel due to dangerous weather, you will be notified at least 2 hours before your tour start time and offered a full refund or reschedule at no charge.`,
  },
  {
    icon: '👥',
    title: 'Group Size',
    body: `Tours run with a minimum of 2 and a maximum of 12 participants. This is a deliberate choice, not a logistical limitation.\n\nSmall groups mean you can actually hear the guide. You can ask questions without holding up the group. You can stop to look at something without the momentum of 30 people pushing you past it. The quality of the experience is meaningfully different at this scale.\n\nIf your group is larger than 12, contact us to arrange a private or split-group booking.`,
  },
  {
    icon: '⏱',
    title: 'Duration',
    body: `The Crestone Walking Tour runs 45–60 minutes. Plan for 75 minutes total to allow for travel to the meeting point, the tour itself, and a few minutes at the end for questions.\n\nSpecialty tours and field research expeditions have different durations — see individual tour listings for specifics.\n\nWe don't rush. If a location warrants more time, we take it.`,
  },
  {
    icon: '♿',
    title: 'Accessibility',
    body: `Our current routes are on unpaved terrain with some uneven surfaces. The walking tour is not currently accessible for wheelchairs or mobility devices.\n\nIf you have a mobility consideration, contact us before booking. We'll be honest about what the terrain involves and whether we can accommodate your situation. We'd rather have that conversation upfront than have you arrive to something that doesn't work for you.`,
  },
  {
    icon: '🧒',
    title: 'Age Requirements',
    body: `Most tours are appropriate for ages 10 and up when accompanied by an adult. Children tend to engage well with the history, the landscape, and the mystery angle — it's good content for curious kids.\n\nSome wilderness and night-specific tours are 16+ only. Check individual tour listings.\n\nThere is no upper age limit. We've had participants in their 80s and they've been some of the most engaged people on the tour.`,
  },
  {
    icon: '📷',
    title: 'Photography',
    body: `Photography and video are encouraged throughout the tour. If you capture something unusual — light anomalies, objects you can't identify, anything that seems out of place — share it with us. We document everything.\n\nWe may photograph or film tours for our own documentation and social media. If you prefer not to be photographed, let your guide know at the start of the tour and we'll make sure you're excluded from any shots.`,
  },
];

export default function WhatToExpect() {
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="What to Expect | Modern Explorer — Crestone, Colorado Tours"
        description="Everything you need to know before your Modern Explorer tour in Crestone, Colorado. Meeting location, what to bring, weather, group size, duration, and accessibility."
        url="/what-to-expect"
      />

      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/content/Crestone/20250810_090447-EDIT.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-section))' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">Before You Arrive</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>What to Expect</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65 }}>
            Everything you need to know before your expedition — location, gear, weather, and what the experience actually involves.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {sections.map(s => (
              <div key={s.title} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 28, alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--bg-section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: 22, marginBottom: 14, letterSpacing: '0.01em' }}>{s.title}</h2>
                  {s.body.split('\n\n').map((para, i) => (
                    <p key={i} style={{ fontFamily: 'var(--font-alt)', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 14 }}>
                      {para}
                    </p>
                  ))}
                  <div style={{ height: 1, background: 'var(--border)', marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 72, padding: '40px', background: 'var(--bg-section)', border: '1px solid var(--border-accent)', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ fontSize: 28, marginBottom: 12 }}>Ready to go?</h3>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, marginBottom: 28, lineHeight: 1.65, maxWidth: 420, margin: '0 auto 28px' }}>
              Questions not answered here? Contact us before booking and we'll make sure you have everything you need.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 15 }}>Book a Tour</a>
              <a href="/contact" className="btn btn-ghost" style={{ fontSize: 15 }}>Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
