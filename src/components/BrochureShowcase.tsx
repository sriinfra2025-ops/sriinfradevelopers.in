import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Share2,
  Maximize2,
  CheckCircle,
  MapPin,
  Sparkles,
  Award,
  Phone,
  Plane,
  Home,
  Trees,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit3,
  Upload,
  X,
  Check,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import { COMPANY_INFO, BROCHURE_PILLARS, BROCHURE_AMENITIES } from '../data/properties';

interface BrochureShowcaseProps {
  onBookSiteVisit: () => void;
  language: 'te' | 'en';
  setLanguage: (lang: 'te' | 'en') => void;
}

interface CustomBrochureData {
  titleEn: string;
  titleTe: string;
  locationEn: string;
  locationTe: string;
  priceAmount: string;
  priceNoteTe: string;
  priceNoteEn: string;
  validityNote: string;
  mdName: string;
  mdPhone: string;
  quoteTe: string;
  quoteEn: string;
  page1Image: string | null;
  page2Image: string | null;
  archImage: string | null;
}

export const BrochureShowcase: React.FC<BrochureShowcaseProps> = ({
  onBookSiteVisit,
  language,
  setLanguage,
}) => {
  const [activePage, setActivePage] = useState<'both' | 'page1' | 'page2'>('both');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Persistent Custom Brochure Data
  const [brochureData, setBrochureData] = useState<CustomBrochureData>(() => {
    try {
      const saved = localStorage.getItem('sri_infra_custom_brochure_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      titleEn: COMPANY_INFO.name,
      titleTe: COMPANY_INFO.nameTelugu,
      locationEn: 'Opposite Function Hall, Keshavapuram Road, Pindiprolu (V), Tirumalayapalem (M), Khammam to Warangal NH',
      locationTe: 'కేశవాపురం రోడ్ , ఫంక్షన్ హాల్ ఎదురుగా, పిండిప్రోలు, ఖమ్మం TO వరంగల్ నేషనల్ హైవే',
      priceAmount: '5,999/-',
      priceNoteTe: 'ఒక గజం ధర కేవలం',
      priceNoteEn: 'Price per Sq. Yd Only',
      validityNote: 'కేవలం 3 నెలలు మాత్రమే (Limited 3 Months Offer)',
      mdName: COMPANY_INFO.managingDirector.name,
      mdPhone: COMPANY_INFO.phone.split('/')[0].trim(),
      quoteTe: COMPANY_INFO.emotionalQuote,
      quoteEn: COMPANY_INFO.emotionalQuoteEn,
      page1Image: null,
      page2Image: null,
      archImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    };
  });

  // Local editor form state
  const [editForm, setEditForm] = useState<CustomBrochureData>(brochureData);

  const page1FileRef = useRef<HTMLInputElement>(null);
  const page2FileRef = useRef<HTMLInputElement>(null);
  const archFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sri_infra_custom_brochure_v2', JSON.stringify(brochureData));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [brochureData]);

  const handleDownloadBrochure = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏡 *${brochureData.titleEn}*\n` +
      `📌 *Location:* ${brochureData.locationEn}\n` +
      `🔥 *Special Launch Offer:* Only ₹${brochureData.priceAmount} per Sq. Yard (${brochureData.validityNote})\n` +
      `⭐ Proposed DTCP Layout • 40ft & 33ft BT Roads • Underground Drainage • Central Lighting • Weekend Homes & Villa Construction\n` +
      `📞 *Contact Managing Director:* ${brochureData.mdName} (${brochureData.mdPhone})`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'page1Image' | 'page2Image' | 'archImage'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditForm((prev) => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrochureEdits = (e: React.FormEvent) => {
    e.preventDefault();
    setBrochureData(editForm);
    setIsEditorOpen(false);
  };

  const handleResetDefaults = () => {
    const defaults: CustomBrochureData = {
      titleEn: COMPANY_INFO.name,
      titleTe: COMPANY_INFO.nameTelugu,
      locationEn: 'Opposite Function Hall, Keshavapuram Road, Pindiprolu (V), Tirumalayapalem (M), Khammam to Warangal NH',
      locationTe: 'కేశవాపురం రోడ్ , ఫంక్షన్ హాల్ ఎదురుగా, పిండిప్రోలు, ఖమ్మం TO వరంగల్ నేషనల్ హైవే',
      priceAmount: '5,999/-',
      priceNoteTe: 'ఒక గజం ధర కేవలం',
      priceNoteEn: 'Price per Sq. Yd Only',
      validityNote: 'కేవలం 3 నెలలు మాత్రమే (Limited 3 Months Offer)',
      mdName: COMPANY_INFO.managingDirector.name,
      mdPhone: COMPANY_INFO.phone.split('/')[0].trim(),
      quoteTe: COMPANY_INFO.emotionalQuote,
      quoteEn: COMPANY_INFO.emotionalQuoteEn,
      page1Image: null,
      page2Image: null,
      archImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    };
    setBrochureData(defaults);
    setEditForm(defaults);
    localStorage.removeItem('sri_infra_custom_brochure_v2');
    setIsEditorOpen(false);
  };

  return (
    <section id="official-brochure" className="py-16 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Decorative ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with "Edit Brochure" Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" /> Official Launch Brochure
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{language === 'te' ? 'అధికారిక బ్రోచర్ & ప్రాజెక్ట్ వివరాలు' : 'Official Project Brochure & Venture Details'}</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {language === 'te' ? brochureData.locationTe : brochureData.locationEn}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Edit Brochure Content & Images Button */}
            <button
              onClick={() => {
                setEditForm(brochureData);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-amber-400"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Brochure & Photos
            </button>

            {/* Language Switcher */}
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  language === 'te' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadBrochure}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Official Brochure Ready!</strong> Sri Infra Developers & Constructions PDF & High-Res Flyer initiated.
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">Ready for Print / WhatsApp</span>
          </div>
        )}

        {/* View Selection Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActivePage('both')}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                activePage === 'both' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'te' ? 'పూర్తి బ్రోచర్ (రెండు పేజీలు)' : 'Complete Brochure (Both Pages)'}
            </button>
            <button
              onClick={() => setActivePage('page1')}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                activePage === 'page1' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'te' ? 'పేజీ 1: ఎంట్రన్స్ & ప్రత్యేకతలు' : 'Page 1: Entrance Arch & Vision'}
            </button>
            <button
              onClick={() => setActivePage('page2')}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                activePage === 'page2' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'te' ? 'పేజీ 2: ₹5,999/- ధర & సదుపాయాలు' : 'Page 2: ₹5,999/- Offer & Amenities'}
            </button>
          </div>
        </div>

        {/* Dynamic Brochure Display Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ======================= PAGE 1 CARD ======================= */}
          {(activePage === 'both' || activePage === 'page1') && (
            <div className="bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/30 overflow-hidden shadow-2xl flex flex-col justify-between relative group">
              {/* If user uploaded a full Page 1 flyer scan */}
              {brochureData.page1Image ? (
                <div className="relative">
                  <img
                    src={brochureData.page1Image}
                    alt="Official Brochure Page 1 Scan"
                    className="w-full h-auto object-contain cursor-pointer"
                    onClick={() => setFullscreenImage(brochureData.page1Image)}
                  />
                  <div className="p-4 bg-slate-950 flex items-center justify-between border-t border-slate-800">
                    <span className="text-xs text-amber-400 font-bold">Uploaded Official Page 1 Flyer</span>
                    <button
                      onClick={() => setFullscreenImage(brochureData.page1Image)}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Fullscreen View
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Top Banner with Logo & Location */}
                  <div className="p-6 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border-b border-amber-500/20 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/30 shrink-0">
                          <span className="text-xl">శ్రీ</span>
                          <span className="text-[8px] tracking-widest uppercase font-bold">SRI INFRA</span>
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight leading-tight">
                            {brochureData.titleEn}
                          </h3>
                          <div className="text-xs font-bold text-slate-200">
                            {brochureData.titleTe}
                          </div>
                          <div className="text-[10px] tracking-wider text-amber-400 font-bold uppercase mt-0.5">
                            WE BUILT YOUR DREAM GUEST HOUSE
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-extrabold uppercase shadow">
                          {language === 'te' ? 'అతి త్వరలో ప్రారంభం' : 'Grand Launch'}
                        </span>
                        <div className="text-[11px] text-amber-300 font-bold mt-1">Proposed DTCP Layout</div>
                      </div>
                    </div>

                    {/* Location Bar on Brochure */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{language === 'te' ? brochureData.locationTe : brochureData.locationEn}</span>
                      </div>
                      <div className="text-right text-[11px] text-amber-300 font-bold pt-1 border-t border-slate-800">
                        {brochureData.mdName} — <span className="font-normal text-slate-400">మేనేజింగ్ డైరెక్టర్ (Managing Director)</span>
                      </div>
                    </div>
                  </div>

                  {/* Entrance Arch Image Rendering */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950">
                    <img
                      src={brochureData.archImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'}
                      alt="Sri Infra Grand Entrance Arch"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                    {/* Overlay Grand Arch Label */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-lg">
                      SRI INFRA GRAND ENTRANCE ARCH
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-amber-500/30 text-xs">
                      <div className="text-amber-300 font-extrabold text-sm mb-0.5">
                        {language === 'te' ? 'భద్రత & నాణ్యతతో కూడిన గ్రాండ్ ఎంట్రన్స్ ఆర్చ్' : 'Grand Majestic Entrance Arch with 24/7 Security'}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {language === 'te'
                          ? 'రౌండ్ ది క్లాక్ సెక్యూరిటీ క్యాబిన్ మరియు ఆధునిక ఆర్కిటెక్చరల్ డిజైన్.'
                          : 'Equipped with round-the-clock security guard cabin and designer gate.'}
                      </div>
                    </div>
                  </div>

                  {/* Emotional Quote from Brochure */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-center space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed italic">
                        "{brochureData.quoteTe}"
                      </p>
                      <p className="text-[11px] text-slate-400">
                        "{brochureData.quoteEn}"
                      </p>
                    </div>

                    {/* 6 Key Brochure Value Icons */}
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 text-center">
                        {language === 'te' ? 'మన ప్రాజెక్ట్ ప్రాధాన్యతలు' : 'Core Investment Pillars'}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BROCHURE_PILLARS.map((pillar, i) => (
                          <div
                            key={i}
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center space-y-1 hover:border-amber-500/40 transition"
                          >
                            <div className="text-xs font-bold text-white">
                              {language === 'te' ? pillar.titleTelugu : pillar.titleEn}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-2">
                              {language === 'te' ? pillar.descTelugu : pillar.descEn}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Specs at bottom of page 1 */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <div className="text-[11px] font-bold text-amber-400 mb-2 uppercase tracking-wider">
                        {language === 'te' ? 'ప్రాజెక్ట్ ప్రత్యేకతలు (Technical Highlights)' : 'Technical Specifications'}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">Proposed DTCP</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">40ft & 33ft Roads</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">Underground Drainage</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">Electricity & Lights</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200 sm:col-span-2">
                          <Trees className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">Avenue Plantation</span>
                        </div>
                      </div>
                    </div>

                    {/* Golden pathway slogan */}
                    <div className="pt-2 text-center text-xs font-bold text-amber-300">
                      ✨ {COMPANY_INFO.subQuote}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ======================= PAGE 2 CARD ======================= */}
          {(activePage === 'both' || activePage === 'page2') && (
            <div className="bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/30 overflow-hidden shadow-2xl flex flex-col justify-between relative group">
              {/* If user uploaded a full Page 2 flyer scan */}
              {brochureData.page2Image ? (
                <div className="relative">
                  <img
                    src={brochureData.page2Image}
                    alt="Official Brochure Page 2 Scan"
                    className="w-full h-auto object-contain cursor-pointer"
                    onClick={() => setFullscreenImage(brochureData.page2Image)}
                  />
                  <div className="p-4 bg-slate-950 flex items-center justify-between border-t border-slate-800">
                    <span className="text-xs text-amber-400 font-bold">Uploaded Official Page 2 Flyer</span>
                    <button
                      onClick={() => setFullscreenImage(brochureData.page2Image)}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Fullscreen View
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border-b border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg sm:text-xl font-black text-white">
                        {language === 'te' ? 'మీ యొక్క పెట్టుబడికి సువర్ణ అవకాశం' : 'Golden Investment Opportunity'}
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg">
                        LIMITED OFFER
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {language === 'te' ? COMPANY_INFO.locationDetails.connectivityDesc : COMPANY_INFO.locationDetails.highway}
                    </p>
                  </div>

                  {/* 4 Photo Grid (Weekend Homes, Houses, Roads, Children Park) */}
                  <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* 1. Weekend Homes */}
                        <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-950 border border-slate-800 group/item">
                          <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
                            alt="Weekend Homes"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-center bg-slate-950/80 backdrop-blur-sm py-1 rounded-md border border-slate-800 text-[11px] font-bold text-amber-300">
                            WEEKEND HOMES (వీకెండ్ హోమ్స్)
                          </div>
                        </div>

                        {/* 2. Houses */}
                        <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-950 border border-slate-800 group/item">
                          <img
                            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80"
                            alt="Custom Houses"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-center bg-slate-950/80 backdrop-blur-sm py-1 rounded-md border border-slate-800 text-[11px] font-bold text-amber-300">
                            HOUSES (గృహ నిర్మాణాలు)
                          </div>
                        </div>

                        {/* 3. Roads & Drainage */}
                        <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-950 border border-slate-800 group/item">
                          <img
                            src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80"
                            alt="Roads & Drainage"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-center bg-slate-950/80 backdrop-blur-sm py-1 rounded-md border border-slate-800 text-[10px] font-bold text-amber-300">
                            40FT/33FT ROADS & DRAINAGE
                          </div>
                        </div>

                        {/* 4. Children Park */}
                        <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-950 border border-slate-800 group/item">
                          <img
                            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                            alt="Children Park"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/item:scale-110 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-center bg-slate-950/80 backdrop-blur-sm py-1 rounded-md border border-slate-800 text-[11px] font-bold text-amber-300">
                            CHILDREN PARK (చిల్డ్రన్స్ పార్క్)
                          </div>
                        </div>
                      </div>

                      {/* SPECIAL LAUNCH PRICE BOX (EXACT FROM BROCHURE) */}
                      <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 p-5 rounded-3xl border-2 border-red-500/80 text-center shadow-xl space-y-2 relative overflow-hidden">
                        <div className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                          {language === 'te'
                            ? 'అతి తక్కువ ధరలో అందరికి అందుబాటులో వుండాలని'
                            : 'Unbeatable Affordable Launch Pricing'}
                        </div>

                        <div className="text-2xl sm:text-4xl font-black text-white flex items-center justify-center gap-2">
                          <span className="text-amber-400">{brochureData.priceNoteTe}</span>
                          <span className="text-red-400 bg-black/60 px-4 py-1 rounded-2xl border border-red-500 text-3xl sm:text-5xl font-black tracking-tight">
                            {brochureData.priceAmount}
                          </span>
                          <span>రూపాయలు</span>
                        </div>

                        <div className="inline-block px-3 py-1 rounded-full bg-red-600/80 text-white text-[11px] font-bold">
                          ⚠️ {brochureData.validityNote}
                        </div>
                      </div>
                    </div>

                    {/* 11 Amenities Checklist from Brochure */}
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>{language === 'te' ? 'వెంచర్ సదుపాయాలు (11 Key Amenities)' : '11 Premium Amenities'}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">100% Ready Infrastructure</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {BROCHURE_AMENITIES.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                            <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-slate-200 text-[11px] font-medium">
                              {language === 'te' ? item.titleTelugu : item.titleEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extra Value Adds */}
                    <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>బ్యాంకు లోన్ సౌకర్యం కలదు (Bank Loan Available)</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          వీకెండ్ హోమ్స్ మరియు గృహ నిర్మాణాలు కూడా చేసి ఇవ్వడం జరుగుతుంది.
                        </div>
                      </div>

                      <button
                        onClick={onBookSiteVisit}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 shrink-0 cursor-pointer text-center"
                      >
                        Book Site Visit Now
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Managing Director & Contact Callout */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-bold text-lg">
              SB
            </div>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {language === 'te' ? 'మేనేజింగ్ డైరెక్టర్ సందేశం' : 'Managing Director'}
              </div>
              <h4 className="text-lg font-extrabold text-white">
                {brochureData.mdName}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'te'
                  ? 'కావున మీ యొక్క పెట్టుబడి భద్రత కొరకు ఒకసారి మన వెంచర్ ని visit చేసి మీ యొక్క బంగారు భవిష్యత్తు కొరకు ఒక మంచి నిర్ణయం తీసుకుంటారని కోరుకుంటూ...'
                  : 'We warmly invite you to visit our venture on Khammam-Warangal National Highway to secure your family’s prosperous future.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${brochureData.mdPhone}`}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call {brochureData.mdName}
            </a>
            <button
              onClick={onBookSiteVisit}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition cursor-pointer"
            >
              Free AC Cab Site Pickup
            </button>
          </div>
        </div>
      </div>

      {/* ===================== BROCHURE EDITOR MODAL ===================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Edit Official Brochure & Photos</h3>
                <p className="text-xs text-slate-400">Upload your printed brochure scans or customize prices and location</p>
              </div>
            </div>

            <form onSubmit={handleSaveBrochureEdits} className="space-y-5 text-xs">
              {/* Image Upload Area */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Brochure Images / Flyer Scans</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Page 1 Flyer Upload */}
                  <div className="space-y-2 border border-slate-800 p-3 rounded-xl bg-slate-900">
                    <div className="font-semibold text-slate-200">Page 1 Flyer (Front Page)</div>
                    <input
                      type="file"
                      ref={page1FileRef}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'page1Image')}
                      className="hidden"
                    />
                    {editForm.page1Image ? (
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-amber-500/40">
                        <img src={editForm.page1Image} alt="Page 1 Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditForm((prev) => ({ ...prev, page1Image: null }))}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => page1FileRef.current?.click()}
                        className="w-full py-6 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] text-slate-300">Upload Page 1 Flyer</span>
                      </button>
                    )}
                  </div>

                  {/* Page 2 Flyer Upload */}
                  <div className="space-y-2 border border-slate-800 p-3 rounded-xl bg-slate-900">
                    <div className="font-semibold text-slate-200">Page 2 Flyer (Back Page)</div>
                    <input
                      type="file"
                      ref={page2FileRef}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'page2Image')}
                      className="hidden"
                    />
                    {editForm.page2Image ? (
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-amber-500/40">
                        <img src={editForm.page2Image} alt="Page 2 Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditForm((prev) => ({ ...prev, page2Image: null }))}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => page2FileRef.current?.click()}
                        className="w-full py-6 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] text-slate-300">Upload Page 2 Flyer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Offer Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Launch Price (₹ Amount)</label>
                  <input
                    type="text"
                    value={editForm.priceAmount}
                    onChange={(e) => setEditForm({ ...editForm, priceAmount: e.target.value })}
                    placeholder="5,999/-"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Offer Validity Note</label>
                  <input
                    type="text"
                    value={editForm.validityNote}
                    onChange={(e) => setEditForm({ ...editForm, validityNote: e.target.value })}
                    placeholder="కేవలం 3 నెలలు మాత్రమే (3 Months Only)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location Details (Telugu)</label>
                <textarea
                  rows={2}
                  value={editForm.locationTe}
                  onChange={(e) => setEditForm({ ...editForm, locationTe: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location Details (English)</label>
                <textarea
                  rows={2}
                  value={editForm.locationEn}
                  onChange={(e) => setEditForm({ ...editForm, locationEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* MD Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Managing Director Name</label>
                  <input
                    type="text"
                    value={editForm.mdName}
                    onChange={(e) => setEditForm({ ...editForm, mdName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.mdPhone}
                    onChange={(e) => setEditForm({ ...editForm, mdPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Brochure Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox for Uploaded Flyer Scans */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-amber-400"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullscreenImage}
              alt="Brochure High-Res"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
