import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const values = [
  { n: '01', title: 'Field first', desc: 'Nothing replaces boots on the ground.' },
  { n: '02', title: 'Measure, don\'t assume', desc: 'Instruments over impressions.' },
  { n: '03', title: 'Follow the evidence', desc: 'Wherever it leads — and say so when it leads nowhere.' },
  { n: '04', title: 'Build what doesn\'t exist', desc: 'If the tool for the job isn\'t there, we make it.' },
  { n: '05', title: 'The frontier is shared', desc: 'Findings belong to the people doing the work.' },
];

const gallery = [
  IMG('Crestone', '20250810_090447-EDIT.webp'),
  IMG('Crestone', '20250810_090525-EDIT.webp'),
  IMG('Crestone', '20250810_090608-EDIT.webp'),
  IMG('Nature', '20241109_165442-EDIT.webp'),
  IMG('Crestone', '20250810_091607-EDIT.webp'),
  IMG('Nature', '20250510_091707-EDIT-gallery.webp'),
];

export default function About() {
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="About Modern Explorer — Field Research &amp; Phenomenon Investigation"
        description="Modern Explorer investigates unknown phenomena — cryptozoology, UAP, and lost history — with modern instruments, disciplined fieldwork, and a structured database that drives where exploration goes next."
        url="/about"
      />

      {/* PAGE HERO */}
      <section style={{ position: 'relative', padding: '100px 0 80px' }}>
        <img
          src={IMG('Crestone', '20250810_093514-EDIT.webp')}
          alt=""
          fetchPriority="high"
          loading="eager"
          width={800}
          height={533}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,15,28,0.3), var(--bg))' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Modern Explorer</span>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', marginBottom: 24 }}>Surface &amp; Depth</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 20, color: 'rgba(240,244,255,0.8)', maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
            We investigate unknown phenomena — cryptozoology, UAP, archaeology and lost history — with modern instruments and disciplined fieldwork.
          </p>
        </div>
      </section>

      {/* SURFACE AND DEPTH */}
      <section className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="eyebrow">How It Works</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', marginBottom: 28 }}>The Loop That Drives the Work</h2>
            <div className="divider" />
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.82, marginBottom: 22 }}>
              Every expedition generates observations. Those observations become structured records in the <strong style={{ color: 'var(--text)' }}>Arcanum</strong> — our field database for unknown phenomena. The database reveals patterns. Patterns direct the next expedition.
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.82, marginBottom: 22 }}>
              The tours and expeditions are the surface — the part you can join. You step into a field investigation, contribute your observations, and help build something that compounds over time. The database is what makes each step count.
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.82 }}>
              We aren't chasing content. We're building a body of structured field data — the kind that could eventually answer questions conventional institutions won't fund.
            </p>
          </div>

          {/* Four investigation domains */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, maxWidth: 900, margin: '48px auto 0' }}>
            {[
              { icon: '🛸', label: 'UAP & Aerial Phenomena', sub: 'Witness data, radar correlation, hotspot mapping' },
              { icon: '🐾', label: 'Cryptozoology', sub: 'Unclassified animals — open biological and anomalous investigation' },
              { icon: '🏛️', label: 'Lost History & Archaeology', sub: 'Petroglyphs, anomalous ruins, oral histories outside the timeline' },
              { icon: '🧭', label: 'Field Operations', sub: 'Methodology, instruments, protocols, data chain-of-custody' },
            ].map(d => (
              <div key={d.label} style={{ padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>{d.label}</p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.55 }}>{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Loop diagram */}
          <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
            {[
              { label: 'Expedition', sub: 'Fieldwork & observations' },
              { label: 'Arcanum', sub: 'Structured data records' },
              { label: 'Patterns', sub: 'Analysis & anomalies' },
              { label: 'Next target', sub: 'Where to go next' },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 6, minWidth: 140 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>{step.label}</p>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-dim)' }}>{step.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--accent)', opacity: 0.5, padding: '0 8px' }}>→</span>
                )}
              </div>
            ))}
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--accent)', opacity: 0.5, padding: '0 8px', alignSelf: 'center' }}>↺</span>
          </div>
        </div>
      </section>

      {/* ABOUT MATEO */}
      <section id="mesa-about" className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div style={{ position: 'relative' }}>
              <picture>
                <source srcSet={IMG('Mateo', 'mateo_main.webp')} type="image/webp" />
                <img
                  src={IMG('Mateo', 'mateo_main.jpg')}
                  alt="Mateo Argüello"
                  fetchPriority="high"
                  width={900}
                  height={895}
                  style={{ width: '100%', height: 'auto', borderRadius: 6, border: '1px solid var(--border)', display: 'block' }}
                />
              </picture>
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
                borderRadius: 6, padding: '14px 22px',
              }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 2 }}>Founder</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Mateo Argüello</p>
              </div>
            </div>
            <div>
              <span className="eyebrow">About Mateo</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>Field Investigator,<br />Not an Influencer</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.78, marginBottom: 18 }}>
                I'm a Marine Corps infantry and intelligence veteran. I grew up partly in South America, and I've spent years doing serious fieldwork — Sasquatch research across Colorado's Front Range and the Cañon City corridor, Spanish-treasure and archaeological work in the San Luis Valley, and investigations into the UAP and high-strangeness phenomena this region produces at a rate that's hard to explain.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.78, marginBottom: 18 }}>
                The channel has reached over a million people. But reach was never the point. The point was building something that produces real, structured data from the field — not viral moments.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.78, marginBottom: 32 }}>
                Modern Explorer exists because the San Luis Valley demands it. There's more genuinely unexplained activity concentrated here than almost anywhere in the United States, and almost none of it is being studied rigorously. That's the gap we're filling.
              </p>
              <Link to="/membership" className="btn btn-primary">Join the Research</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CRYPTOZOOLOGY FRAMING */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="eyebrow">Cryptozoology</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: 28 }}>An Open Investigation</h2>
            <div className="divider" />
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.82, marginBottom: 22 }}>
              The category covers unclassified animals — Sasquatch, dogman, thunderbirds, lake creatures — but the real question isn't whether they exist. It's what kind of thing they are. Some witnesses describe encounters that are entirely physical: tracks in mud, hair samples, thermal signatures, a large animal moving through terrain in daylight. Other witnesses, at the same locations, report something different — lights, missing time, apparent telepathy, phenomena that don't behave like biology.
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.82, marginBottom: 22 }}>
              We don't resolve that contradiction in advance. We collect both kinds of reports, structure them, and ask what the data shows: Are the physical encounters and the anomalous encounters happening at the same sites? At different times of year? With different witness profiles? What does the geographic distribution actually look like when you map it?
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.82 }}>
              Sasquatch is the most documented example in the American West — which is why it gets the most fieldwork hours. But it isn't the category. The category is everything the mainstream has decided not to study. We study it.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', height: 280 }}>
          {gallery.map((src, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <img src={src} alt="" loading="lazy" decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="eyebrow">What We Stand For</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
            {values.map(v => (
              <div key={v.n} style={{ padding: '28px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: 10 }}>{v.n}</div>
                <h3 style={{ fontSize: 19, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE'RE BUILDING */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="eyebrow">The Platform</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 28 }}>What We're Building</h2>
            <div className="divider" />
            <div style={{ display: 'grid', gap: 20, marginBottom: 44 }}>
              {[
                { title: 'The Frontier', desc: 'A membership tier for people who want to be part of the research — not just observers. Field briefings, database access, and a direct line into ongoing investigations.' },
                { title: 'The Arcanum', desc: 'A structured database of field observations across cryptozoology, UAP, and archaeological anomalies. Built to be queried, not just scrolled. This is what separates fieldwork from folklore.' },
                { title: 'Field Tools', desc: 'Custom instruments, protocols, and software built for the specific demands of high-strangeness research in remote terrain. If the right tool doesn\'t exist, we build it.' },
                { title: 'Drones, LIDAR & Sensors', desc: 'Modern aerial and ground-sensing platforms for terrain mapping, thermal work, and anomaly detection. The same technology used in legitimate archaeology and conservation — applied here.' },
                { title: 'Field Operations Methodology', desc: 'Reconnaissance protocols, night operation procedures, site survey standards, and chain-of-custody data handling. The operational framework that makes the other three domains produce evidence instead of stories.' },
              ].map(item => (
                <div key={item.title} style={{ padding: '22px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 3, flexShrink: 0, alignSelf: 'stretch', background: 'var(--accent)', borderRadius: 2, opacity: 0.6 }} />
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.68 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/membership" className="btn btn-primary">Join the Research</Link>
              <Link to="/#mesa-tours" className="btn btn-ghost">Browse Tours</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div>
              <span className="eyebrow">Where We Operate</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>Crestone &amp;<br />the San Luis Valley</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 16 }}>
                Crestone sits at 7,930 ft in the heart of the San Luis Valley — the largest alpine valley in the world, 122 miles long and 74 miles wide across 8,000 square miles. Located 30 miles north of Great Sand Dunes National Park, surrounded by the Sangre de Cristo mountains.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                The Valley logs more UAP reports per capita than almost anywhere in the U.S. The land holds centuries of Indigenous history. The mountains contain ruins that haven't been fully documented. This is where we work.
              </p>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {[
                  { value: "7,930'", label: 'Crestone Elevation' },
                  { value: '8,000 sq mi', label: 'Valley Area' },
                  { value: '10', label: 'Sangre de Cristo 14ers' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{stat.value}</p>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>Sangre de Cristo Fourteeners</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 16px' }}>
                  {[
                    ['Blanca Peak', '14,351 ft'], ['Ellingwood Point', '14,042 ft'], ['Little Bear Peak', '14,037 ft'],
                    ['Mount Lindsey', '14,042 ft'], ['Crestone Peak', '14,297 ft'], ['Crestone Needle', '14,197 ft'],
                    ['Kit Carson Peak', '14,165 ft'], ['Challenger Point', '14,081 ft'], ['Humboldt Peak', '14,064 ft'],
                    ['Culebra Peak', '14,053 ft'],
                  ].map(([name, elev]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0', borderBottom: '1px solid var(--border)', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.04em', flexShrink: 0 }}>{elev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                IMG('Crestone', '20250810_093131-EDIT.webp'),
                IMG('Crestone', '20250810_091206-EDIT.webp'),
                IMG('Crestone', '20250810_093528-EDIT.webp'),
                IMG('Nature', '20250510_100646-EDIT.webp'),
              ].map((src, i) => (
                <div key={i} style={{ paddingTop: '80%', position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                  <img src={src} alt="" loading="lazy" decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
