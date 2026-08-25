import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Phone,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  PhoneCall,
  Languages,
  Upload,
  Edit3,
  Image as ImageIcon,
  Check,
  RotateCcw
} from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';

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
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  // Custom Logo State with localStorage
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sri_infra_custom_logo');
    } catch {
      return null;
    }
  });

  const [companyTitle, setCompanyTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('sri_infra_custom_title') || COMPANY_INFO.name;
    } catch {
      return COMPANY_INFO.name;
    }
  });

  const [companyTitleTelugu, setCompanyTitleTelugu] = useState<string>(() => {
    try {
      return localStorage.getItem('sri_infra_custom_title_te') || COMPANY_INFO.nameTelugu;
    } catch {
      return COMPANY_INFO.nameTelugu;
    }
  });

  const [companySubtitle, setCompanySubtitle] = useState<string>(() => {
    try {
      return localStorage.getItem('sri_infra_custom_subtitle') || 'WE BUILT YOUR DREAM GUEST HOUSE';
    } catch {
      return 'WE BUILT YOUR DREAM GUEST HOUSE';
    }
  });

  const [tempLogoUrl, setTempLogoUrl] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomLogoUrl(result);
        localStorage.setItem('sri_infra_custom_logo', result);
        window.dispatchEvent(new CustomEvent('sri_infra_logo_updated', { detail: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLogoUrl.trim()) {
      setCustomLogoUrl(tempLogoUrl.trim());
      localStorage.setItem('sri_infra_custom_logo', tempLogoUrl.trim());
      window.dispatchEvent(new CustomEvent('sri_infra_logo_updated', { detail: tempLogoUrl.trim() }));
    }
    localStorage.setItem('sri_infra_custom_title', companyTitle);
    localStorage.setItem('sri_infra_custom_title_te', companyTitleTelugu);
    localStorage.setItem('sri_infra_custom_subtitle', companySubtitle);
    setIsLogoModalOpen(false);
  };

  const handleResetLogo = () => {
    setCustomLogoUrl(null);
    setCompanyTitle(COMPANY_INFO.name);
    setCompanyTitleTelugu(COMPANY_INFO.nameTelugu);
    setCompanySubtitle('WE BUILT YOUR DREAM GUEST HOUSE');
    localStorage.removeItem('sri_infra_custom_logo');
    localStorage.removeItem('sri_infra_custom_title');
    localStorage.removeItem('sri_infra_custom_title_te');
    localStorage.removeItem('sri_infra_custom_subtitle');
    window.dispatchEvent(new CustomEvent('sri_infra_logo_updated', { detail: null }));
    setIsLogoModalOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Special Offer Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-1.5 text-xs font-bold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              🔥 SPECIAL OFFER
            </span>
            <span className="text-slate-950 font-black">
              ఒక గజం ధర కేవలం ₹5,999/- (Khammam-Warangal National Highway)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={`tel:${COMPANY_INFO.phone.split('/')[0].trim()}`}
              className="inline-flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3" /> Call MD: {COMPANY_INFO.phone.split('/')[0].trim()}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav: Title + Daily Updates + Contacts ONLY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Company Title / Logo - Editable */}
          <div className="flex items-center gap-3 group relative">
            <div
              className="cursor-pointer flex items-center gap-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {customLogoUrl ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/50 shadow-lg shadow-amber-500/25 shrink-0 flex items-center justify-center">
                  <img
                    src={customLogoUrl}
                    alt="Company Logo"
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

            {/* Quick "Edit Logo" Button */}
            <button
              onClick={() => setIsLogoModalOpen(true)}
              title="Edit Logo & Header Title"
              className="opacity-70 hover:opacity-100 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800 transition text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span className="hidden sm:inline text-[10px]">Edit Logo</span>
            </button>
          </div>

          {/* Desktop Navigation: Strictly Daily Updates + Contacts + Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Daily Updates Button (Smooth Scroll to Ventures/Photos) */}
            <button
              onClick={() => scrollToSection('daily-updates')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm hover:border-amber-400"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{language === 'te' ? 'రోజువారీ ఫోటోలు & అప్‌డేట్స్' : 'Daily Updates & Photos'}</span>
            </button>

            {/* Contacts Button (Smooth Scroll to Contact Section) */}
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
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              {language === 'te' ? 'English' : 'తెలుగు'}
            </button>

            {/* Direct Call / Site Visit CTA */}
            <button
              onClick={onBookSiteVisit}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Book Site Visit
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="p-1.5 text-amber-400 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              title="Edit Logo"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-amber-300 text-xs font-bold border border-slate-800"
            >
              {language === 'te' ? 'EN' : 'తెలుగు'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          <button
            onClick={() => scrollToSection('daily-updates')}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-sm text-white flex items-center gap-3"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            {language === 'te' ? 'రోజువారీ ఫోటోలు & అప్‌డేట్స్ (Daily Updates)' : 'Daily Updates & Photos'}
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-sm text-white flex items-center gap-3"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            {language === 'te' ? 'సంప్రదించండి (Contacts)' : 'Contact Details & Booking'}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onBookSiteVisit();
            }}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" /> Book Free AC Cab Site Visit
          </button>
        </div>
      )}

      {/* Logo & Header Customizer Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsLogoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit Logo & Brand Title</h3>
                <p className="text-xs text-slate-400">Upload your company logo image or update brand name</p>
              </div>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4 text-xs">
              {/* Logo Preview & Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {customLogoUrl ? (
                    <img src={customLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-black">
                      <span className="text-xl">శ్రీ</span>
                      <span className="text-[7px]">SRI INFRA</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-xs font-semibold text-white">Upload New Logo Image</div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Choose from Phone/PC
                    </button>
                    {customLogoUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Logo URL alternative */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Or Paste Online Image URL</label>
                <input
                  type="url"
                  value={tempLogoUrl}
                  onChange={(e) => setTempLogoUrl(e.target.value)}
                  placeholder="https://example.com/sri-infra-logo.png"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Title (English)</label>
                <input
                  type="text"
                  value={companyTitle}
                  onChange={(e) => setCompanyTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Title Telugu */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Title (Telugu)</label>
                <input
                  type="text"
                  value={companyTitleTelugu}
                  onChange={(e) => setCompanyTitleTelugu(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Subtitle / Tagline */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={companySubtitle}
                  onChange={(e) => setCompanySubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Brand Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
