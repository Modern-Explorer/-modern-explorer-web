import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MESA_SYSTEM = `You are MESA — the Modern Explorer Situational AI. You are a mysterious, knowledgeable field intelligence assistant for Modern Explorer, a guided tour company in Crestone, Colorado and the San Luis Valley.

FOUNDER INTELLIGENCE FILE:
Mateo Argüello founded Modern Explorer. He hiked from Colorado's Front Range through the Sangre de Cristo mountains over the course of two months, living entirely off the land, until he arrived in Crestone on Halloween — where winter stopped him. He did not just arrive and stay; he walked there through the mountains, surviving off the land the entire way. Crestone did not let him leave. He is a former Marine Corps intelligence operator who now tracks different kinds of signals in these mountains. He built Modern Explorer on the premise that the observer changes the encounter. He specializes in cryptozoology, high-strangeness field research, and local lore that doesn't make it into guidebooks. Every tour he leads is built on what he has actually found — not what is expected.

FIELD KNOWLEDGE — SAN LUIS VALLEY:
UFO/UAP: Christopher O'Brien has documented 1,000+ anomalous events in this valley since 1992. The UFO Watchtower in Hooper has logged 304+ sightings. Two sheriff's deputies were followed by an orange sphere. The CIA has formally documented reports from this region.
Animal Mutilations: Lady (Snippy) — September 9, 1967. King Ranch, Alamosa County. First formally documented large-animal mutilation in history. Head and neck stripped to bone with surgical precision. Zero blood. Tracks ended 100 feet from the carcass. Officially unexplained.
Sasquatch: August 2000, two ATV operators on Blanca Peak filed a formal BFRO report describing a close encounter with a large bipedal creature. Blanca Massif has generated consistent reports for decades.
Encounters: In 2019, two hunters near Ute Mountain encountered two extremely tall hooded figures with oversized heads. They also found a 50-to-60-foot structure resembling a circus tent. "We're a couple of guys that don't believe in much. But we believe now."
Spanish Treasure: La Caverna del Oro (Spanish Cave, Marble Mountain Cave) — highest altitude significant cave in the United States at 13,266 ft on Marble Mountain. Accessible roughly 30 days per year. In 1541, Spanish monks used Native American slave labor to extract gold. In 1900, explorer Elisha Horn found a skeleton in Spanish armor with an arrow through its back and a red cross painted at the entrance — still faintly visible today. In 1932, a second skeleton was found chained by the neck to the wall inside. The deeper passages have never been fully surveyed.
Dead Man's Cave: October 1880. Three Silver Cliff prospectors — E.J. Oliver, S.J. Harkman, H.A. Melton — crawled through a 4-foot opening during a blizzard. Inside: five skeletons, and a second chamber with 400 gold bars stamped with Spanish colonial mint marks. They carried out five bars ($900 each, verified by assay, reported in The Denver Post). Went back — couldn't find the cave. Modern Explorer has done two years of LiDAR research and historical mapping pointing to a specific slope in the Sangres. That slope has no LiDAR data. The expedition is active.
Spiritual Communities: Crestone hosts 20+ active spiritual centers — Buddhist monasteries, Hindu ashrams, a Carmelite hermitage, Sufi circles — all within a few square miles. Multiple traditions identify converging ley lines beneath the valley.

TOURS:
The Crestone Walking Tour is currently available. 45–60 minutes. Groups of 6–12. Covers town history, mining history, spiritual sites, paranormal activity, UFOs/UAP. Book at modernexplorer.me. Specialty tours (UFO/UAP, Paranormal, Mining & History) and multi-day expeditions are in development.

You speak like an experienced field researcher — precise, intriguing, never corporate. Help visitors learn about the area and get excited about booking a tour. Occasionally reference classified-sounding field data to stay in character. Keep responses concise and mysterious. Never break character.`;

app.use(cors({ origin: ['http://localhost:5173', 'https://modernexplorer.me'] }));
app.use(express.json());

