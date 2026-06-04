import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

export default function Terms() {
  const updated = 'June 4, 2026';
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Terms of Service | Modern Explorer"
        description="Terms and conditions for booking and participating in Modern Explorer guided tours in Crestone, Colorado."
        url="/terms"
      />
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 48 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 12 }}>Terms of Service</h1>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)' }}>Last updated: {updated}</p>
          </div>

          {[
            {
              h: '1. Acceptance of Terms',
              body: `By booking a tour with Modern Explorer, you agree to these terms and conditions. If you do not agree, please do not complete your booking. These terms apply to all tours, expeditions, and events operated by Modern Explorer in Crestone, Colorado and the San Luis Valley.`,
            },
            {
              h: '2. Booking and Payment',
              body: `All bookings are processed through FareHarbor. Your booking is confirmed when you receive a confirmation email from FareHarbor. Payment is required in full at the time of booking.\n\nPrices are as listed on the booking platform at the time of your reservation. Modern Explorer reserves the right to update pricing with reasonable advance notice.`,
            },
            {
              h: '3. Cancellation and Refund Policy',
              body: `You may cancel your reservation for a full refund up to 72 hours before your scheduled tour start time. Cancellations made within 72 hours of the tour are not eligible for a refund but may be rescheduled to a future date subject to availability.\n\nTo cancel, email us at admin@modernexplorer.me or use the cancellation link in your FareHarbor confirmation email.\n\nIf Modern Explorer cancels a tour for any reason — including weather, unsafe conditions, or insufficient participants — you will receive a full refund or the option to reschedule at no charge.`,
            },
            {
              h: '4. Weather Policy',
              body: `Tours operate in most weather conditions. Crestone weather can change quickly; please dress and prepare accordingly (see our What to Expect guide).\n\nWe reserve the right to cancel or modify any tour due to severe weather, lightning, flash flood warnings, or other hazardous conditions. The safety determination is made by the guide at the time of the tour. If we cancel due to weather, you will receive a full refund or reschedule option.\n\nWe do not cancel for light rain or mild weather. Come prepared.`,
            },
            {
              h: '5. Physical Requirements and Health',
              body: `Participants are responsible for ensuring they are physically capable of completing the tour they have booked. Most walking tours cover 2–5 miles on mixed terrain including unpaved surfaces, uneven ground, and some elevation change.\n\nIf you have a health condition, injury, or physical limitation that may affect your participation, contact us before booking. We will provide honest information about terrain and physical demands.\n\nParticipants with severe heart conditions, serious mobility limitations, or other medical conditions that could be aggravated by moderate outdoor activity should consult a physician before booking.\n\nModern Explorer is not responsible for injuries resulting from pre-existing medical conditions or from participants exceeding their physical capabilities.`,
            },
            {
              h: '6. Assumption of Risk and Liability Waiver',
              body: `Outdoor activities involve inherent risks including uneven terrain, weather changes, altitude effects, wildlife encounters, and the general unpredictability of natural environments. By booking a tour, you acknowledge and accept these risks.\n\nModern Explorer carries liability insurance appropriate to our activities. However, Modern Explorer is not liable for personal injury, property damage, or loss arising from participation in tours, except where caused by gross negligence or intentional misconduct on the part of our guides.\n\nWilderness expeditions and multi-day field research operations involve elevated physical risk. These are clearly described as strenuous, technically demanding, and uncharted. Participants are required to acknowledge this risk explicitly at the time of booking.`,
            },
            {
              h: '7. Age Requirements',
              body: `Standard walking tours are appropriate for ages 10 and up when accompanied by a participating adult. The adult is responsible for the child's conduct and safety throughout the tour.\n\nCertain specialty tours, night tours, and wilderness expeditions are restricted to participants 16 years of age or older. Age restrictions are listed on individual tour pages. Proof of age may be requested.`,
            },
            {
              h: '8. Photography and Media',
              body: `Modern Explorer may photograph or video tours for use in our marketing materials, website, and social media. By participating in a tour, you grant Modern Explorer a non-exclusive, royalty-free license to use images and video in which you appear for these purposes.\n\nIf you prefer not to be photographed, notify your guide at the beginning of the tour. We will make reasonable efforts to exclude you from photographs and video.\n\nParticipants are welcome to photograph and film during tours for personal use. Sharing your experiences on social media is encouraged — tag us @modern._explorer.`,
            },
            {
              h: '9. Conduct',
              body: `We ask that all participants treat each other, our guides, and the land with respect. Modern Explorer reserves the right to remove a participant from a tour, without refund, for disruptive, threatening, or dangerous behavior.\n\nNo alcohol or controlled substances before or during tours. Crestone and the surrounding land deserve full presence.`,
            },
            {
              h: '10. Intellectual Property',
              body: `All content on this website — including text, photographs, video, field reports, and research — is owned by Modern Explorer or licensed to us. You may not reproduce, distribute, or use our content without explicit written permission.`,
            },
            {
              h: '11. Governing Law',
              body: `These terms are governed by the laws of the State of Colorado. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Saguache County, Colorado.`,
            },
            {
              h: '12. Contact',
              body: `For questions about these terms, contact us at:\n\nModern Explorer\nCrestone, Colorado 81131\nadmin@modernexplorer.me\n(719) 331-4200`,
            },
          ].map(s => (
            <div key={s.h} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>{s.h}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>{para}</p>
              ))}
              <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
            </div>
          ))}

          <div style={{ marginTop: 48, padding: '28px 32px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
              By proceeding with a booking you confirm that you have read, understood, and agree to these terms of service.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 13 }}>
              Book a Tour
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
