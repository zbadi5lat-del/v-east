import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { FeaturedPlaces } from './components/FeaturedPlaces';
import { OperatingPillars } from './components/OperatingPillars';
import { Services } from './components/Services';
import { Sectors } from './components/Sectors';
import { OperatingSystem } from './components/OperatingSystem';
import { FieldOperations } from './components/FieldOperations';
import { WhyVEast } from './components/WhyVEast';
import { Leadership } from './components/Leadership';
import { FAQ } from './components/FAQ';
import { SmartContact } from './components/SmartContact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SiteEntrance } from './components/SiteEntrance';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useSiteExperience } from './siteExperience';
import type { FacilityType } from './content';

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState<FacilityType | null>(null);
  const { copy } = useSiteExperience();
  useScrollReveal();

  const scrollToContact = () => {
    const contact = document.getElementById('contact-section');
    if (!contact) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => contact.focus({ preventScroll: true }), reduceMotion ? 0 : 360);
  };

  return (
    <div className="site-shell flex min-h-screen flex-col overflow-x-hidden bg-corp-navy text-corp-light">
      <SiteEntrance />
      <a href="#main-content" className="skip-link">{copy.common.skip}</a>
      <Header onNavigateToContact={scrollToContact} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Hero onPrimaryCtaClick={scrollToContact} />
        <FeaturedPlaces />
        <About />
        <OperatingPillars />
        <Services />
        <Sectors />
        <OperatingSystem />
        <FieldOperations />
        <WhyVEast />
        <Leadership />
        <FAQ />
        <SmartContact selectedFacility={selectedFacility} onFacilityChange={setSelectedFacility} />
      </main>
      <Footer />
      <FloatingWhatsApp selectedFacility={selectedFacility} />
    </div>
  );
}
