import SEO from '../components/SEO';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

export default function MerchStore() {
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Store | Modern Explorer — Gear for Explorers"
        description="Modern Explorer merchandise. Apparel, gear, and art for explorers who take their curiosity seriously. Every purchase supports field research in the San Luis Valley and Sangre de Cristo mountains of Colorado."
        url="/merch"
      />
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_090547-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">Modern Explorer Store</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Gear Up for<br />the Unknown</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.65 }}>
            Apparel, gear, and art for explorers who take their curiosity seriously. Every purchase supports field research.
          </p>
        </div>
      </section>

      {/* SPREADSHOP STOREFRONT */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <iframe
          src="https://modernexplorer.myspreadshop.com/"
          title="Modern Explorer Store"
          style={{
            display: 'block',
            width: '100%',
            height: 'max(900px, calc(100vh - 180px))',
            border: 'none',
          }}
          allow="payment"
          loading="eager"
        />
      </section>

      {/* SUPPORT MESSAGE */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 56 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 16 }}>Every Purchase<br />Funds the Field</h2>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75 }}>
                Modern Explorer is self-funded by people who believe real discovery matters. When you buy merch, you're helping us put better gear in the field and reach more remote locations.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[
                IMG('Mateo', '20250421_075338-EDIT.jpg'),
                IMG('Crestone', '20250810_090735-EDIT.jpg'),
                IMG('Nature', '20250510_124904-EDIT.jpg'),
                IMG('Animals', 'pexels-brett-sayles-1098886.jpg'),
              ].map((src, i) => (
                <div key={i} style={{ paddingTop: '75%', position: 'relative', overflow: 'hidden' }}>
                  <img src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