const INTEREST_LABELS = {
  'general-tour':    'General Walking Tour',
  'specialty-tours': 'Future Specialty Tours',
  'private-group':   'Private Group Booking',
  'expedition':      'Expedition Interest',
  'media':           'Media & Press',
  'other':           'Other',
};

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, interest, message } = req.body;

  if (!name || !email || !interest || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const interestLabel = INTEREST_LABELS[interest] || interest;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0b0f1c;padding:24px 28px;border-radius:6px 6px 0 0">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#cbf36e;opacity:.8">
          Modern Explorer
        </p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff">
          New Expedition Briefing Request
        </h1>
      </div>

      <div style="background:#f8f8f6;padding:28px;border:1px solid #e5e5e0;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0;width:110px;color:#666;font-weight:600">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0;color:#666;font-weight:600">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0">
              <a href="mailto:${email}" style="color:#1a6cbf">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0;color:#666;font-weight:600">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5e0">${phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:10px 0;color:#666;font-weight:600">Interest</td>
            <td style="padding:10px 0">${interestLabel}</td>
          </tr>
        </table>

        <h3 style="margin:24px 0 10px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#444">
          Message
        </h3>
        <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap;font-size:14px">${message}</p>
      </div>

      <div style="padding:16px 28px;background:#f0f0ec;border:1px solid #e5e5e0;border-top:none;border-radius:0 0 6px 6px">
        <p style="margin:0;font-size:11px;color:#999">
          Sent via modernexplorer.me · Reply-To is set to the sender's email address.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Modern Explorer" <${process.env.GMAIL_USER}>`,
      to:       'mateo.arguello@modernexplorer.me',
      replyTo:  email,
      subject:  `[Contact] ${interestLabel} — ${name}`,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Mail send error:', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again or email us directly.' });
  }
});

// ── MESA AI ───────────────────────────────────────────────────────────────────

app.post('/api/mesa', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages.' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'MESA offline — ANTHROPIC_API_KEY not configured.' });
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: MESA_SYSTEM,
      messages,
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('MESA error:', err.message);
    res.status(500).json({ error: 'Field intelligence offline. Signal interrupted.' });
  }
});

// ── ANOMALY FEED — proxy helpers ─────────────────────────────────────────────

const PROXY_TTL  = 2 * 60 * 60 * 1000; // 2 hours
const FETCH_OPTS = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }, signal: AbortSignal.timeout(12000) };

// SLV-area cities / counties
const SLV_CITIES   = ['alamosa','monte vista','del norte','saguache','crestone','moffat','blanca','fort garland','hooper','center','san luis','antonito','la jara','manassa','romeo','conejos','capulin','villa grove','great sand dunes','baca'];
const SLV_COUNTIES = ['saguache','alamosa','costilla','conejos','rio grande','huerfano'];

// ── NUFORC scraper ────────────────────────────────────────────────────────────
async function fetchNUFORCColorado() {
  const res  = await fetch('https://nuforc.org/webreports/ndxlCO.html', FETCH_OPTS);
  const html = await res.text();
  const rows = [];
  const rowRx  = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRx = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = rowRx.exec(html)) !== null) {
    const cells = [];
    let c;
    cellRx.lastIndex = 0;
    while ((c = cellRx.exec(m[1])) !== null) {
      cells.push(c[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim());
    }
    // NUFORC cols: status | date/time | city | state | country | shape | duration | summary | posted
    if (cells.length >= 7 && cells[3] === 'CO') {
      const city = (cells[2] || '').toLowerCase();
      if (SLV_CITIES.some(s => city.includes(s))) {
        const rawDate  = cells[1] || '';
        const dateParts = rawDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        const iso = dateParts ? `${dateParts[3]}-${dateParts[1]}-${dateParts[2]}` : rawDate.slice(0, 10);
        const shape = (cells[5] || '').toLowerCase();
        rows.push({
          id:       `nuforc-live-${iso}-${Math.random().toString(36).slice(2, 6)}`,
          date:     iso,
          location: `${cells[2]}, CO`,
          county:   '',
          category: shape.includes('track') || shape.includes('foot') ? 'cryptid' : 'ufo',
          shape:    cells[5] || undefined,
          summary:  cells[7] || cells[6] || '',
          source:   'NUFORC',
          lat:      undefined,
          lng:      undefined,
        });
      }
    }
  }
  return rows;
}

