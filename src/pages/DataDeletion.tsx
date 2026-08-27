import SEO from '../components/SEO';

export default function DataDeletion() {
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Data Deletion Instructions | Modern Explorer"
        description="Instructions for requesting deletion of data Modern Explorer holds in connection with your Facebook account or use of the Dispatch app."
        url="/data-deletion"
      />
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 48 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 12 }}>Data Deletion Instructions</h1>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              This page explains how to request deletion of any data Modern Explorer LLC holds in connection with your Facebook account or use of the Dispatch social publishing app (Meta app ID: 1102758728980963).
            </p>
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>What data we hold</h2>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>
              When a Facebook page is connected to Dispatch, we store the account name, page IDs, and access tokens needed to publish content and read Page insights on behalf of Modern Explorer LLC. We do not store personal data from other Facebook users.
            </p>
            <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>How to revoke app access immediately</h2>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>
              You can revoke Dispatch's access to your Facebook pages at any time without contacting us:
            </p>
            <ol style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 2, paddingLeft: 24, marginBottom: 12 }}>
              <li>Go to <strong style={{ color: 'var(--text)' }}>Facebook Settings → Security and Login → Apps and Websites</strong>.</li>
              <li>Find <strong style={{ color: 'var(--text)' }}>Dispatch</strong> in the list.</li>
              <li>Click <strong style={{ color: 'var(--text)' }}>Remove</strong>.</li>
            </ol>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Revoking access invalidates the stored access token immediately.
            </p>
            <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>How to request data deletion</h2>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>
              To request deletion of all data we hold associated with your Facebook account:
            </p>
            <ol style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 2, paddingLeft: 24, marginBottom: 12 }}>
              <li>Send an email to <strong style={{ color: 'var(--text)' }}>admin@modernexplorer.me</strong>.</li>
              <li>Use the subject line: <strong style={{ color: 'var(--text)' }}>Data deletion request</strong>.</li>
              <li>Include your Facebook account name or page name so we can locate your records.</li>
            </ol>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              We will send a confirmation within <strong style={{ color: 'var(--text)' }}>7 days</strong> and complete deletion within <strong style={{ color: 'var(--text)' }}>30 days</strong> of receiving your request.
            </p>
            <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>Questions</h2>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              For any other privacy-related questions, see our{' '}
              <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
              or contact us at admin@modernexplorer.me.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
