import SEO from '../components/SEO';
import { useBooking } from '../context/BookingContext';

export default function Terms() {
  const { open: openBooking } = useBooking();
  const updated = 'August 27, 2026';
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Terms of Service | Modern Explorer"
        description="Terms and conditions for booking and joining Modern Explorer guided tours — payments, cancellations, waivers, and participant responsibilities."
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
              body: `These terms govern your use of the Modern Explorer LLC website at modernexplorer.me, any tours or events you book through it, and — if applicable — the Dispatch social-media publishing tool. By using the site or booking a tour you agree to these terms. If you do not agree, please do not use our services.`,
            },
            {
              h: '2. Booking and Payment',
              body: `All bookings are made through our booking system at modernexplorer.me. Your booking is confirmed when you receive a confirmation email to the address you provided. Payment is required in full at the time of booking and is processed securely by Stripe.\n\nPrices are as listed on the booking platform at the time of your reservation. Modern Explorer reserves the right to update pricing with reasonable advance notice.`,
            },
            {
              h: '3. Cancellation and Refund Policy',
              body: `You may cancel your reservation for a full refund up to 48 hours before your scheduled tour start time. Cancellations made less than 48 hours before the tour are eligible for a refund of 50% of the total amount paid. No refund is issued for no-shows (failure to appear without prior notification).\n\nTo cancel, email us at hello@modernexplorer.me with your confirmation code.\n\nIf Modern Explorer cancels a tour for any reason — including weather, unsafe conditions, or insufficient participants — you will receive a full refund or the option to reschedule at no charge.\n\nThese terms mirror the cancellation policy in the Participant Agreement & Liability Waiver you accept at booking; if the two ever differ, the Waiver controls.`,
            },
            {
              h: '4. Weather Policy',
              body: `Tours operate in most weather conditions. Crestone weather can change quickly; please dress and prepare accordingly (see our What to Expect guide).\n\nWe reserve the right to cancel or modify any tour due to severe weather, lightning, flash flood warnings, or other hazardous conditions. The safety determination is made by the guide at the time of the tour. If we cancel due to weather, you will receive a full refund or reschedule option.\n\nWe do not cancel for light rain or mild weather. Come prepared.`,
            },
            {
              h: '5. Physical Requirements and Health',
              body: `Participants are responsible for ensuring they are physically capable of completing the tour they have booked. Standard walking tours cover approximately 0.5 to 1.5 miles on foot over uneven terrain, unpaved surfaces, and natural ground, at a high-altitude elevation of roughly 7,930 feet above sea level in Crestone, Colorado. Longer expeditions are more strenuous and are described individually.\n\nIf you have a health condition, injury, or physical limitation that may affect your participation, contact us before booking. We will provide honest information about terrain and physical demands.\n\nParticipants with pre-existing cardiac, pulmonary, neurological, or circulatory conditions, or other conditions that could be aggravated by exertion at altitude, should consult a physician before booking.\n\nModern Explorer is not responsible for injuries resulting from pre-existing medical conditions or from participants exceeding their physical capabilities.`,
            },
            {
              h: '6. Assumption of Risk and Liability Waiver',
              body: `Outdoor activities involve inherent risks including uneven terrain, rapid weather changes, high-altitude effects and Acute Mountain Sickness, dehydration, wildlife encounters (including venomous snakes), hantavirus exposure, wildfire and smoke, flash flooding in drainages and arroyos, and the general unpredictability of natural environments. By booking a tour, you acknowledge and accept these risks.\n\nThe binding release of liability, assumption of risk, and indemnification terms are contained in the Participant Agreement & Liability Waiver you accept at the time of booking. Nothing in that agreement waives claims for gross negligence, reckless conduct, or willful or wanton misconduct. Bookings that include a participant under 18 require a parent or legal guardian to accept a Minor Participant Addendum at booking.\n\nModern Explorer carries liability insurance appropriate to our activities. Wilderness expeditions and multi-day field research operations involve elevated physical risk; these are clearly described as strenuous, technically demanding, and uncharted, and participants acknowledge this risk explicitly at the time of booking.`,
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
              h: '11. Dispatch Social Publishing Tool',
              body: `Dispatch is an internal tool that allows Modern Explorer LLC to schedule and publish content to its own Facebook and Instagram pages via the Meta Graph API. Access to Dispatch is restricted to Modern Explorer staff and authorised contractors.\n\nBy connecting a Facebook page to Dispatch you grant Modern Explorer permission to publish posts and read Page-level insights on your behalf. You may revoke this access at any time through Facebook Settings → Apps and Websites. We use the access solely to manage our own social-media presence and never to access or collect data from your followers or other Facebook users.\n\nUse of Dispatch is subject to Meta's Platform Terms (facebook.com/terms/platformterms) and our Privacy Policy.`,
            },
            {
              h: '12. Governing Law',
              body: `These terms are governed by the laws of the State of Colorado. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Saguache County, Colorado.`,
            },
            {
              h: '13. Contact',
              body: `For questions about these terms, contact us at:\n\nModern Explorer\nCrestone, Colorado 81131\nhello@modernexplorer.me\n(719) 331-4200`,
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
            <button onClick={openBooking} className="btn btn-primary" style={{ fontSize: 13 }}>
              Book a Tour
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