// ── BFRO scraper ──────────────────────────────────────────────────────────────
// BFRO county pages list reports as plain text lines:
// "August 2000 (Class A) - Description of encounter"
const BFRO_SLV_COUNTIES = ['Alamosa','Costilla','Conejos','Huerfano','Saguache'];
const MONTH_MAP = { January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',
                    July:'07',August:'08',September:'09',October:'10',November:'11',December:'12',
                    Spring:'04',Summer:'07',Fall:'10',Winter:'01' };

async function fetchBFROColorado() {
  const results = await Promise.allSettled(
    BFRO_SLV_COUNTIES.map(async (county) => {
      const res  = await fetch(
        `https://www.bfro.net/GDB/show_county_reports.asp?state=co&county=${county}`,
        FETCH_OPTS
      );
      const html = await res.text();
      const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
      const reports = [];
      // Pattern: "Month Year (Class X) - Description"
      const rx = /((?:January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Fall|Winter)\s+\d{4})\s+\(Class\s+([ABC])\)\s+-\s+([^(]{20,})/g;
      let m;
      while ((m = rx.exec(text)) !== null) {
        const [, dateStr, cls, desc] = m;
        const yr  = (dateStr.match(/\d{4}/) || ['0000'])[0];
        const mon = MONTH_MAP[(dateStr.match(/^(\w+)/) || ['','Jan'])[1]] || '01';
        reports.push({
          id:       `bfro-${county.toLowerCase()}-${yr}-${Math.random().toString(36).slice(2,6)}`,
          date:     `${yr}-${mon}-01`,
          location: `${county} County, CO`,
          county:   `${county} County`,
          category: 'cryptid',
          shape:    `Class ${cls}`,
          summary:  desc.trim(),
          source:   'BFRO',
          lat:      undefined,
          lng:      undefined,
        });
      }
      return reports;
    })
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);
}

// ── Per-source caches ─────────────────────────────────────────────────────────
let ufoCache  = { data: null, ts: 0 };
let bfroCache = { data: null, ts: 0 };

app.get('/api/ufo-reports', async (_req, res) => {
  if (ufoCache.data && Date.now() - ufoCache.ts < PROXY_TTL) return res.json(ufoCache.data);
  try {
    const reports = await fetchNUFORCColorado();
    ufoCache = { data: reports, ts: Date.now() };
    console.log(`NUFORC proxy: ${reports.length} SLV reports fetched`);
    res.json(reports);
  } catch (err) {
    console.warn('NUFORC proxy failed:', err.message);
    res.json(ufoCache.data || []);
  }
});

app.get('/api/bigfoot-reports', async (_req, res) => {
  if (bfroCache.data && Date.now() - bfroCache.ts < PROXY_TTL) return res.json(bfroCache.data);
  try {
    const reports = await fetchBFROColorado();
    bfroCache = { data: reports, ts: Date.now() };
    console.log(`BFRO proxy: ${reports.length} SLV reports fetched`);
    res.json(reports);
  } catch (err) {
    console.warn('BFRO proxy failed:', err.message);
    res.json(bfroCache.data || []);
  }
});

// Real documented SLV reports — baseline fallback
const BASELINE_REPORTS = [
  { id:'nuforc-1967-003', date:'1967-09-03', location:'Near Crestone, CO', county:'Saguache County',
    category:'ufo', summary:'Three house-sized balls of fire descended vertically then accelerated horizontally, covering estimated 40 miles in 3–4 seconds. Multiple witnesses in adjacent counties corroborated. Reported to NUFORC.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'historical-snippy', date:'1967-09-09', location:'King Ranch, Alamosa County, CO', county:'Alamosa County',
    category:'mutilation', summary:'Appaloosa mare Lady (Snippy) found with head and neck stripped to bone with surgical precision. Zero blood at scene. Tracks ended 100 feet from the carcass. Superior Court judge and wife reported three reddish-orange rings in triangular formation the same evening. First formally documented large-animal mutilation in history.',
    source:'Historical Record / NUFORC', lat:37.47, lng:-105.87 },
  { id:'nuforc-1997-001', date:'1997-06-20', location:'West of Alamosa, CO', county:'Alamosa County',
    category:'ufo', summary:'Bright silverish-white light 5 degrees above horizon with occasional red flashes, observed approximately 50 miles northwest of Alamosa for 20+ minutes. No conventional aircraft explanation.',
    source:'NUFORC', lat:37.47, lng:-106.10 },
  { id:'nuforc-1998-001', date:'1998-02-13', location:'Crestone, CO', county:'Saguache County',
    category:'ufo', summary:'Large amber light observed at the top of the Sangre de Cristo range, approximately 10,000 feet elevation. Stationary for several minutes then moved laterally before disappearing.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'nuforc-1998-002', date:'1998-12-09', location:'Alamosa, CO', county:'Alamosa County',
    category:'ufo', summary:'Police officer on routine patrol observed oval-shaped object while traveling northbound. Object emitted no sound. Filed formal report with agency. NUFORC corroborated.',
    source:'NUFORC', lat:37.47, lng:-105.87 },
  { id:'bfro-2000-blanca', date:'2000-08-01', location:'Blanca Peak, CO', county:'Alamosa / Costilla County',
    category:'cryptid', summary:'Two ATV operators encountered a large bipedal creature on the Blanca Massif. Filed formal report with the Bigfoot Field Researchers Organization. Described as very large, moving on two legs, covered in dark hair. BFRO investigation confirmed credible witnesses.',
    source:'BFRO', lat:37.57, lng:-105.49 },
  { id:'obrien-2002-001', date:'2002-07-15', location:'San Luis Valley, CO', county:'Saguache County',
    category:'mutilation', summary:'Cattle mutilation report documented by field investigator Christopher O\'Brien. Classic presentation: surgical incisions, bloodless, selective organ removal. Third documented case in county in 18 months.',
    source:"O'Brien Field Archives", lat:37.80, lng:-105.95 },
  { id:'nuforc-2003-001', date:'2003-04-22', location:'Alamosa, CO', county:'Alamosa County',
    category:'ufo', summary:'Formation of three orange spheres observed moving in triangular formation at low altitude over the valley floor. Witnessed by two residents independently. Duration approximately 4 minutes.',
    source:'NUFORC', lat:37.47, lng:-105.87 },
  { id:'nuforc-2008-001', date:'2008-09-14', location:'Monte Vista, CO', county:'Rio Grande County',
    category:'ufo', summary:'Disc-shaped craft with pulsing white perimeter lights observed hovering for approximately 8 minutes before accelerating vertically at extreme speed. No sound reported.',
    source:'NUFORC', lat:37.58, lng:-106.15 },
  { id:'bfro-2010-001', date:'2010-06-03', location:'Sangre de Cristo Range, CO', county:'Saguache County',
    category:'cryptid', summary:'Backpacker at 11,200 feet elevation reported large bipedal figure crossing open talus field above treeline. Observed for approximately 90 seconds through binoculars at 200-yard distance. Filed with BFRO.',
    source:'BFRO', lat:38.10, lng:-105.60 },
  { id:'nuforc-2014-001', date:'2014-03-09', location:'Saguache, CO', county:'Saguache County',
    category:'ufo', summary:'Multiple residents reported a hovering white light that changed to amber then red before disappearing. Estimated altitude 500–800 feet. No aircraft in FAA records for the area at that time.',
    source:'NUFORC', lat:38.09, lng:-106.14 },
  { id:'obrien-2016-001', date:'2016-10-29', location:'Baca Grande, CO', county:'Saguache County',
    category:'paranormal', summary:'Property owner reported unusual electromagnetic interference — watches stopping, vehicle electronics malfunctioning — along with strong infrasound sensations and two nights of anomalous amber lights on the adjacent ridge. Documented by O\'Brien.',
    source:"O'Brien Field Archives", lat:37.95, lng:-105.65 },
  { id:'nuforc-2018-001', date:'2018-07-04', location:'Hooper, CO', county:'Alamosa County',
    category:'ufo', summary:'UFO Watchtower on-site report: triangular craft with lights at each vertex traversed from north to south in approximately 6 seconds. Estimated size: larger than commercial aircraft. Logged as one of 304+ documented sightings at this location.',
    source:'NUFORC / UFO Watchtower Log', lat:37.76, lng:-106.03 },
  { id:'nuforc-2019-001', date:'2019-04-17', location:'Alamosa, CO', county:'Alamosa County',
    category:'ufo', summary:'Two witnesses observed a bright orange sphere follow their vehicle for approximately 1.4 miles along Highway 160. Object matched vehicle speed before stopping and hovering. Mirrors the pattern of a 1994 documented encounter in the same corridor.',
    source:'NUFORC', lat:37.47, lng:-105.87 },
  { id:'bfro-2019-utm', date:'2019-09-01', location:'Near Ute Mountain, CO', county:'Costilla County',
    category:'cryptid', summary:'Two hunters encountered two extremely tall hooded figures with oversized heads at close range. Before departing the area, witnesses also found a 50–60 foot structure of unknown origin in the wilderness. "We\'re a couple of guys that don\'t believe in much. But we believe now." Filed with BFRO.',
    source:'BFRO', lat:37.35, lng:-105.35 },
  { id:'nuforc-2021-001', date:'2021-08-22', location:'Del Norte, CO', county:'Rio Grande County',
    category:'ufo', summary:'Retired sheriff\'s deputy reported a rapidly moving light that executed a 90-degree turn at speed estimated in excess of Mach 3 based on angular velocity. No sonic boom. Object disappeared over Blanca Peak direction.',
    source:'NUFORC', lat:37.68, lng:-106.35 },
  { id:'nuforc-2022-001', date:'2022-06-11', location:'Crestone, CO', county:'Saguache County',
    category:'ufo', summary:'Three residents in separate locations independently reported the same large green fireball descending over the Sangre de Cristos at 11:47 PM. Object appeared to decelerate before disappearing behind the ridge. No meteor shower active.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'nuforc-2023-001', date:'2023-02-28', location:'Alamosa County, CO', county:'Alamosa County',
    category:'mutilation', summary:'Rancher discovered bovine with precision incisions to jaw, left ear, and rectum. No tracks, no blood, no signs of predator activity. Sheriff\'s office responded. Case documented by county animal control and filed with NUFORC.',
    source:'NUFORC', lat:37.51, lng:-105.72 },
  { id:'nuforc-2024-001', date:'2024-03-15', location:'Hooper, CO', county:'Alamosa County',
    category:'ufo', summary:'Amber sphere observed hovering over irrigated fields east of the UFO Watchtower for 12 minutes. Photographed by two witnesses. Object descended to approximately 200 feet altitude then vanished without accelerating.',
    source:'NUFORC', lat:37.76, lng:-106.03 },
  { id:'nuforc-2024-002', date:'2024-09-07', location:'Saguache, CO', county:'Saguache County',
    category:'paranormal', summary:'Resident reported cattle acting erratically for 3 days preceding discovery of a 28-foot flattened circle in adjacent alfalfa field. No mechanical equipment access. Plants were bent, not broken. Filed with NUFORC and MUFON.',
    source:'NUFORC / MUFON', lat:38.09, lng:-106.14 },
];

// Combined feed cache (1 hour TTL)
let feedCache = { data: null, ts: 0 };
const FEED_TTL = 60 * 60 * 1000;

app.get('/api/anomaly-feed', async (_req, res) => {
  if (feedCache.data && Date.now() - feedCache.ts < FEED_TTL) return res.json(feedCache.data);

  // Fetch NUFORC and BFRO in parallel, server-side (no CORS)
  const [ufoResult, bfroResult] = await Promise.allSettled([
    fetchNUFORCColorado(),
    fetchBFROColorado(),
  ]);
  const live = [
    ...(ufoResult.status  === 'fulfilled' ? ufoResult.value  : []),
    ...(bfroResult.status === 'fulfilled' ? bfroResult.value : []),
  ];
  if (ufoResult.status  === 'rejected') console.warn('NUFORC fetch failed:', ufoResult.reason?.message);
  if (bfroResult.status === 'rejected') console.warn('BFRO fetch failed:',   bfroResult.reason?.message);

  // Merge with baseline, deduplicate, sort newest first
  const seen = new Set();
  const merged = [...live, ...BASELINE_REPORTS].filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  }).sort((a, b) => (b.date > a.date ? 1 : -1));

  feedCache = { data: merged, ts: Date.now() };
  console.log(`Anomaly feed: ${live.length} live + ${BASELINE_REPORTS.length} baseline = ${merged.length} total`);
  res.json(merged);
});

app.listen(PORT, () => console.log(`API server → http://localhost:${PORT}`));
