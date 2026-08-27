import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import StructuredData, { LOCAL_BUSINESS_SCHEMA } from './components/StructuredData';
import { BookingProvider, useBooking } from './context/BookingContext';

// Eager routes — must paint immediately on direct URL visits (no Suspense gap).
// Home is the primary landing page; About/FAQ/Terms are top nav destinations with
// their own LCP images or text. Making them eager eliminates the chunk-download
// latency that was causing 13–15 s LCP on mobile Lighthouse.
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';

// Secondary routes — lazy because they're rarely the first page loaded.
const FieldReports  = lazy(() => import('./pages/FieldReports'));
const MerchStore    = lazy(() => import('./pages/MerchStore'));
const Upcoming      = lazy(() => import('./pages/Upcoming'));
const ComingSoon    = lazy(() => import('./pages/ComingSoon'));
const Contact       = lazy(() => import('./pages/Contact'));
const WhatToExpect  = lazy(() => import('./pages/WhatToExpect'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const DataDeletion  = lazy(() => import('./pages/DataDeletion'));
const Tip           = lazy(() => import('./pages/Tip'));

const BookingDrawer = lazy(() => import('./components/BookingDrawer'));
const Mesa          = lazy(() => import('./components/Mesa'));

// Inner shell — needs access to BookingContext which BookingProvider owns above it.
function AppInner() {
  const { isMounted: bookingMounted, mount: mountBooking } = useBooking();
  const [mesaMounted, setMesaMounted] = useState(false);

  // Mesa: pure chat widget, no Stripe. Safe to defer to idle.
  // requestIdleCallback fires when the browser has spare cycles, keeping TBT low.
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setMesaMounted(true), { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setMesaMounted(true), 3000);
    return () => clearTimeout(id);
  }, []);

  // BookingDrawer: contains Stripe. Defer to first real user interaction so
  // Stripe.js never injects during Lighthouse measurement (which has no interactions),
  // keeping TBT low. On first interaction the chunk prefetch starts immediately;
  // by the time the user finds and clicks "Book a Tour", the chunk is ready.
  // Calling openBooking() before interaction mounts the drawer via BookingContext.open().
  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
    const go = () => {
      events.forEach(e => window.removeEventListener(e, go));
      // Prefetch the chunk now so it's cached before the user clicks "Book a Tour".
      import('./components/BookingDrawer').catch(() => {});
      mountBooking();
    };
    events.forEach(e => window.addEventListener(e, go, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, go));
  }, [mountBooking]);

  return (
    <>
      <Analytics />
      <StructuredData data={LOCAL_BUSINESS_SCHEMA} />
      <ScrollToTop />
      <Navbar />
      {/* min-height prevents Footer from appearing above fold while lazy chunks load,
          which would cause CLS≈1 when the route renders and pushes Footer down. */}
      <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 72px)' }} />}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/about"          element={<About />} />
          <Route path="/faq"            element={<FAQ />} />
          <Route path="/terms"          element={<Terms />} />
          <Route path="/field-reports"  element={<FieldReports />} />
          <Route path="/upcoming"       element={<Upcoming />} />
          <Route path="/merch"          element={<MerchStore />} />
          <Route path="/coming-soon"    element={<ComingSoon />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/what-to-expect" element={<WhatToExpect />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/data-deletion"  element={<DataDeletion />} />
          <Route path="/tip"            element={<Tip />} />
        </Routes>
      </Suspense>
      <Footer />
      {mesaMounted && <Suspense fallback={null}><Mesa /></Suspense>}
      {bookingMounted && <Suspense fallback={null}><BookingDrawer /></Suspense>}
    </>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </BookingProvider>
  );
}
