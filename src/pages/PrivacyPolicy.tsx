import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const updated = 'August 27, 2026';
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Privacy Policy | Modern Explorer"
        description="How Modern Explorer LLC collects, uses, and protects your information on our website and through the Dispatch social publishing app."
        url="/privacy"
      />
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 48 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 12 }}>Privacy Policy</h1>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)' }}>Effective date: {updated}</p>
          </div>

          {[
            {
              h: '1. Who We Are',
              body: `Modern Explorer LLC is a guided tour company based in Crestone, Colorado. We operate immersive small-group tours in the San Luis Valley and surrounding Sangre de Cristo mountains. We also operate Dispatch, an internal social-media publishing tool (Meta app "Dispatch", app ID 1102758728980963) used to schedule and publish content to our own Facebook and Instagram pages.\n\nThis policy covers our public website at modernexplorer.me and the Dispatch social publishing tool. It does not cover third-party websites or services we link to. Contact us at admin@modernexplorer.me with any questions.`,
            },
            {
              h: '2. What We Collect',
              body: `**Website and booking.** When you book a tour we collect your name, email address, phone number (optional), and payment details. Payment is processed by Stripe — we do not store card numbers on our servers. When you use the contact form we receive your name, email, phone number (optional), and message content, which is sent directly to our email. Google Analytics 4 collects anonymised usage data (pages visited, session duration, general region) that does not identify you personally.\n\n**Dispatch / social publishing app.** When you connect a Facebook or Instagram account to Dispatch, we store: your Facebook account name, the page IDs of pages you grant us access to, and the access tokens needed to publish content and read Page insights on your behalf. We do not collect profile pictures, friend lists, messages, or any personal data belonging to your followers or other Facebook users. Only data necessary to operate the publishing workflow is accessed.`,
            },
            {
              h: '3. How We Use Your Information',
              body: `**Website and booking.** We use your contact details to confirm bookings, send pre-tour information, communicate changes, and respond to enquiries. We do not sell, rent, or share personal information for marketing purposes.\n\n**Dispatch.** We use the Facebook access tokens and page IDs solely to: (a) publish scheduled posts to our own Facebook and Instagram pages, and (b) read Page-level insights (reach, engagement) for our own pages. We do not use this access to view, collect, or process any data from other Facebook users or pages.`,
            },
            {
              h: '4. Email and SMS',
              body: `If you book a tour you will receive transactional emails confirming your reservation, meeting-point details, and pre-tour instructions. We do not add you to a marketing list without your explicit consent.\n\nIf you provide a phone number and opt in during booking, we may send SMS booking notifications via Twilio (confirmation, reminders, day-of updates). Message and data rates may apply. Reply STOP to opt out at any time; reply HELP for assistance. We do not use your number for marketing or share it with third parties.`,
            },
            {
              h: '5. Storage and Security',
              body: `Our platform is self-hosted on a DigitalOcean server in New York. All data is encrypted in transit via HTTPS/TLS. Database storage is encrypted at rest. Facebook access tokens are stored encrypted and are never logged in plaintext.\n\nPayment processing is handled entirely by Stripe (PCI DSS compliant). We do not store card information on our servers.`,
            },
            {
              h: '6. Cookies',
              body: `Our website uses cookies for Google Analytics (performance measurement). These cookies do not identify you personally. By using our website you consent to these cookies. You can control or delete cookies through your browser settings.`,
            },
            {
              h: '7. Third-Party Services',
              body: `We share data with the following third parties only to the extent necessary to operate our services:\n\n• Meta (Facebook / Instagram) — to publish content and read insights via the Graph API.\n• Stripe — to process tour booking payments.\n• Twilio — to send SMS booking notifications.\n• AWS SES — to deliver transactional email.\n\nEach of these services has its own privacy policy. We do not sell data to any third party.`,
            },
            {
              h: '8. Data Retention',
              body: `Booking records are retained for a minimum of three years for accounting and legal purposes. Contact form submissions are retained in our email system until manually deleted. Facebook access tokens are retained until you revoke access via Facebook's App Settings or contact us to remove them. Analytics data follows Google Analytics' default retention of 26 months.`,
            },
            {
              h: '9. Your Rights',
              body: `You have the right to request access to the personal data we hold about you, request correction of inaccurate data, and request deletion of your data where we are not legally required to retain it.\n\nTo revoke Dispatch's access to your Facebook pages, visit Facebook Settings → Apps and Websites → Dispatch, and remove the app. To request deletion of any data we hold, email admin@modernexplorer.me with the subject "Data deletion request." We will confirm within 7 days and complete deletion within 30 days.`,
            },
            {
              h: '10. Children',
              body: `Our website and tools are not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have done so inadvertently, please contact us and we will delete it promptly.`,
            },
            {
              h: '11. Changes to This Policy',
              body: `We may update this policy periodically. When we do, we update the effective date above. Continued use of our website or Dispatch after changes constitutes acceptance of the updated policy.`,
            },
            {
              h: '12. Contact',
              body: `Modern Explorer LLC\nCrestone, Colorado 81131\nadmin@modernexplorer.me\n(719) 331-4200`,
            },
          ].map(s => (
            <div key={s.h} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>{s.h}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>
                  {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
              <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
