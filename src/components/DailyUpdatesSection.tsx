import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  Maximize2,
  Share2,
  X,
  PhoneCall,
  Lock,
  ExternalLink
} from 'lucide-react';
import { COMPANY_INFO, INITIAL_DAILY_UPDATES } from '../data/properties';
import { DailyUpdate } from '../types';
import { getStoredPhotos, subscribeToPhotoUpdates } from '../utils/photoStorage';

interface DailyUpdatesSectionProps {
  language: 'te' | 'en';
  onBookSiteVisit: () => void;
}

export const DailyUpdatesSection: React.FC<DailyUpdatesSectionProps> = ({
  language,
  onBookSiteVisit,
}) => {
  const [updates, setUpdates] = useState<DailyUpdate[]>(INITIAL_DAILY_UPDATES);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<DailyUpdate | null>(null);

  // Load photos from Firestore & local cache and subscribe to live updates
  useEffect(() => {
    getStoredPhotos().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setUpdates(loaded);
      }
    });

    const unsubscribe = subscribeToPhotoUpdates((updatedList) => {
      setUpdates(updatedList);
    });
    return unsubscribe;
  }, []);

  const categories = [
    'All',
    'Venture Arch & Entrance',
    'Road Laying & BT Roads',
    'Underground Drainage',
    'Layout & Plots',
    'Guest House Construction',
    'Customer Site Visits',
    'Plantation & Park',
  ];

  // Filtered photos
  const filteredPhotos = updates.filter((item) => {
    if (activeFilter !== 'All' && item.category !== activeFilter) {
      return false;
    }
    return true;
  });

  return (
    <section
      id="daily-updates"
      className="py-16 bg-slate-950 text-white border-t border-slate-800 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" /> 100% Live Site Ground Photos
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'te' ? 'వెంచర్ రోజువారీ ఫోటోలు & అభివృద్ధి' : 'Venture Daily Ground Progress Feed'}
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              {language === 'te'
                ? 'శ్రీ ఇన్ఫ్రా హైవే కౌంటీ (పిండిప్రోలు) వద్ద జరుగుతున్న 40 అడుగుల బిటి రోడ్లు, గ్రాండ్ ఎంట్రన్స్ ఆర్చ్, భూగర్భ డ్రైనేజ్ లైవ్ ఫోటోలు.'
                : 'Live photo updates of grand entrance arch, 40-feet BT roads, drainage work, and plot boundary markings.'}
            </p>
          </div>

          {/* Customer Action Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onBookSiteVisit}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'te' ? 'ఉచిత సైట్ విజిట్ బుక్ చేసుకోండి' : 'Book Free Site Visit'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No photos in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please select &quot;All&quot; to see all photos and development updates.
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Show All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-amber-500/10"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> View HD Photo
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-slate-700">
                    {item.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>
                      <span className="text-[10px] text-slate-400">Sri Infra Official</span>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition text-[11px]">
                      View Full Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hello%20Srinivas%20Bhoga%20garu,%20I%20saw%20this%20site%20update:%20${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 text-slate-400 hover:text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
                      {lightboxImage.category}
                    </span>
                    <span className="text-xs text-slate-400">{lightboxImage.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{lightboxImage.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{lightboxImage.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hello%20Srinivas%20Bhoga%20garu,%20I%20am%20inquiring%20about%20this%20venture%20site%20photo:%20${encodeURIComponent(lightboxImage.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
