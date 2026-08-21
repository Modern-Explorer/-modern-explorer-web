import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import StructuredData, { LOCAL_BUSINESS_SCHEMA } from './components/StructuredData';
import { BookingProvider } from './context/BookingContext';
// Home stays eager — it's the most common first URL and must paint immediately.
import Home from './pages/Home';

// All other routes are lazy — they only download when the user navigates there.
const About         = lazy(() => import('./pages/About'));
const FieldReports  = lazy(() => import('./pages/FieldReports'));
const MerchStore    = lazy(() => import('./pages/MerchStore'));
const Upcoming      = lazy(() => import('./pages/Upcoming'));
const ComingSoon    = lazy(() => import('./pages/ComingSoon'));
const Contact       = lazy(() => import('./pages/Contact'));
const FAQ           = lazy(() => import('./pages/FAQ'));
const WhatToExpect  = lazy(() => import('./pages/WhatToExpect'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms         = lazy(() => import('./pages/Terms'));
const Tip           = lazy(() => import('./pages/Tip'));

// Non-critical overlays — deferred until first user interaction or idle.
// This removes their JS from the critical path, directly cutting TBT.
const BookingDrawer = lazy(() => import('./components/BookingDrawer'));
const Mesa          = lazy(() => import('./components/Mesa'));

function useDeferredMount(delayMs = 4000) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const mount = () => setMounted(true);
    const events = ['pointerdown', 'scroll', 'touchstart', 'keydown'] as const;
    events.forEach(e => window.addEventListener(e, mount, { once: true, passive: true }));

    // requestIdleCallback fallback: mount after browser idles, or after delayMs at most
    const id = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(mount, { timeout: delayMs })
      : setTimeout(mount, delayMs);

    return () => {
      events.forEach(e => window.removeEventListener(e, mount));
      if ('cancelIdleCallback' in window) (window as any).cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [delayMs]);
  return mounted;
}

export default function App() {
  const overlaysMounted = useDeferredMount(4000);

  return (
    <BookingProvider>
      <BrowserRouter>
        <Analytics />
        <StructuredData data={LOCAL_BUSINESS_SCHEMA} />
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/about"         element={<About />} />
            <Route path="/field-reports" element={<FieldReports />} />
            <Route path="/upcoming"      element={<Upcoming />} />
            <Route path="/merch"         element={<MerchStore />} />
            <Route path="/coming-soon"   element={<ComingSoon />} />
            <Route path="/contact"       element={<Contact />} />
            <Route path="/faq"           element={<FAQ />} />
            <Route path="/what-to-expect" element={<WhatToExpect />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms"         element={<Terms />} />
            <Route path="/tip"           element={<Tip />} />
          </Routes>
        </Suspense>
        <Footer />
        {overlaysMounted && (
          <>
            <Suspense fallback={null}><Mesa /></Suspense>
            <Suspense fallback={null}><BookingDrawer /></Suspense>
          </>
        )}
      </BrowserRouter>
    </BookingProvider>
  );
}
