const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const products = [
  { id: 1, name: 'Field Expedition Tee', price: '$34', category: 'Apparel', tag: 'Bestseller', desc: 'heavyweight cotton, back logo print', img: IMG('Crestone', '20250810_090938-EDIT.jpg'), colors: ['#1a1a1a', '#2d3a2e', '#3a2a1a'] },
  { id: 2, name: 'Modern Explorer Patch Cap', price: '$38', category: 'Headwear', tag: 'New', desc: 'structured 6-panel, embroidered patch', img: IMG('Crestone', '20250810_091146.jpg'), colors: ['#0b0f1c', '#2d3a2e'] },
  { id: 3, name: 'Cryptid Research Hoodie', price: '$68', category: 'Apparel', tag: 'Limited', desc: 'fleece-lined, chest & back graphics', img: IMG('Cryptids', 'di86V.jpg'), colors: ['#0b0f1c', '#3a2a1a'] },
  { id: 4, name: 'Explorer Field Journal', price: '$22', category: 'Gear', tag: null, desc: 'A5 dotted pages, water-resistant cover', img: IMG('History', '20231110_154447.jpg'), colors: [] },
  { id: 5, name: 'ME Logo Sticker Pack (5)', price: '$10', category: 'Accessories', tag: null, desc: 'die-cut vinyl, weatherproof', img: IMG('Crestone', '20250810_093123-EDIT.jpg'), colors: [] },
  { id: 6, name: 'San Luis Valley Print', price: '$45', category: 'Art', tag: 'Signed', desc: '11×17 archival print by Glenn Norberg', img: IMG('Crestone', 'DJI_0289 edit.png'), colors: [] },
];

export default function MerchStore() {
  return (
    <main style={{ paddingTop: 72 }}>
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

      {/* NOTICE BANNER */}
      <div style={{ background: 'var(--accent-dim)', borderBottom: '1px solid var(--border-accent)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🧭</span>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Full store launching soon.</strong> Sign up on the <a href="/coming-soon" style={{ textDecoration: 'underline' }}>Coming Soon</a> page for early access and launch discounts.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {products.map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                  <img src={p.img} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {p.tag && <div style={{ position: 'absolute', top: 12, left: 12 }}><span className="tag">{p.tag}</span></div>}
                </div>
                <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, lineHeight: 1.2 }}>{p.name}</h3>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--accent)', fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>{p.price}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', marginBottom: 16, flex: 1 }}>{p.category} · {p.desc}</p>
                  {p.colors.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      {p.colors.map(c => (
                        <div key={c} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '2px solid var(--border)', cursor: 'pointer' }} />
                      ))}
                    </div>
                  )}
                  <button
                    style={{ width: '100%', padding: '11px 0', fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 3, transition: 'var(--ease)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-accent)'; el.style.color = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-muted)'; el.style.background = 'transparent'; }}
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
