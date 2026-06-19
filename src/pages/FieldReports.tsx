import { useState, useEffect, useRef } from 'react';
import { useYouTubeVideos } from '../hooks/useYouTubeVideos';
import AnomalyFeed from '../components/AnomalyFeed';
import { ARTICLES } from '../data/fieldReportArticles';
import SEO from '../components/SEO';
import StructuredData, { articleSchema } from '../components/StructuredData';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const categories = ['All', 'Field Report', 'Skills & Gear', 'Community', 'Expedition News'];

const posts = [
  {
    id: 1, tag: 'Field Report',
    title: "Lady (Snippy): The World's First Documented Animal Mutilation — San Luis Valley, 1967",
    date: 'May 2025', author: 'Modern Explorer', readTime: '7 min',
    img: IMG('Animals', 'snippy-1967-dan-anderson.jpg'),
    excerpt: "On September 9, 1967, a three-year-old Appaloosa mare was found on the King Ranch at the base of the Blanca Massif — head and neck stripped to bone with surgical precision, heart and brain absent, not a drop of blood on the ground. Tracks ended 100 feet from the carcass. A Superior Court judge and his wife reported three reddish-orange rings moving in triangular formation the same evening. No official explanation has ever been issued.",
  },
  {
    id: 2, tag: 'Field Report',
    title: "Over 1,000 Events Logged: The San Luis Valley's Documented Paranormal Record",
    date: 'Apr 2025', author: 'Modern Explorer', readTime: '8 min',
    img: IMG('UFOs', 'ufo-watchtower-hooper.jpg'),
    excerpt: "Author Christopher O'Brien has cataloged more than 1,000 paranormal events in the San Luis Valley since 1992. The UFO Watchtower in Hooper alone has logged over 304 documented sightings. Two sheriff's deputies were followed by an orange sphere. A college student's rear tires blew out as he approached an unidentified object sitting in a field. The CIA has formally documented reports from this region.",
  },
  {
    id: 3, tag: 'Field Report',
    title: "Two Skeptics Near Ute Mountain: The Encounter That Changed Everything (2019)",
    date: 'Mar 2025', author: 'Modern Explorer', readTime: '6 min',
    img: IMG('Nature', '20250518_185929-EDIT.jpg'),
    excerpt: "They went in as skeptics. In 2019, two hunters operating near Ute Mountain just south of the Colorado border encountered two extremely tall hooded figures with oversized heads. Before leaving the area, they came across a 50-to-60-foot structure resembling a circus tent with no reason to exist in that location. 'We're a couple of guys that don't believe in much,' said witness Josh Brinkley. 'But we believe now.'",
  },
  {
    id: 4, tag: 'Field Report',
    title: "Contact on US-160: The Documented Telepathic Encounters of Robert Whitting",
    date: 'Mar 2025', author: 'Modern Explorer', readTime: '5 min',
    img: IMG('Nature', '20250531_201055-EDIT.jpg'),
    excerpt: "Alamosa Episcopal minister Robert Whitting was driving US-160 at night when a craft appeared alongside his vehicle and a voice warned him of a dead animal in the road ahead. He found it exactly where described. Whitting went on to report multiple subsequent encounters and began publishing a bi-monthly record of anomalous activity across the San Luis Valley.",
  },
  {
    id: 5, tag: 'Field Report',
    title: "Sasquatch on Blanca Peak: The August 2000 ATV Encounter",
    date: 'Feb 2025', author: 'Modern Explorer', readTime: '5 min',
    img: IMG('Cryptids', 'Sasquatch.jpg'),
    excerpt: "In August 2000, two ATV operators on the Blanca Peaks filed a formal report with the Bigfoot Research Organization describing a close encounter with a large bipedal creature. The Blanca Massif has generated consistent large-creature reports spanning decades — a pattern that remains unaccounted for by wildlife biologists familiar with the region.",
  },
  {
    id: 6, tag: 'Community',
    title: "Why the World Comes to Crestone: North America's Most Concentrated Spiritual Hub",
    date: 'Jan 2025', author: 'Modern Explorer', readTime: '6 min',
    img: IMG('Crestone', 'DJI_0286 edit.jpg'),
    excerpt: "Crestone is home to more than 20 active spiritual centers representing Buddhist, Hindu, Carmelite, Sufi, and other traditions — all within a few square miles at the foot of the Sangre de Cristo Mountains. The annual Energy Fair draws seekers from across the country. We looked into why this particular valley keeps drawing people searching for something they can't quite name.",
  },

  // ── Community ──────────────────────────────────────────────────────────────────

  {
    id: 7, tag: 'Community', pinnedEvent: true,
    title: "Crestone Energy Fair 2026 — September 11–13",
    date: 'Jun 2026', author: 'Modern Explorer', readTime: '4 min',
    img: IMG('Crestone', '20250810_095413-EDIT.jpg'),
    excerpt: "Now in its nearly fourth decade, the Crestone Energy Fair returns September 11–13, 2026 in Saguache County — where minimal building codes have enabled decades of hands-on experimentation in sustainable living, producing one of the highest concentrations of natural and regenerative homes in the country. Features home tours, workshops, and speakers on sustainable building, renewable energy, water systems, and food sovereignty. Free and open to all.",
  },
  {
    id: 11, tag: 'Community', pinnedEvent: true,
    title: 'Crestone 4th of July Celebration — July 4, 2026',
    date: 'Jul 2026', author: 'Modern Explorer', readTime: '3 min',
    img: IMG('Crestone', '20250810_095413-EDIT.jpg'),
    excerpt: "Crestone doesn't do holidays small. The annual 4th of July celebration brings the whole community together at the base of the Sangres — vendors, food, music, and the legendary Crestone Soapbox Derby. Gravity-powered cars, homemade and wild, race down the hill in what may be the most Crestone thing that happens all year. Free and open to everyone. Vendors apply at the link below. Questions: crestone4th@gmail.com · mountainsiderealty.com/4th-of-july-2026",
  },
  {
    id: 8, tag: 'Community', pinnedEvent: true,
    title: "Crestone Vortex Festival — August 8–9, 2026",
    date: 'Aug 2026', author: 'Modern Explorer', readTime: '4 min',
    img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'),
    excerpt: "Presented by Dark Sky Astrology — founded by astrologers, for astrologers, focused on harmonizing astrology and astronomy with archetypal wisdom and myth. The Crestone Vortex Festival runs August 8–9, 2026 at 187 W Silver Ave, Crestone, CO. Features vendors, main stage speakers, community yoga, classes, food trucks, and a Kid's Zone — plus the first annual Dark Sky Astrology Retreat held in conjunction with the festival. Crestone is set to be named one of the few international Dark Sky communities in the world. 'We welcome everyone to come experience the magical Vortex for yourself.' Website: darkskyvortex.com · darkskyvortex@gmail.com",
  },
  {
    id: 9, tag: 'Community',
    title: "The Vortex of Crestone: What It Is, Why It Draws the World, and What Visitors Experience",
    date: 'May 2026', author: 'Modern Explorer', readTime: '6 min',
    img: IMG('Crestone', '20250810_091639-EDIT.jpg'),
    excerpt: "More than 20 active spiritual centers — Buddhist monasteries, Hindu ashrams, a Carmelite hermitage, Sufi circles, and Native ceremonial sites — within a few square miles at the base of the Sangres. Multiple esoteric traditions locate converging ley lines beneath this valley. Visitors from six continents describe the same thing: something shifts when they arrive. The Vortex of Crestone is not one phenomenon. It is the cumulative weight of centuries of intentional human seeking, concentrated in one place.",
  },

  // ── Skills & Gear ─────────────────────────────────────────────────────────────

  {
    id: 10, tag: 'Skills & Gear',
    title: "Wilderness Survival in the Sangre de Cristos: A Field Guide",
    date: 'Apr 2026', author: 'Modern Explorer', readTime: '8 min',
    img: IMG('Nature', 'sangre-de-cristo-topo.jpg'),
    excerpt: "At 14,000 feet, a clear morning becomes a dangerous lightning storm in under an hour. The Sangres are unforgiving: loose scree, false ridges, unmarked drainages, weather that kills without announcement. This field guide covers what actually matters — reading terrain and high-altitude weather, finding shelter and water, navigating without cell service, recognizing altitude sickness before it becomes an emergency, and understanding why conditions above treeline are categorically different from anything below.",
  },

  // ── Field Report (Sand Dunes) ─────────────────────────────────────────────────

  {
    id: 13, tag: 'Field Report',
    title: "Great Sand Dunes: North America's Tallest Dunes and the Mysteries Surrounding Them",
    date: 'Jun 2026', author: 'Modern Explorer', readTime: '7 min',
    img: IMG('Nature', 'pexels-mohamedelaminemsiouri-2097442.jpg'),
    excerpt: "At the eastern edge of the San Luis Valley, where the flatlands meet the Sangre de Cristo Mountains, the tallest sand dunes in North America rise 750 feet from an ancient lake bed. They've been here 440,000 years. The Pueblo peoples believed their ancestors emerged from the underworld through openings nearby. The UAP corridor between the dunes and Crestone — 25 miles apart — is one of the most documented in Christopher O'Brien's 30-year database. Most people visiting the dunes don't know Crestone is 30 miles away.",
  },

  // ── Expedition News ───────────────────────────────────────────────────────────

  {
    id: 12, tag: 'Expedition News',
    title: "La Caverna del Oro: The Cave of Gold at 13,000 Feet",
    date: 'Feb 2026', author: 'Modern Explorer', readTime: '8 min',
    img: IMG('History', '20250602_154545-EDIT.jpg'),
    excerpt: "At 13,266 feet, Marble Mountain holds the highest-elevation significant cave in the United States. In 1541 Spanish monks used Native American slave labor to extract gold from within it. Around 1900 explorer Elisha Horn found a skeleton in Spanish armor at the entrance. In 1932 a second skeleton was found chained by the neck to an interior wall. The cave has never been fully surveyed. The gold has never been found.",
  },
  {
    id: 14, tag: 'Expedition News',
    title: "Dead Man's Cave: The Spanish Treasure Expedition",
    date: 'Mar 2026', author: 'Modern Explorer', readTime: '9 min',
    img: IMG('History', 'Spanish Map.jpg'),
    excerpt: "October 1880. Three Silver Cliff prospectors crawl through a four-foot opening during a blizzard. Inside: five skeletons — and a second chamber with 400 gold bars stamped with Spanish colonial mint marks. They carry out five bars, assayed at $900 each, and become local celebrities. Then they go back and can't find the cave. Two years of LiDAR research, historical mapping, and rastra location data have pointed us to a specific slope in the Sangres. That slope has no LiDAR coverage. We're going anyway.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function PlatformHeader({ color, label, handle, url }: { color: string; label: string; handle: string; url: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          {label === 'YouTube' ? '▶' : label === 'Instagram' ? '◈' : label === 'X / Twitter' ? '𝕏' : '𝑓'}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</p>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', marginTop: 2 }}>{handle}</p>
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: 11, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 3, padding: '5px 10px', transition: 'var(--ease)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
      >
        Follow →
      </a>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function FieldReports() {
  const [active, setActive]   = useState('All');
  const [modalId, setModalId] = useState<number | null>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const showEventBanner = active === 'All' || active === 'Community';
  const baseFiltered = active === 'All' ? posts : posts.filter(p => p.tag === active);
  const filtered = showEventBanner ? baseFiltered.filter(p => !p.pinnedEvent) : baseFiltered;
  const { videos: ytVideos, loading: ytLoading, error: ytError } = useYouTubeVideos('ModernExplorer');

  // ESC key closes modal
  useEffect(() => {
    if (!modalId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalId(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalId ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalId]);

  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Field Reports | Modern Explorer — San Luis Valley Paranormal Research"
        description="Documented UFO sightings, cattle mutilations, cryptid encounters, Great Sand Dunes mysteries, and the unexplained history of the San Luis Valley and Sangre de Cristo mountains. Research and field reports from Crestone, Colorado."
        url="/field-reports"
        keywords="San Luis Valley UFO sightings, cattle mutilation Colorado, Sasquatch Blanca Peak, Great Sand Dunes paranormal, Crestone vortex, Dead Man's Cave Colorado, La Caverna del Oro, Christopher O'Brien, UFO Watchtower Hooper Colorado"
      />
      {/* Article structured data for key field reports */}
      {[1,2,3,5,10,11,13].map(id => ARTICLES[id] && (
        <StructuredData key={id} data={articleSchema(
          ARTICLES[id].title,
          posts.find(p => p.id === id)?.excerpt?.slice(0, 160) || ARTICLES[id].title,
          ARTICLES[id].date,
          `https://modernexplorer.me/field-reports`,
        )} />
      ))}
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_095422-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-section))' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">From the Field</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Field Reports</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65 }}>
            Firsthand accounts of haunted trails, lost ruins, cryptid encounters, and the mysteries we uncover on every journey. No speculation—just what we observed.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '16px 24px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '8px 18px',
              fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              borderRadius: 3, border: '1px solid',
              borderColor: active === cat ? 'var(--border-accent)' : 'var(--border)',
              background: active === cat ? 'var(--accent-dim)' : 'transparent',
              color: active === cat ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'var(--ease)', whiteSpace: 'nowrap',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ───────────────────────────────────────────────────── */}
      {showEventBanner && (
        <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-section)' }}>
          <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ padding: '4px 12px', background: 'var(--accent)', color: '#0b0f1c', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Featured Events
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>Crestone · Summer–Fall 2026</span>
            </div>
            <div className="featured-events-grid">
              {posts.filter(p => p.pinnedEvent).map(p => {
                const isEnergyFair = p.id === 7;
                return (
                  <div key={p.id} className="featured-event-card">
                    <div className="fec-image" style={{ position: 'relative', minHeight: 220 }}>
                      <img src={p.img} alt={p.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(12,16,28,0.65))' }} />
                      <div style={{
                        position: 'absolute', bottom: 14, left: 14,
                        background: 'var(--accent)', color: 'var(--bg)',
                        borderRadius: 3, padding: '6px 12px',
                        fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.35,
                      }}>
                        {isEnergyFair ? <>SEP 11–13<br /><span style={{ fontSize: 9 }}>FREE EVENT</span></> : <>AUG 8–9<br /><span style={{ fontSize: 9 }}>CRESTONE</span></>}
                      </div>
                    </div>
                    <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
                      <span className="tag" style={{ alignSelf: 'flex-start', marginBottom: 10 }}>Community</span>
                      <h3 style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', marginBottom: 10, lineHeight: 1.2 }}>{p.title}</h3>
                      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, flex: 1, marginBottom: 16 }}>
                        {p.excerpt.slice(0, 180)}…
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => setModalId(p.id)} className="btn btn-primary" style={{ fontSize: 12 }}>
                          Read Full Article →
                        </button>
                        <a href={isEnergyFair ? 'https://crestoneenergyfair.org' : 'https://darkskyvortex.com'}
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline" style={{ fontSize: 12 }}>
                          Website →
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED POST (All view only) */}
      {active === 'All' && (
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '48px 24px' }}>
            <div className="grid-2" style={{ gap: 48, alignItems: 'center' }}>
              <div style={{ position: 'relative', paddingTop: '60%', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={IMG('Animals', 'snippy-1967-dan-anderson.jpg')} alt="Featured" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span className="tag">Featured</span>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', margin: '16px 0 16px', lineHeight: 1.15 }}>
                  Lady (Snippy): The World's First Documented Animal Mutilation
                </h2>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-alt)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                  September 9, 1967. King Ranch, Alamosa County. A three-year-old Appaloosa mare is found with her head and neck stripped to bone — surgical precision, zero blood, tracks ending 100 feet out. The case became the first formally documented large-animal mutilation in history, and it happened right here in the San Luis Valley. It remains officially unexplained.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By Modern Explorer · May 2025</span>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>7 min read</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => setModalId(1)}>Read Full Report →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POSTS GRID */}
      <section id="mesa-sasquatch" className="section">
        <div className="container">

          {/* ── Desktop/tablet: standard 3-col grid ── */}
          <div className="fr-posts-desktop grid-3">
            {filtered.map(post => (
              <article key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <img src={post.img} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                    <span className="tag">{post.tag}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 10 }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, flex: 1, marginBottom: 20 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By {post.author} · {post.date}</span>
                    <button onClick={() => setModalId(post.id)}
                      style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Read Full Report →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Mobile: swipe carousel ── */}
          <div className="fr-posts-mobile">
            {/* Track */}
            <div className="fr-carousel-track" ref={carouselRef}
              onScroll={() => {
                const el = carouselRef.current;
                if (el) setCarouselIdx(Math.round(el.scrollLeft / el.offsetWidth));
              }}>
              {filtered.map(post => (
                <div key={post.id} className="fr-carousel-slide">
                  <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ position: 'relative', paddingTop: '56%', overflow: 'hidden' }}>
                      <img src={post.img} alt={post.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                        <span className="tag">{post.tag}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ fontSize: 16, lineHeight: 1.25, marginBottom: 8 }}>{post.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                        {post.excerpt.slice(0, 120)}…
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{post.date}</span>
                        <button onClick={() => setModalId(post.id)}
                          style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
                          Read →
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Arrow nav */}
            <div className="fr-carousel-arrows">
              <button className="fr-carousel-arrow" disabled={carouselIdx === 0}
                onClick={() => { const el = carouselRef.current; if (el) el.scrollTo({ left: (carouselIdx-1)*el.offsetWidth, behavior:'smooth'}); }}>‹</button>
              <span style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-dim)' }}>
                {carouselIdx + 1} / {filtered.length}
              </span>
              <button className="fr-carousel-arrow" disabled={carouselIdx >= filtered.length - 1}
                onClick={() => { const el = carouselRef.current; if (el) el.scrollTo({ left: (carouselIdx+1)*el.offsetWidth, behavior:'smooth'}); }}>›</button>
            </div>

            {/* Dots */}
            <div className="fr-carousel-dots">
              {filtered.map((_, i) => (
                <button key={i}
                  className={`fr-carousel-dot${carouselIdx === i ? ' active' : ''}`}
                  onClick={() => { const el = carouselRef.current; if (el) el.scrollTo({ left: i*el.offsetWidth, behavior:'smooth'}); }} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SLV ANOMALY MAP ──────────────────────────────────────────────────── */}
      <section id="mesa-map" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '72px 0 56px' }}>
        <div className="container">

          {/* Header — full width, clearly above the map */}
          <div style={{ marginBottom: 36 }}>
            <span className="eyebrow">Field Intelligence</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', marginBottom: 8, lineHeight: 1.1 }}>
              SLV Anomaly Field Map
            </h2>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12 }}>
              Compiled by Christopher O'Brien (1952–2024)
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 15, color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.65, marginBottom: 0 }}>
              Over 1,000 documented paranormal events in the greater San Luis Valley region. Hotspots, cattle mutilation sites, UAP corridors, and cryptid encounter zones mapped across three decades of field investigation.
            </p>
          </div>

          {/* Map — full width */}
          <div style={{
            border: '1px solid rgba(203,243,110,0.28)',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 0 48px rgba(203,243,110,0.07)',
            marginBottom: 16,
          }}>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1JrJi16Sso3iOS1Qy2_1NNLLxKis&ll=37.7749,-105.5183&z=9"
              title="SLV Anomaly Field Map — Christopher O'Brien"
              style={{ display: 'block', width: '100%', height: 600, border: 'none' }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Credit block — full width below the map */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(203,243,110,.02)',
            border: '1px solid rgba(203,243,110,.1)',
            borderLeft: '3px solid rgba(203,243,110,.35)',
            borderRadius: 4,
          }}>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
              This map represents decades of field research by author and investigator Christopher O'Brien, one of the most dedicated researchers of San Luis Valley phenomena. His work continues to guide researchers and explorers in this region.
            </p>
          </div>

        </div>
      </section>

      {/* ── LIVE ANOMALY FEED ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '56px 0 72px' }}>
        <div className="container">

          {/* Feed header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="eyebrow">Documented Events</span>
              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', marginBottom: 6, lineHeight: 1.1 }}>
                Field Report Archive
              </h2>
              <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.6, marginBottom: 0 }}>
                Reports from NUFORC, BFRO, O'Brien field archives, and MUFON — filtered for the San Luis Valley and surrounding Sangre de Cristos. Toggle categories to filter.
              </p>
            </div>
          </div>

          <AnomalyFeed />

        </div>
      </section>

      {/* ── SOCIAL MEDIA DASHBOARD ────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <style>{`
          @media (max-width: 768px) {
            .social-ig-fb-row { grid-template-columns: 1fr !important; }
            .social-x-card    { max-width: 100% !important; }
          }
        `}</style>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <span className="eyebrow">Follow the Expedition</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>Social Activity</h2>
          </div>

          {/* ── ROW 1: YouTube — full width hero ── */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 28px 24px', marginBottom: 20 }}>
            <PlatformHeader
              color="#ff0000"
              label="YouTube"
              handle="@ModernExplorer"
              url="https://www.youtube.com/@ModernExplorer"
            />
            {ytLoading && (
              <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', padding: '12px 0' }}>Loading videos…</p>
            )}
            {ytError && (
              <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', padding: '12px 0' }}>Could not load videos: {ytError}</p>
            )}
            {!ytLoading && !ytError && (
              <div className="social-yt-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {ytVideos.map(v => (
                  <a key={v.videoId} href={v.link} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 4, overflow: 'hidden', marginBottom: 10, background: 'var(--bg)' }}>
                      <img src={v.thumbnail} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', paddingLeft: 3 }}>
                          ▶
                        </div>
                      </div>
                      {v.duration && (
                        <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.82)', borderRadius: 2, padding: '2px 6px', fontSize: 11, fontFamily: 'var(--font-alt)', fontWeight: 600, color: '#fff' }}>
                          {v.duration}
                        </div>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: 'var(--text)', marginBottom: 4 }}>{v.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>
                      {v.viewCount ? `${v.viewCount} views · ` : ''}{v.ago}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── ROW 2: Instagram + Facebook side by side ── */}
          <div className="social-ig-fb-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

            {/* INSTAGRAM */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text)', marginBottom: 8 }}>
                  Modern Explorer on Instagram
                </p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Field photos, tour highlights, and San Luis Valley mysteries
                </p>
              </div>
              <a
                href="https://instagram.com/modern._explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '11px 28px' }}
              >
                Follow on Instagram
              </a>
            </div>

            {/* FACEBOOK */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text)', marginBottom: 8 }}>
                  Modern Explorer on Facebook
                </p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Join our community — events, updates, and local discoveries
                </p>
              </div>
              <a
                href="https://www.facebook.com/Modern.Explorer.ME"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '11px 28px' }}
              >
                Follow on Facebook
              </a>
            </div>
          </div>

          {/* ── ROW 3: X — smaller, centered ── */}
          <div className="social-x-card" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text)', marginBottom: 6 }}>
                  Follow @ModernExplorer5 on X
                </p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Field updates and expedition news
                </p>
              </div>
              <a
                href="https://x.com/ModernExplorer5"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '10px 24px' }}
              >
                Follow on X
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── ARTICLE MODAL ─────────────────────────────────────────────────────── */}
      {modalId !== null && (() => {
        const article = ARTICLES[modalId];
        if (!article) return null;
        return (
          <div
            onClick={() => setModalId(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9990,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px 16px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 760, maxHeight: '90vh',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              }}
            >
              {/* Modal header */}
              <div className="article-modal-header" style={{ padding: '28px 36px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                      <span className="tag">{article.category}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{article.readTime}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{article.date}</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.15, marginBottom: 8 }}>{article.title}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By {article.author}</p>
                  </div>
                  <button
                    onClick={() => setModalId(null)}
                    style={{
                      flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                      border: '1px solid var(--border)', background: 'var(--bg-section)',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                    aria-label="Close article"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal body — scrollable */}
              <div className="article-modal-body" style={{ overflowY: 'auto', padding: '32px 36px 48px', flex: 1 }}>
                {article.body.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily: 'var(--font-alt)',
                    fontSize: 16, lineHeight: 1.8,
                    color: para === para.toUpperCase() && para.length < 60
                      ? 'var(--text-muted)' : 'var(--text)',
                    fontWeight: para === para.toUpperCase() && para.length < 60 ? 700 : 400,
                    letterSpacing: para === para.toUpperCase() && para.length < 60 ? '0.06em' : 0,
                    marginBottom: para === para.toUpperCase() && para.length < 60 ? 12 : 22,
                    marginTop: para === para.toUpperCase() && para.length < 60 ? (i > 0 ? 32 : 0) : 0,
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
