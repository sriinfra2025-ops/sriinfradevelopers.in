/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrochureShowcase } from './components/BrochureShowcase';
import { MasterPlanViewer } from './components/MasterPlanViewer';
import { DailyUpdatesSection } from './components/DailyUpdatesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SiteVisitModal } from './components/SiteVisitModal';
import { DnsTroubleshooter } from './components/DnsTroubleshooter';
import { COMPANY_INFO } from './data/properties';

export default function App() {
  const [language, setLanguage] = useState<'te' | 'en'>('te');
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState<boolean>(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<string | undefined>(undefined);
  const [showDnsDoctor, setShowDnsDoctor] = useState<boolean>(false);

  const handleOpenSiteVisit = (projectTitle?: string) => {
    setSelectedProjectForModal(projectTitle);
    setIsSiteVisitModalOpen(true);
  };

  const handleScrollToDailyUpdates = () => {
    const el = document.getElementById('daily-updates');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToBrochure = () => {
    const el = document.getElementById('official-brochure');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar: ONLY Company Title + Daily Updates + Contacts */}
      <Navbar
        onBookSiteVisit={() => handleOpenSiteVisit()}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content */}
      <main className="flex-1">
        {showDnsDoctor ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">DNS Configuration Doctor</h2>
              <button
                onClick={() => setShowDnsDoctor(false)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Back to Website
              </button>
            </div>
            <DnsTroubleshooter />
          </div>
        ) : (
          <div>
            {/* 1. Hero Section with Venture Grand Arch on Main Page */}
            <HeroSection
              onExploreVentures={handleScrollToDailyUpdates}
              onBookSiteVisit={() => handleOpenSiteVisit()}
              onOpenBrochure={handleScrollToBrochure}
              language={language}
            />

            {/* 2. Official Authentic Brochure Showcase */}
            <BrochureShowcase
              onBookSiteVisit={() => handleOpenSiteVisit('Sri Infra Highway County (Pindiprolu Venture)')}
              language={language}
              setLanguage={setLanguage}
            />

            {/* 3. Our Prime Residential & Commercial Ventures + Daily Updates & Easy Photo Loader */}
            <DailyUpdatesSection language={language} />

            {/* 4. Master Layout & Plot Booking Section */}
            <MasterPlanViewer
              onSelectPlot={(plot) => {
                handleOpenSiteVisit(`Plot ${plot.plotNumber} (${plot.sizeSqYd} Sq.Yds, ${plot.facing})`);
              }}
              language={language}
            />

            {/* 5. Why Choose Us (DTCP, RERA, 10+ Yrs Trust) */}
            <WhyChooseUs language={language} />

            {/* 6. Contact Section with MD Srinivas Bhoga */}
            <ContactSection language={language} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenDnsDoctor={() => setShowDnsDoctor(true)} />

      {/* Free Site Visit & AC Cab Booking Modal */}
      <SiteVisitModal
        isOpen={isSiteVisitModalOpen}
        onClose={() => setIsSiteVisitModalOpen(false)}
        defaultProjectTitle={selectedProjectForModal}
      />
    </div>
  );
}
