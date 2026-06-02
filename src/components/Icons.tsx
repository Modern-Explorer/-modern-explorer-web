import React from 'react';

// All icons accept optional className and style props

export function OrbIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" className={className} style={style}>
      <circle cx="29" cy="29" r="27" stroke="rgba(203,243,110,0.07)" strokeWidth="0.5"/>
      <circle cx="29" cy="29" r="21" stroke="rgba(203,243,110,0.11)" strokeWidth="0.5"/>
      <ellipse cx="29" cy="29" rx="21" ry="7.5" stroke="rgba(203,243,110,0.16)" strokeWidth="0.6" transform="rotate(-38 29 29)"/>
      <circle cx="29" cy="29" r="14" stroke="rgba(203,243,110,0.20)" strokeWidth="0.8"/>
      <circle cx="29" cy="29" r="9" fill="rgba(203,243,110,0.10)"/>
      <circle cx="29" cy="29" r="5" fill="rgba(203,243,110,0.28)"/>
      <circle cx="29" cy="29" r="2.5" fill="rgba(203,243,110,0.85)"/>
    </svg>
  );
}

export function CompassIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className={className} style={style}>
      <g transform="translate(28,28)">
        <circle r="26" stroke="rgba(203,176,120,0.20)" strokeWidth="0.6"/>
        <circle r="7" stroke="rgba(203,176,120,0.28)" strokeWidth="0.5"/>
        <polygon points="0,-24 3.5,-7 0,0 -3.5,-7" fill="rgba(203,176,120,0.92)"/>
        <polygon points="0,24 3.5,7 0,0 -3.5,7" fill="rgba(203,176,120,0.45)"/>
        <polygon points="-24,0 -7,-3.5 0,0 -7,3.5" fill="rgba(203,176,120,0.45)"/>
        <polygon points="24,0 7,-3.5 0,0 7,3.5" fill="rgba(203,176,120,0.82)"/>
        <polygon points="0,-15 2.5,-5 0,0 -2.5,-5" fill="rgba(203,176,120,0.32)" transform="rotate(45)"/>
        <polygon points="0,-15 2.5,-5 0,0 -2.5,-5" fill="rgba(203,176,120,0.32)" transform="rotate(135)"/>
        <polygon points="0,-15 2.5,-5 0,0 -2.5,-5" fill="rgba(203,176,120,0.32)" transform="rotate(225)"/>
        <polygon points="0,-15 2.5,-5 0,0 -2.5,-5" fill="rgba(203,176,120,0.32)" transform="rotate(315)"/>
        <circle r="2.5" fill="rgba(203,176,120,0.9)"/>
        <circle r="1" fill="#0b0f1c"/>
      </g>
    </svg>
  );
}

export function FootprintIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="50" height="68" viewBox="0 0 50 68" fill="none" className={className} style={style}>
      <g transform="translate(3,36) rotate(-16)" opacity="0.50">
        <ellipse cx="10" cy="15" rx="8.5" ry="13" fill="rgba(155,135,100,0.70)"/>
        <ellipse cx="3" cy="3" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.70)"/>
        <ellipse cx="7" cy="1" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.70)"/>
        <ellipse cx="12" cy="0" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.70)"/>
        <ellipse cx="17" cy="1" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.70)"/>
        <ellipse cx="21" cy="3" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.70)"/>
      </g>
      <g transform="translate(21,4) rotate(14)" opacity="0.88">
        <ellipse cx="10" cy="15" rx="8.5" ry="13" fill="rgba(155,135,100,0.75)"/>
        <ellipse cx="3" cy="3" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.75)"/>
        <ellipse cx="7" cy="1" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.75)"/>
        <ellipse cx="12" cy="0" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.75)"/>
        <ellipse cx="17" cy="1" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.75)"/>
        <ellipse cx="21" cy="3" rx="2.5" ry="3.5" fill="rgba(155,135,100,0.75)"/>
      </g>
    </svg>
  );
}

