/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TestGalleryMainView } from './components/TestGalleryMainView';
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
import { AdminPortalView } from './components/AdminPortalView';
import { LayoutGrid, Camera, Eye } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'te' | 'en'>('te');
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState<boolean>(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<string | undefined>(undefined);
  const [showDnsDoctor, setShowDnsDoctor] = useState<boolean>(false);
  
  // View mode: 'test-gallery' (default simplified test view) or 'full-venture' (full brochure/layout view)
  const [viewMode, setViewMode] = useState<'test-gallery' | 'full-venture'>('test-gallery');

  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('/admin') ||
      path.endsWith('/admin') ||
      path.endsWith('/admin/') ||
      hash === '#admin' ||
      hash.includes('admin') ||
      search.includes('admin')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);

  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.hash = '#admin';
        setIsAdminRoute(true);
      }
    };

    const handleOpenAdminCustom = () => {
      window.location.hash = '#admin';
      setIsAdminRoute(true);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sri_infra_open_admin_portal', handleOpenAdminCustom);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sri_infra_open_admin_portal', handleOpenAdminCustom);
    };
  }, []);

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    }
    if (window.location.pathname.includes('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  // If visiting /admin, render Admin Portal
  if (isAdminRoute) {
    return <AdminPortalView onExitAdmin={handleExitAdmin} />;
  }

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Floating View Switcher Bar for Quick Testing */}
      <div className="bg-slate-900 border-b border-slate-800 py-1.5 px-4 sticky top-0 z-40 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold hidden sm:inline">Active Mode:</span>
            <span className="text-amber-400 font-bold">
              {viewMode === 'test-gallery' ? 'Live Gallery & Main Page' : 'Full Venture Layout'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('test-gallery')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'test-gallery'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Main Page & Gallery</span>
            </button>

            <button
              onClick={() => setViewMode('full-venture')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'full-venture'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Venture View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Content */}
      {viewMode === 'test-gallery' ? (
        <TestGalleryMainView
          language={language}
          setLanguage={setLanguage}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <Navbar
            onBookSiteVisit={() => handleOpenSiteVisit()}
            language={language}
            setLanguage={setLanguage}
          />

          {/* Full Main Content */}
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
                {/* 1. Hero Section */}
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

                {/* 3. Daily Updates & Easy Photo Loader */}
                <DailyUpdatesSection language={language} />

                {/* 4. Master Layout & Plot Booking Section */}
                <MasterPlanViewer
                  onSelectPlot={(plot) => {
                    handleOpenSiteVisit(`Plot ${plot.plotNumber} (${plot.sizeSqYd} Sq.Yds, ${plot.facing})`);
                  }}
                  language={language}
                />

                {/* 5. Why Choose Us */}
                <WhyChooseUs language={language} />

                {/* 6. Contact Section */}
                <ContactSection language={language} />
              </div>
            )}
          </main>

          {/* Footer */}
          <Footer onOpenDnsDoctor={() => setShowDnsDoctor(true)} />
        </div>
      )}

      {/* Free Site Visit & AC Cab Booking Modal */}
      <SiteVisitModal
        isOpen={isSiteVisitModalOpen}
        onClose={() => setIsSiteVisitModalOpen(false)}
        defaultProjectTitle={selectedProjectForModal}
      />
    </div>
  );
}
