import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  PhoneCall,
  CheckCircle,
  MapPin,
  Camera,
  FileText,
  Home,
  Plane,
  Sparkles,
  Zap
} from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';
import { getLocalSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface HeroSectionProps {
  onExploreVentures: () => void;
  onBookSiteVisit: () => void;
  onOpenBrochure: () => void;
  language: 'te' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreVentures,
  onBookSiteVisit,
  onOpenBrochure,
  language,
}) => {
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSettings());

  useEffect(() => {
    const unsubscribe = subscribeToSettings((updated) => {
      setSettings(updated);
    });
    return unsubscribe;
  }, []);

  const defaultArchPhoto = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80';
  const archPhotoDisplay = settings.customArchUrl || defaultArchPhoto;

  return (
    <div id="hero-section" className="relative overflow-hidden bg-slate-950 text-white pt-6 pb-16 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Special Offer Announcement Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border border-red-500/60 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-wider animate-pulse">
              LAUNCH OFFER
            </span>
            <div className="text-xs sm:text-sm text-slate-100">
              <span className="font-extrabold text-amber-300 text-base sm:text-lg">ఒక గజం ధర కేవలం {settings.priceFormatted || '₹5,999/-'}</span>{' '}
              <span className="text-slate-300 hidden sm:inline">(ఈ ధర కేవలం 3 నెలలు మాత్రమే / Limited Period 3 Months Launch Offer)</span>
            </div>
          </div>

          <button
            onClick={onOpenBrochure}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-md"
          >
            <FileText className="w-3.5 h-3.5" /> View Official Brochure
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Slogan & Project USPs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> WE BUILT YOUR DREAM GUEST HOUSE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Proposed DTCP Layout • 100% Clear Title
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                <Plane className="w-3.5 h-3.5" /> 1 Hr to Mamnoor / Warangal Airport
              </span>
            </div>

            {/* Telugu Title & Main Heading */}
            <div className="space-y-1">
              <div className="text-amber-400 font-bold text-lg sm:text-xl tracking-wide">
                {settings.nameTelugu || COMPANY_INFO.nameTelugu}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {settings.name || COMPANY_INFO.name}
              </h1>
              <p className="text-amber-300 font-extrabold text-lg sm:text-2xl pt-1">
                మీ యొక్క పెట్టుబడికి సువర్ణ అవకాశం (Golden Investment Opportunity)
              </p>
            </div>

            {/* Slogan Quote Box in Telugu */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
                &ldquo;మీ యొక్క స్వల్ప పెట్టుబడి ని తీర్చి దిద్ది, అత్యధిక లాభాలను అందించాలని, ఒక దృఢ సంకల్పం, ఒక వినూత్న ప్రయత్నం, ఒక వినూత్న ఒరవడికి శ్రీకారం ..... శ్రీ ఇన్ ఫ్రా&rdquo;
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold pt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Opposite Function Hall, Keshavapuram Road, Pindiprolu (V), Tirumalayapalem (M), Khammam to Warangal National Highway.</span>
              </div>
            </div>

            {/* Project Key Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> 40ft & 33ft BT Roads
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Underground Drainage
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Weekend Homes & Villas
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Central Street Lights
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Children Park
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Bank Loan Available
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreVentures}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{language === 'te' ? 'రోజువారీ ఫోటోలు చూడండి' : 'View Daily Site Photos'}</span>
              </button>

              <button
                id="hero-site-visit-btn"
                onClick={onBookSiteVisit}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" /> Book Free AC Cab Site Visit
              </button>
            </div>
          </div>

          {/* Right Column: Venture Grand Entrance Arch Feature */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-amber-500/40 shadow-2xl p-5 sm:p-6 space-y-5">
              {/* Grand Entrance Arch Image Card */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/11] group bg-slate-950 border border-slate-800">
                <img
                  src={archPhotoDisplay}
                  alt="Sri Infra Grand Entrance Arch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Top Badge: Grand Arch */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                    🏛️ SRI INFRA GRAND ENTRANCE ARCH
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                  <div className="text-lg font-black text-white leading-tight">
                    Sri Infra Highway County (Pindiprolu)
                  </div>
                  <div className="text-xs text-amber-300 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3" /> Opp. Function Hall, Keshavapuram Rd, Khammam-Wgl NH
                  </div>
                </div>
              </div>

              {/* Price & MD Showcase Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Special Launch Price</div>
                    <div className="text-2xl font-black text-amber-400">
                      {settings.priceFormatted || '₹5,999/-'} <span className="text-xs font-normal text-slate-300">per Sq. Yd</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg">
                      3 MONTHS ONLY
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">Proposed DTCP Layout</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <div className="text-[11px] text-slate-400">Managing Director</div>
                    <div className="font-extrabold text-white text-sm">
                      {settings.managingDirectorName || COMPANY_INFO.managingDirector.name} ({settings.managingDirectorNameTelugu || COMPANY_INFO.managingDirector.nameTelugu})
                    </div>
                  </div>
                  <a
                    href={`tel:${(settings.phone || COMPANY_INFO.phone).split('/')[0].trim()}`}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
