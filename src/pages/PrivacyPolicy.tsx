import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const updated = 'June 7, 2026';
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Privacy Policy | Modern Explorer"
        description="Privacy policy for Modern Explorer — how we collect, use, and protect your personal information."
        url="/privacy-policy"
      />
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 48 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 12 }}>Privacy Policy</h1>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)' }}>Last updated: {updated}</p>
          </div>

          {[
            {
              h: '1. Who We Are',
              body: `Modern Explorer is a guided tour company based in Crestone, Colorado. We operate immersive small-group tours in the San Luis Valley and surrounding Sangre de Cristo mountains. Our website is modernexplorer.me. You can reach us at hello@modernexplorer.me or (719) 331-4200.`,
            },
            {
              h: '2. Information We Collect',
              body: `When you book a tour through our booking platform, we collect your name, email address, phone number (optional), and payment information. Payment is processed securely by Stripe — we do not store your payment card details on our servers.\n\nWhen you contact us through the site form, we receive your name, email address, phone number (optional), and the content of your message. This is sent directly to our email and not stored in a database.\n\nWhen you visit our website, Google Analytics 4 collects anonymized usage data including pages visited, session duration, and general geographic region. This data does not identify you personally. You can opt out using the Google Analytics Opt-out Browser Add-on.`,
            },
            {
              h: '3. How We Use Your Information',
              body: `We use your contact information to confirm bookings, send pre-tour information (meeting location, what to bring), communicate any changes to your booking, and respond to your inquiries.\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes.\n\nPayment processing is handled by Stripe, which maintains PCI DSS compliance. Stripe's privacy policy is available at stripe.com/privacy.`,
            },
            {
              h: '4. Email and SMS Communications',
              body: `If you book a tour, you will receive transactional emails confirming your reservation, meeting point details, and pre-tour instructions. We do not add you to a marketing list without your explicit consent.\n\nIf you provide a phone number and opt in during booking, we may send SMS notifications about your booking — including confirmation, reminders, and day-of updates. Message and data rates may apply. You can opt out at any time by replying STOP to any SMS we send. For help, reply HELP. We do not use your phone number for marketing or share it with third parties.`,
            },
            {
              h: '5. Cookies',
              body: `Our website uses cookies for Google Analytics (analytics and performance measurement). These cookies do not identify you personally. By using our website, you consent to the use of these cookies. You can control cookies through your browser settings.`,
            },
            {
              h: '6. Data Retention',
              body: `Booking records are retained for a minimum of 3 years for accounting and legal purposes. Contact form submissions are retained in our email system until manually deleted. Analytics data is retained according to Google Analytics' standard retention settings (26 months by default).`,
            },
            {
              h: '7. Your Rights',
              body: `You have the right to request access to the personal data we hold about you, request correction of inaccurate data, and request deletion of your data where we are not legally required to retain it. To exercise any of these rights, contact us at hello@modernexplorer.me.`,
            },
            {
              h: '8. Security',
              body: `We take reasonable precautions to protect your personal information. Our website uses HTTPS encryption. Payment processing is handled entirely by Stripe, which maintains PCI DSS compliance. We do not store payment card information on our servers. Our booking system stores customer names, email addresses, and booking details in a secured database.`,
            },
            {
              h: '9. Children',
              body: `Our website is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us and we will delete it promptly.`,
            },
            {
              h: '10. Changes to This Policy',
              body: `We may update this privacy policy from time to time. When we do, we will update the "last updated" date at the top of this page. Continued use of our website after any changes constitutes your acceptance of the updated policy.`,
            },
            {
              h: '11. Contact',
              body: `For any questions about this privacy policy or our data practices, contact us at:\n\nModern Explorer\nCrestone, Colorado 81131\nhello@modernexplorer.me\n(719) 331-4200`,
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
        </div>
      </section>
    </main>
  );
}
