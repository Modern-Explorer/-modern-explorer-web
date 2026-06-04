import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Mesa from './components/Mesa';
import Analytics from './components/Analytics';
import StructuredData, { LOCAL_BUSINESS_SCHEMA } from './components/StructuredData';
import Home from './pages/Home';
import About from './pages/About';
import FieldReports from './pages/FieldReports';
import MerchStore from './pages/MerchStore';
import Upcoming from './pages/Upcoming';
import ComingSoon from './pages/ComingSoon';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import WhatToExpect from './pages/WhatToExpect';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <StructuredData data={LOCAL_BUSINESS_SCHEMA} />

      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/field-reports" element={<FieldReports />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/merch" element={<MerchStore />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/what-to-expect" element={<WhatToExpect />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
      <Mesa />
    </BrowserRouter>
  );
}