export function LanternIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="34" height="60" viewBox="0 0 34 60" fill="none" className={`me-lantern ${className}`} style={{ transformOrigin: '17px 0px', ...style }}>
      <line x1="17" y1="0" x2="17" y2="8" stroke="rgba(175,148,88,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7,8 Q17,5 27,8 L26,14 L8,14Z" fill="rgba(175,148,88,0.55)"/>
      <rect x="9" y="14" width="16" height="26" rx="2" fill="rgba(175,148,88,0.07)" stroke="rgba(175,148,88,0.45)" strokeWidth="0.9"/>
      <line x1="14" y1="14" x2="14" y2="40" stroke="rgba(175,148,88,0.38)" strokeWidth="0.7"/>
      <line x1="20" y1="14" x2="20" y2="40" stroke="rgba(175,148,88,0.38)" strokeWidth="0.7"/>
      <line x1="9" y1="23" x2="25" y2="23" stroke="rgba(175,148,88,0.30)" strokeWidth="0.6"/>
      <line x1="9" y1="32" x2="25" y2="32" stroke="rgba(175,148,88,0.30)" strokeWidth="0.6"/>
      <ellipse cx="17" cy="29" rx="4" ry="6" fill="rgba(255,168,48,0.10)"/>
      <ellipse cx="17" cy="29" rx="2.5" ry="4" fill="rgba(255,168,48,0.18)"/>
      <path d="M17,22 C19.2,25.5 19.5,29 17,34 C14.5,29 14.8,25.5 17,22Z" fill="rgba(255,168,48,0.65)"/>
      <path d="M17,24 C18,26.5 18,30 17,33 C16,30 16,26.5 17,24Z" fill="rgba(255,220,100,0.45)"/>
      <path d="M8,40 L9,40 L25,40 L26,40 Q17,47 8,40Z" fill="rgba(175,148,88,0.50)"/>
      <polygon points="17,47 14,53 20,53" fill="rgba(175,148,88,0.42)"/>
    </svg>
  );
}

export function GhostEyeIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="52" height="40" viewBox="0 0 52 40" fill="none" className={className} style={style}>
      <path d="M4,20 Q26,2 48,20 Q26,38 4,20Z" stroke="rgba(160,110,230,0.45)" fill="rgba(80,40,160,0.06)" strokeWidth="0.9"/>
      <circle cx="26" cy="20" r="10" fill="rgba(100,60,200,0.12)" stroke="rgba(160,110,230,0.38)" strokeWidth="0.8"/>
      <circle cx="26" cy="20" r="6" fill="rgba(140,90,220,0.35)"/>
      <circle cx="26" cy="20" r="2.5" fill="rgba(8,12,23,0.9)"/>
      <circle cx="28" cy="18" r="1.2" fill="rgba(255,255,255,0.45)"/>
      <path d="M4,20 Q12,14 20,20" stroke="rgba(160,110,230,0.20)" fill="none" strokeWidth="0.5"/>
      <path d="M32,20 Q40,14 48,20" stroke="rgba(160,110,230,0.20)" fill="none" strokeWidth="0.5"/>
    </svg>
  );
}

export function MountainIcon({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none" className={className} style={style}>
      <polygon points="28,4 52,44 4,44" fill="rgba(100,130,180,0.10)" stroke="rgba(120,150,200,0.45)" strokeWidth="0.9"/>
      <polygon points="28,4 40,44 16,44" fill="rgba(100,130,180,0.16)" stroke="rgba(120,150,200,0.28)" strokeWidth="0.5"/>
      <polygon points="28,4 34,20 22,20" fill="rgba(220,230,255,0.32)"/>
      <line x1="10" y1="44" x2="46" y2="44" stroke="rgba(120,150,200,0.28)" strokeWidth="0.6"/>
      <circle cx="28" cy="1" r="2" fill="rgba(203,243,110,0.7)"/>
      <circle cx="28" cy="1" r="4" fill="rgba(203,243,110,0.12)"/>
    </svg>
  );
}

export function LockPulseIcon({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg width="36" height="46" viewBox="0 0 36 46" fill="none"
      style={{ animation: 'meLockPulse 2.4s ease-in-out infinite', ...style }}>
      <path d="M10,20 L10,13 Q10,5 18,5 Q26,5 26,13 L26,20"
        stroke="rgba(245,158,11,0.55)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <rect x="4" y="20" width="28" height="24" rx="4"
        fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.45)" strokeWidth="1"/>
      <circle cx="18" cy="31" r="4.5" fill="rgba(245,158,11,0.22)"/>
      <rect x="16" y="31" width="4" height="7" rx="1.5" fill="rgba(245,158,11,0.35)"/>
    </svg>
  );
}
