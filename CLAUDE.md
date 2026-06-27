# CLAUDE.md — modern-explorer (marketing website)

App-specific notes for the Modern Explorer marketing site. The shared house rules live in
`../CLAUDE.md` (white-label philosophy, multi-tenant `tenant_id` rule, security,
how we work) — read that too.

## What this is

The public-facing Modern Explorer marketing website: a React + Vite + TypeScript SPA with a
small Express API server alongside it for contact, AI, and data feeds. SEO-oriented
(react-helmet) with client-side routing (react-router).

## Booking — THIS is the customer-facing one

Customer booking lives here in `src/components/BookingDrawer.tsx`. It opens as a drawer over
the marketing site (same URL). ALL customer-facing booking changes go here: pricing, steps,
waiver, Stripe flow, availability, confirmation. It calls the shared booking-api directly.
⚠️ A second, separate booking flow exists in the booking-frontend repo (admin/guide
dashboards) — the two are hand-duplicated and will drift. Customer changes belong HERE, not
there.

## Stack

- **Frontend:** React + Vite + TypeScript, `react-router-dom`, `react-helmet-async`.
- **API server:** Express (`server/index.js`), run with `node --watch`.
- **Integrations:** Anthropic Claude SDK (AI), Stripe (`@stripe/react-stripe-js`),
  Nodemailer (contact email), `sharp` (image processing, build/scripts).
- **Lint:** ESLint (`eslint.config.js`, flat config).

## Commands

```bash
npm run dev          # vite (frontend only)
npm run dev:server   # node --watch server/index.js (API only)
npm run dev:all      # both via concurrently (vite + api)
npm run build        # tsc -b && vite build
npm run start:server # node server/index.js (prod API)
npm run lint         # eslint .
npm run preview      # preview production build
```

For full-stack local work use `npm run dev:all`.

## Structure

- `src/` — `main.tsx`, `App.tsx`, plus `pages/`, `components/`, `context/`, `hooks/`,
  `data/`, `assets/`.
- `server/index.js` — Express API. Endpoints include:
  - `POST /api/contact` — contact form → email (Nodemailer)
  - `POST /api/mesa` — Claude-powered AI endpoint
  - `GET /api/youtube` — YouTube data
  - `GET /api/ufo-reports`, `/api/bigfoot-reports`, `/api/anomaly-feed`, `/api/reviews`
    — content/data feeds
- `scripts/` — build-time utilities (image processing via `sharp`).
- `public/` — static assets.

## Env

Multiple env files: `.env`, `.env.local`, `.env.production` (+ `.env.example`). Browser-side
config must be `VITE_`-prefixed; server secrets (Anthropic, SMTP, Stripe) stay server-side
and out of any committed file or this doc.
