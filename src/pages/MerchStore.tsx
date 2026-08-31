import { useEffect, useRef, useState } from 'react';
import SEO from '../components/SEO';

declare global {
  interface Window { spread_shop_config?: object; }
}

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

export default function MerchStore() {
  const [showFallback, setShowFallback] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    window.spread_shop_config = {
      shopName: 'modernexplorer',
      locale: 'us_US',
      prefix: 'https://modernexplorer.myspreadshop.com',
      baseId: 'myShop',
    };

    const script = document.createElement('script');
    script.src = 'https://modernexplorer.myspreadshop.com/shopfiles/shopclient/shopclient.nocache.js';
    script.async = true;
    script.onerror = () => { if (mountedRef.current) setShowFallback(true); };
    document.head.appendChild(script);

    // If the embed hasn't replaced the placeholder after 6s, show the fallback link.
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      const el = document.getElementById('myShop');
      // Spreadshop replaces the anchor with its own iframe/div; if still just one child it failed.
      if (!el || el.childElementCount <= 1) setShowFallback(true);
    }, 6000);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window.spread_shop_config;
    };
  }, []);

  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Store | Modern Explorer — Gear for Explorers"
        description="Shop Modern Explorer t-shirts, hats, and expedition gear. Take home a piece of the San Luis Valley's mystery and support independent exploration in Crestone."
        url="/merch"
      />
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_090547-EDIT.webp')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />
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
      <section style={{ borderBottom: '1px solid var(--border)', minHeight: 600 }}>
        {showFallback ? (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
              Shop on Spreadshop
            </p>
            <a
              href="https://modernexplorer.myspreadshop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: 15, padding: '14px 32px', display: 'inline-block' }}
            >
              Visit the Store →
            </a>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
              Opens in a new tab — apparel, gear, and art from Modern Explorer.
            </p>
          </div>
        ) : (
          <div id="myShop" style={{ minHeight: 600 }}>
            <a href="https://modernexplorer.myspreadshop.com">Modern Explorer Store</a>
          </div>
        )}
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
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginTop: 16 }}>
                The store carries t-shirts, hats, hoodies, and art prints — all designed around the themes we explore in Crestone: high-strangeness, the San Luis Valley, and the edge of the known. Items ship worldwide through Spreadshop.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[
                IMG('Mateo', '20250421_075338-EDIT.webp'),
                IMG('Crestone', '20250810_090735-EDIT.webp'),
                IMG('Nature', '20250510_124904-EDIT.webp'),
                IMG('Animals', 'pexels-brett-sayles-1098886.webp'),
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
