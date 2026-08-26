import React, { useState, useEffect } from 'react';
import {
  Camera,
  Phone,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  PhoneCall,
  Languages,
  Lock
} from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';
import { getLocalSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface NavbarProps {
  onBookSiteVisit: () => void;
  language: 'te' | 'en';
  setLanguage: (lang: 'te' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookSiteVisit,
  language,
  setLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSettings());

  // Listen to Live Cloud Settings
  useEffect(() => {
    const unsubscribeSettings = subscribeToSettings((updated) => {
      setSettings(updated);
    });

    return () => {
      unsubscribeSettings();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const companyTitle = settings.name || COMPANY_INFO.name;
  const companyTitleTelugu = settings.nameTelugu || COMPANY_INFO.nameTelugu;
  const companySubtitle = settings.tagline || COMPANY_INFO.tagline;
  const customLogoUrl = settings.customLogoUrl;
  const phoneDisplay = settings.phone || COMPANY_INFO.phone;
  const priceDisplay = settings.priceFormatted || COMPANY_INFO.launchOffer.priceFormatted;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition duration-200">
      {/* Top Banner: Direct Highlight for Customers */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-1 px-4 sm:px-6 lg:px-8 text-slate-950 font-bold text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              Grand Launch Offer
            </span>
            <span className="text-slate-950 font-black">
              ఒక గజం ధర కేవలం {priceDisplay} (Khammam-Warangal Highway)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={`tel:${phoneDisplay.split('/')[0].trim()}`}
              className="inline-flex items-center gap-1 hover:text-slate-900 transition"
            >
              <Phone className="w-3 h-3" /> Call MD: {phoneDisplay.split('/')[0].trim()}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav: Brand Title + Navigation + Direct Contacts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Company Title / Logo */}
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {customLogoUrl ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/50 shadow-lg shadow-amber-500/25 shrink-0 flex items-center justify-center">
                <img
                  src={customLogoUrl}
                  alt="Sri Infra Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 p-1 shadow-lg shadow-amber-500/25 flex flex-col items-center justify-center font-black shrink-0">
                <span className="text-xl leading-none">శ్రీ</span>
                <span className="text-[7px] tracking-widest uppercase">SRI INFRA</span>
              </div>
            )}

            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-tight">
                {companyTitle}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <span className="text-amber-300">{companyTitleTelugu}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-300">{companySubtitle}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Daily Updates Button */}
            <button
              onClick={() => scrollToSection('daily-updates')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm hover:border-amber-400"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{language === 'te' ? 'రోజువారీ ఫోటోలు & అప్‌డేట్స్' : 'Daily Updates & Photos'}</span>
            </button>

            {/* Contacts Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm hover:border-amber-400"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{language === 'te' ? 'సంప్రదించండి (Contacts)' : 'Contact Us'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>

            {/* Book Site Visit CTA */}
            <button
              onClick={onBookSiteVisit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'ఉచిత సైట్ విజిట్ బుక్ చేయండి' : 'Book Free Site Visit'}</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 text-xs font-bold"
            >
              {language === 'te' ? 'EN' : 'తెలుగు'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('daily-updates')}
            className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-800 flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>{language === 'te' ? 'రోజువారీ ఫోటోలు & అప్‌డేట్స్' : 'Daily Updates & Photos'}</span>
          </button>
          <button
            onClick={() => scrollToSection('master-plan')}
            className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'te' ? 'మాస్టర్ లేఅవుట్ మ్యాప్' : 'Master Layout Map'}</span>
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-800 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>{language === 'te' ? 'సంప్రదించండి (Contacts)' : 'Contact Details'}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onBookSiteVisit();
            }}
            className="w-full py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'te' ? 'ఉచిత సైట్ విజిట్ బుక్ చేయండి' : 'Book Free Site Visit'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
