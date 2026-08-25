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
  Zap,
  Upload
} from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';

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
  // Check if user uploaded a custom arch photo in localStorage
  const [archPhoto, setArchPhoto] = useState<string>(() => {
    try {
      const savedArch = localStorage.getItem('sri_infra_custom_arch_photo');
      if (savedArch) return savedArch;
    } catch (e) {
      console.error(e);
    }
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80';
  });

  const handleCustomArchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setArchPhoto(result);
        localStorage.setItem('sri_infra_custom_arch_photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

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
              <span className="font-extrabold text-amber-300 text-base sm:text-lg">ఒక గజం ధర కేవలం ₹5,999/-</span>{' '}
              <span className="text-slate-300">({COMPANY_INFO.launchOffer.validityNote})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBrochure}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText className="w-3.5 h-3.5" /> View Official Brochure
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> {COMPANY_INFO.tagline}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Proposed DTCP Layout • 100% Clear Title
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Plane className="w-3.5 h-3.5" /> 1 Hr to Mamnoor / Warangal Airport
          </span>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Key Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-amber-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-1">
                {COMPANY_INFO.nameTelugu}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {COMPANY_INFO.name}
              </h1>
              <div className="text-base sm:text-xl font-bold text-amber-300 mt-2">
                {COMPANY_INFO.taglineTelugu} (Golden Investment Opportunity)
              </div>
            </div>

            {/* Emotional Quote from brochure */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-slate-200 text-sm leading-relaxed space-y-2">
              <p className="font-semibold text-amber-200">
                "{COMPANY_INFO.emotionalQuote}"
              </p>
              <p className="text-xs text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                Opposite Function Hall, Keshavapuram Road, Pindiprolu (V), Tirumalayapalem (M), Khammam to Warangal National Highway.
              </p>
            </div>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
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
                  src={archPhoto}
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

                {/* Change / Upload Arch Photo Quick Trigger */}
                <label className="absolute top-3 right-3 p-2 bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-xl text-[10px] font-bold cursor-pointer transition shadow border border-slate-700 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Change Arch Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomArchUpload}
                    className="hidden"
                  />
                </label>

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
                      ₹5,999/- <span className="text-xs font-normal text-slate-300">per Sq. Yd</span>
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
                      {COMPANY_INFO.managingDirector.name} ({COMPANY_INFO.managingDirector.nameTelugu})
                    </div>
                  </div>
                  <a
                    href={`tel:${COMPANY_INFO.phone.split('/')[0].trim()}`}
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
