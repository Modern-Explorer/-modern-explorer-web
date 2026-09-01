// Reads src/data/navLinks.json and writes dist/lab-nav.js.
// dist/lab-nav.js is copied to /var/www/field-lab/nav.js by deploy.sh on every deploy.
// This is the single source of truth for nav links shared between Navbar.tsx and field-lab pages.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const links = JSON.parse(readFileSync(join(root, 'src/data/navLinks.json'), 'utf-8'));

const linksLiteral = links
  .map(l => `  {href:${JSON.stringify(l.href)},label:${JSON.stringify(l.label)}}`)
  .join(',\n');

const out = `(function(){
'use strict';

// AUTO-GENERATED — do not edit by hand.
// Source of truth: src/data/navLinks.json (same config drives Navbar.tsx).
// Regenerated on every main-site build via scripts/generate-lab-nav.mjs.

// Self-hosted Oswald 600 — used only for the nav, keeps sub-page font budgets small
var oFace = document.createElement('style');
oFace.textContent = '@font-face{font-family:Oswald;font-style:normal;font-weight:600;font-display:swap;src:url(/assets/fonts/oswald-600.woff2)format("woff2");}';
document.head.appendChild(oFace);

// Nav CSS — matches the main marketing site exactly.
// back-btn is hidden because the nav provides navigation back to /lab.
var css = document.createElement('style');
css.textContent = [
'.me-nav{position:fixed;top:0;left:0;right:0;z-index:9001;',
  'background:rgba(8,12,23,.96);border-bottom:1px solid rgba(255,255,255,.07);',
  'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}',
'.me-container{max-width:1180px;margin:0 auto;padding:0 24px;',
  'display:flex;align-items:center;height:72px;gap:32px;}',
'.me-logo{height:40px;width:auto;object-fit:contain;flex-shrink:0;display:block;}',
'.me-links{display:flex;gap:4px;flex:1;align-items:center;}',
'.me-link{padding:6px 14px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;',
  'letter-spacing:.1em;text-transform:uppercase;color:#8a9ab5;border-radius:3px;',
  'transition:color .15s;text-decoration:none;display:inline-block;}',
'.me-link:hover{color:#f0f4ff;}',
'.me-link.me-active{color:#cbf36e;}',
'.me-book{flex-shrink:0;padding:10px 22px;font-size:13px;',
  'font-family:Oswald,sans-serif;font-weight:600;letter-spacing:.08em;text-transform:uppercase;',
  'background:#cbf36e;color:#080c17;border-radius:4px;',
  'text-decoration:none;display:inline-block;transition:background .15s;}',
'.me-book:hover{background:#b8de56;color:#080c17;}',
'.me-member{flex-shrink:0;padding:6px 13px;font-family:Oswald,sans-serif;font-size:12px;',
  'font-weight:600;letter-spacing:.1em;text-transform:uppercase;',
  'color:#8a9ab5;border:1px solid rgba(255,255,255,.12);border-radius:4px;',
  'text-decoration:none;display:inline-block;transition:color .15s,border-color .15s;}',
'.me-member:hover{color:#f0f4ff;border-color:rgba(255,255,255,.3);}',
'.me-burger{display:none;background:none;border:none;color:#f0f4ff;',
  'font-size:22px;cursor:pointer;padding:4px;line-height:1;}',
'.me-mobile{background:rgba(8,12,23,.96);backdrop-filter:blur(12px);',
  '-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.07);',
  'padding:16px 24px 24px;}',
'.me-mobile .me-link{display:block;padding:12px 0;font-size:16px;letter-spacing:.1em;',
  'border-bottom:1px solid rgba(255,255,255,.07);color:#f0f4ff;}',
'.me-mobile .me-link.me-active{color:#cbf36e;}',
'.me-mobile .me-member{display:block;padding:12px 0;font-size:16px;letter-spacing:.1em;',
  'border:none;border-bottom:1px solid rgba(255,255,255,.07);color:#f0f4ff;',
  'font-family:Oswald,sans-serif;font-weight:600;text-transform:uppercase;}',
'.me-mobile-book{display:block;margin-top:20px;padding:12px;text-align:center;',
  'font-family:Oswald,sans-serif;font-size:14px;font-weight:600;letter-spacing:.08em;',
  'text-transform:uppercase;background:#cbf36e;color:#080c17;border-radius:4px;text-decoration:none;}',
'.back-btn{display:none!important;}',
'@media(max-width:767px){.me-links{display:none!important;}',
  '.me-book{display:none!important;}.me-member{display:none!important;}',
  '.me-burger{display:block!important;}}',
].join('');
document.head.appendChild(css);

// Active state: /lab and anything under /lab/* highlights "Field Lab"
var path = window.location.pathname;
function isActive(href) {
  if (href === '/') return path === '/';
  return path === href || path === href + '/' || path.startsWith(href + '/');
}

var LINKS = [
${linksLiteral},
];

function mobileClose() {
  document.getElementById('me-mobile').style.display = 'none';
  document.getElementById('me-burger').textContent = '\\u2630';
}

function mkLink(l, mobile) {
  var a = document.createElement('a');
  a.href = l.href;
  a.className = 'me-link' + (isActive(l.href) ? ' me-active' : '');
  a.textContent = l.label;
  if (mobile) a.addEventListener('click', mobileClose);
  return a;
}

// Build and inject nav
var nav = document.createElement('nav');
nav.className = 'me-nav';
nav.id = 'me-nav';

var ctr = document.createElement('div');
ctr.className = 'me-container';

var logoA = document.createElement('a');
logoA.href = '/';
var logoImg = document.createElement('img');
logoImg.src = '/assets/images/content/Logo/ME Logo Draft 5.png';
logoImg.alt = 'Modern Explorer';
logoImg.className = 'me-logo';
logoImg.width = 80;
logoImg.height = 53;
logoA.appendChild(logoImg);
ctr.appendChild(logoA);

var linksDiv = document.createElement('div');
linksDiv.className = 'me-links';
LINKS.forEach(function(l) { linksDiv.appendChild(mkLink(l, false)); });
ctr.appendChild(linksDiv);

var member = document.createElement('a');
member.href = '/membership';
member.className = 'me-member';
member.textContent = 'Member Login';
ctr.appendChild(member);

var book = document.createElement('a');
book.href = '/upcoming';
book.className = 'me-book';
book.textContent = 'Book a Tour';
ctr.appendChild(book);

var burger = document.createElement('button');
burger.className = 'me-burger';
burger.id = 'me-burger';
burger.setAttribute('aria-label', 'Toggle menu');
burger.textContent = '\\u2630';
ctr.appendChild(burger);

nav.appendChild(ctr);

var mob = document.createElement('div');
mob.className = 'me-mobile';
mob.id = 'me-mobile';
mob.style.display = 'none';
LINKS.forEach(function(l) { mob.appendChild(mkLink(l, true)); });

var mobMember = document.createElement('a');
mobMember.href = '/membership';
mobMember.className = 'me-member';
mobMember.textContent = 'Member Login';
mobMember.addEventListener('click', mobileClose);
mob.appendChild(mobMember);

var mobBook = document.createElement('a');
mobBook.href = '/upcoming';
mobBook.className = 'me-mobile-book';
mobBook.textContent = 'Book a Tour';
mobBook.addEventListener('click', mobileClose);
mob.appendChild(mobBook);

nav.appendChild(mob);
document.body.insertBefore(nav, document.body.firstChild);

burger.addEventListener('click', function(){
  var open = mob.style.display !== 'none';
  mob.style.display = open ? 'none' : 'block';
  burger.textContent = open ? '\\u2715' : '\\u2630';
});

// Adjust body for tool pages that use position:fixed;inset:0
// so content starts below the 72px nav instead of behind it.
var TOOL_RE = /^\\/lab\\/(converge|ganzfeld|journal|resonance|signal|threshold)\\b/;
if (TOOL_RE.test(path)) {
  document.body.style.top = '72px';
}
// Neuromorph is a scrollable page — push content down.
if (/^\\/lab\\/neuromorph\\b/.test(path)) {
  document.body.style.paddingTop = '72px';
}

})();
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/lab-nav.js'), out);
console.log('Generated dist/lab-nav.js (' + links.length + ' links)');
