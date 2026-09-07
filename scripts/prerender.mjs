/**
 * Build-time static prerender.
 * Run AFTER: vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr
 *
 * Writes dist/<route>/index.html for each public route so that crawlers and
 * non-JS environments see fully-rendered HTML instead of an empty SPA shell.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

const ROUTES = [
  '/',
  '/about',
  '/faq',
  '/what-to-expect',
  '/field-reports',
  '/upcoming',
  '/membership',
  '/contact',
  '/terms',
];

async function prerender() {
  const { render } = await import('../dist-ssr/entry-server.js');
  const template   = readFileSync(resolve(ROOT, 'dist/index.html'), 'utf-8');

  for (const url of ROUTES) {
    process.stdout.write(`  prerender ${url} … `);
    const { html: appHtml, head } = render(url);

    let out = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );

    // Inject per-page <title> / <meta> / <link rel="canonical"> just before </head>.
    // These arrive AFTER the static shell tags so the last <title> wins in browsers
    // and the correct description/OG data is visible to crawlers.
    if (head) {
      out = out.replace('</head>', `    ${head}\n  </head>`);
    }

    if (url === '/') {
      writeFileSync(resolve(ROOT, 'dist/index.html'), out);
    } else {
      const dir = resolve(ROOT, 'dist', url.slice(1));
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, 'index.html'), out);
    }

    console.log('✓');
  }

  console.log('Prerender complete.');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
