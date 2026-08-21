import { lazy, Suspense } from 'react';
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

// Always-present overlays — lazy so they don't block initial paint.
// Suspense fallback=null means nothing visible renders until the chunk arrives
// (both start hidden, so there's no flash of missing UI).
const BookingDrawer = lazy(() => import('./components/BookingDrawer'));
const Mesa          = lazy(() => import('./components/Mesa'));

export default function App() {
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
        <Suspense fallback={null}>
          <Mesa />
        </Suspense>
        <Suspense fallback={null}>
          <BookingDrawer />
        </Suspense>
      </BrowserRouter>
    </BookingProvider>
  );
}
