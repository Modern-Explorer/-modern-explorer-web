import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { WaitlistProvider } from './context/WaitlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import StructuredData, { LOCAL_BUSINESS_SCHEMA } from './components/StructuredData';
import Analytics from './components/Analytics';

// All routes imported eagerly for SSR — no lazy() here.
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import WhatToExpect from './pages/WhatToExpect';
import Upcoming from './pages/Upcoming';
import Membership from './pages/Membership';
import FieldReports from './pages/FieldReports';
import Contact from './pages/Contact';

export function render(url: string): { html: string; head: string } {
  const helmetCtx: { helmet?: HelmetServerState | null } = {};

  const html = renderToString(
    <HelmetProvider context={helmetCtx}>
      <WaitlistProvider>
        <BookingProvider>
          <StaticRouter location={url}>
            <Analytics />
            <StructuredData data={LOCAL_BUSINESS_SCHEMA} />
            <ScrollToTop />
            <Navbar />
            <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 72px)' }} />}>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/about"          element={<About />} />
                <Route path="/faq"            element={<FAQ />} />
                <Route path="/terms"          element={<Terms />} />
                <Route path="/field-reports"  element={<FieldReports />} />
                <Route path="/upcoming"       element={<Upcoming />} />
                <Route path="/contact"        element={<Contact />} />
                <Route path="/what-to-expect" element={<WhatToExpect />} />
                <Route path="/membership"     element={<Membership />} />
                <Route path="/privacy"        element={<Navigate to="/privacy-policy" replace />} />
              </Routes>
            </Suspense>
            <Footer />
          </StaticRouter>
        </BookingProvider>
      </WaitlistProvider>
    </HelmetProvider>
  );

  const { helmet } = helmetCtx;
  const head = helmet
    ? [
        helmet.title?.toString(),
        helmet.meta?.toString(),
        helmet.link?.toString(),
        helmet.script?.toString(),
      ].filter(Boolean).join('\n    ')
    : '';

  return { html, head };
}
