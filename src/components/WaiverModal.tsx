import { useEffect, useRef } from 'react';

interface Props {
  onAgree: () => void;
  onClose: () => void;
}

const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12, marginTop: 28, paddingBottom: 8, borderBottom: '1px solid rgba(203,243,110,0.15)' }}>{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.68)', lineHeight: 1.8, marginBottom: 10 }}>{children}</p>
);
const Item = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.65)', lineHeight: 1.8, marginBottom: 8, paddingLeft: 20 }}>
    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{n}</span>&ensp;{children}
  </p>
);
const Bold = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: 'rgba(240,244,255,0.88)', fontWeight: 600 }}>{children}</strong>
);

export default function WaiverModal({ onAgree, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 10100, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', backdropFilter: 'blur(3px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 720, maxHeight: '90vh', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-section)', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 3 }}>Modern Explorer · Legal Document</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Participant Agreement &amp; Liability Waiver</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >×</button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1, padding: '28px 28px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text)', marginBottom: 6 }}>MODERN EXPLORER</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Participant Agreement, Waiver of Liability &amp; Terms of Participation</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Effective upon booking completion · {today}</p>
          </div>

          <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 6, marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#f59e0b', lineHeight: 1.7, fontWeight: 600 }}>IMPORTANT: READ CAREFULLY BEFORE COMPLETING YOUR BOOKING.</p>
            <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.75)', lineHeight: 1.65 }}>This Agreement contains a Release of Liability and Waiver of Legal Rights. By checking the agreement box, you acknowledge having read, understood, and voluntarily agreed to all terms herein.</p>
          </div>

          <H>Article I — Parties and Acknowledgment</H>
          <Item n="1.1">This Participant Agreement and Liability Waiver ("Agreement") is made between the person completing this booking ("Participant") and <Bold>Modern Explorer</Bold>, its operators, owners, guides, employees, contractors, and agents (collectively, "Modern Explorer").</Item>
          <Item n="1.2">By checking the agreement box at the time of booking, Participant acknowledges having read, understood, and voluntarily agreed to all terms contained herein. This Agreement is binding upon Participant and their heirs, successors, and assigns.</Item>

          <H>Article II — Description of Activity</H>
          <Item n="2.1">The activities covered by this Agreement include guided walking tours, field expeditions, and related activities operated by Modern Explorer in and around <Bold>Crestone, Colorado</Bold>, and the San Luis Valley (collectively, the "Tour").</Item>
          <Item n="2.2">Tours take place at elevations of approximately <Bold>7,930 feet above sea level</Bold> in Crestone, Colorado. Routes traverse uneven terrain, unpaved surfaces, natural ground, and areas adjacent to public and private property. Tours typically last 45 to 60 minutes and cover approximately 0.5 to 1.5 miles on foot.</Item>

          <H>Article III — Assumption of Risk</H>
          <P>Participant acknowledges and accepts that participation in the Tour involves inherent risks that cannot be eliminated, including but not limited to:</P>
          <Item n="(a)">Uneven, unpaved, and natural terrain that may cause slipping, tripping, or falling;</Item>
          <Item n="(b)">Rapid weather changes typical of high-altitude mountain environments, including sudden temperature drops, lightning, high winds, and precipitation;</Item>
          <Item n="(c)">Physical exertion at high elevation, which may be more demanding than equivalent activity at lower elevations;</Item>
          <Item n="(d)">Altitude-related illness, including Acute Mountain Sickness (AMS), which may cause headache, nausea, fatigue, dizziness, or impaired judgment;</Item>
          <Item n="(e)">Encounters with native wildlife;</Item>
          <Item n="(f)">Sun exposure and UV radiation, which are significantly stronger at high elevation;</Item>
          <Item n="(g)">Dehydration, which occurs more rapidly at high altitude than at sea level;</Item>
          <Item n="(h)">Acts of nature, including rockfall, unstable ground, and flooding in drainage areas;</Item>
          <Item n="(i)">Other risks inherent to outdoor activity in a mountainous, high-desert environment.</Item>
          <Item n="3.2">Participant expressly assumes all risks, known and unknown, associated with participation in the Tour.</Item>

          <H>Article IV — Release of Liability and Indemnification</H>
          <Item n="4.1">In consideration of being permitted to participate in the Tour, and to the fullest extent permitted by law, Participant hereby <Bold>releases, waives, discharges, and covenants not to sue</Bold> Modern Explorer, its owners, operators, guides, employees, independent contractors, agents, and each of their respective heirs, successors, and assigns (collectively, "Released Parties") from any and all liability, claims, demands, losses, damages, costs, and expenses, including attorney's fees, arising out of or related to:</Item>
          <Item n="(a)">Participant's participation in the Tour;</Item>
          <Item n="(b)">Any injury, illness, death, or property damage sustained by Participant during the Tour;</Item>
          <Item n="(c)">The negligence of any Released Party.</Item>
          <Item n="4.2">This release includes claims arising from the active or passive negligence of any Released Party, to the extent permitted by applicable Colorado law.</Item>
          <Item n="4.3">Participant agrees to <Bold>indemnify and hold harmless</Bold> the Released Parties against any claims brought by Participant or on Participant's behalf arising from participation in the Tour, including the cost of defending such claims.</Item>

          <H>Article V — Physical Capability and Medical Disclosure</H>
          <Item n="5.1">Participant represents that they are in good physical health and are capable of safely participating in the Tour as described.</Item>
          <Item n="5.2">Participant represents that they have disclosed, or will disclose prior to the start of the Tour, any medical conditions, physical limitations, or medications that could affect their ability to safely participate or that may require special accommodation.</Item>
          <Item n="5.3">Participant is aware that high-altitude environments may exacerbate pre-existing cardiac, pulmonary, neurological, or circulatory conditions. <Bold>Participants with such conditions are strongly advised to consult a physician before booking.</Bold></Item>
          <Item n="5.4">Modern Explorer reserves the right, in its sole discretion and without liability, to refuse participation or remove a Participant from a Tour at any time if, in the judgment of the guide, continued participation poses a safety risk to the Participant or others.</Item>

          <H>Article VI — Altitude Health Advisory</H>
          <Item n="6.1">Crestone, Colorado sits at an elevation of approximately <Bold>7,930 feet (2,417 meters)</Bold> above sea level. Participants traveling from lower elevations may experience symptoms of Acute Mountain Sickness (AMS), including headache, nausea, fatigue, shortness of breath, and dizziness.</Item>
          <Item n="6.2">Symptoms of AMS may appear within hours of arrival at elevation. Participant acknowledges this risk and accepts sole responsibility for monitoring their own physical condition during the Tour.</Item>
          <Item n="6.3">If a Participant experiences symptoms of AMS or any medical distress during a Tour, they must <Bold>immediately notify the guide</Bold>. Modern Explorer guides are not medical professionals and cannot provide medical treatment.</Item>

          <H>Article VII — Participant Conduct</H>
          <Item n="7.1 Guide Authority.">Participant agrees to follow all instructions given by the Tour guide at all times. The guide's authority on matters of safety, route, and group management is final during the Tour.</Item>
          <Item n="7.2 Group Cohesion.">Participant agrees not to separate from the group without express permission from the guide.</Item>
          <Item n="7.3 Respectful Conduct.">Participant agrees to conduct themselves respectfully toward all other participants, guides, and members of the public encountered during the Tour.</Item>
          <Item n="7.4 Sacred and Private Sites.">Crestone and the surrounding area contain sites of deep spiritual and cultural significance. Participant agrees to conduct themselves with respect at all such locations and to comply with all instructions regarding access, behavior, and photography at sensitive sites.</Item>
          <Item n="7.5 Private Property.">Participant agrees to remain on authorized routes and not to trespass on private property.</Item>
          <Item n="7.6 Prohibited Conduct.">The following are prohibited and constitute grounds for immediate removal without refund: harassment or intimidation; use of alcohol or controlled substances before or during the Tour; destruction of natural features or cultural artifacts; and any conduct that poses a safety risk or disrupts the Tour experience.</Item>

          <H>Article VIII — Photography and Media Release</H>
          <Item n="8.1">Modern Explorer may photograph or video-record Tour participants for documentation, research, and promotional purposes.</Item>
          <Item n="8.2">Participant hereby grants Modern Explorer a non-exclusive, royalty-free, perpetual license to use Participant's image, likeness, and voice captured during the Tour for any lawful purpose.</Item>
          <Item n="8.3 Opt-Out.">Participant who does not wish to be photographed must notify the guide in writing prior to the start of the Tour.</Item>

          <H>Article IX — Cancellation and Refund Policy</H>
          <Item n="9.1 Weather / Safety Cancellations.">Tours cancelled by Modern Explorer due to dangerous conditions will receive a <Bold>full refund</Bold> or reschedule option.</Item>
          <Item n="9.2 Participant Cancellations — 48+ Hours Before Tour.">Participants who cancel 48 or more hours before the Tour will receive a <Bold>full refund</Bold>.</Item>
          <Item n="9.3 Participant Cancellations — Under 48 Hours.">Participants who cancel less than 48 hours before the Tour will receive a <Bold>refund of 50%</Bold> of the total amount paid.</Item>
          <Item n="9.4 No-Show."><Bold>No refund</Bold> will be issued to participants who fail to appear without prior notification.</Item>
          <Item n="9.5 Minimum Group Size.">Modern Explorer reserves the right to cancel Tours that do not meet the minimum group size. In such cases, Participants will receive a full refund or reschedule option.</Item>

          <H>Article X — Governing Law</H>
          <Item n="10.1">This Agreement shall be governed by the <Bold>laws of the State of Colorado</Bold>. Any disputes shall be resolved in the <Bold>state or federal courts located in Saguache County, Colorado</Bold>.</Item>

          <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(203,243,110,0.05)', border: '1px solid rgba(203,243,110,0.25)', borderLeft: '3px solid rgba(203,243,110,0.6)', borderRadius: 5 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Group Bookings</p>
            <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.72)', lineHeight: 1.75 }}>By signing this waiver, the lead participant confirms they have the authority to sign on behalf of all members of their group and that all group members have been informed of and agree to these terms.</p>
          </div>
          <div style={{ height: 32 }} />
        </div>

        {/* Sticky footer */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid var(--border)', background: 'var(--bg-section)', flexShrink: 0, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 22px' }}>Close</button>
          <button onClick={onAgree} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>I Have Read and Agree →</button>
        </div>
      </div>
    </div>
  );
}
