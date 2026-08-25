import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Maximize2,
  X,
  Sparkles,
  Share2,
  Calendar,
  Tag,
  Filter,
  Check,
  Building,
  MapPin,
  Eye,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { COMPANY_INFO, INITIAL_DAILY_UPDATES, PROPERTY_PROJECTS } from '../data/properties';
import { DailyUpdate } from '../types';

interface DailyUpdatesSectionProps {
  language?: 'te' | 'en';
}

export const DailyUpdatesSection: React.FC<DailyUpdatesSectionProps> = ({ language = 'te' }) => {
  // Store updates in state + localStorage
  const [updates, setUpdates] = useState<DailyUpdate[]>(() => {
    try {
      const saved = localStorage.getItem('sri_infra_venture_photos_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DAILY_UPDATES;
  });

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [onlyUserPhotos, setOnlyUserPhotos] = useState<boolean>(() => {
    return localStorage.getItem('sri_infra_only_user_photos') === 'true';
  });

  // Modal / Lightbox state
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<DailyUpdate | null>(null);

  // Easy Photo Loader Form state
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<string>('Venture Arch & Entrance');
  const [photoDescription, setPhotoDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedFilePreviews, setSelectedFilePreviews] = useState<string[]>([]);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sri_infra_venture_photos_v2', JSON.stringify(updates));
      localStorage.setItem('sri_infra_only_user_photos', onlyUserPhotos.toString());
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [updates, onlyUserPhotos]);

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

  // Handle Multi-file Selection & Reading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const readers: Promise<string>[] = [];

    Array.from(files).forEach((file: File) => {
      const readerPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      readers.push(readerPromise);
    });

    Promise.all(readers).then((results) => {
      setSelectedFilePreviews((prev) => [...prev, ...results]);
      if (!photoTitle) {
        setPhotoTitle(`Sri Infra Venture Site Photo ${new Date().toLocaleDateString()}`);
      }
    });
  };

  // Submit / Add Uploaded Photos
  const handleSavePhotos = (e: React.FormEvent) => {
    e.preventDefault();
    const photosToAdd: string[] = [];

    if (uploadMode === 'device') {
      photosToAdd.push(...selectedFilePreviews);
    } else if (imageUrlInput.trim()) {
      photosToAdd.push(imageUrlInput.trim());
    }

    if (photosToAdd.length === 0) {
      alert('Please choose at least one photo from your device or enter a photo URL.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newUpdatesList: DailyUpdate[] = photosToAdd.map((imgSrc, index) => ({
      id: `user-photo-${Date.now()}-${index}`,
      title: photoTitle.trim() || `Sri Infra Highway County Site Photo #${index + 1}`,
      date: todayDate,
      category: photoCategory as any,
      projectTitle: 'Sri Infra Highway County (Pindiprolu Venture)',
      description: photoDescription.trim() || 'Latest live on-ground development photo uploaded by venture administrator.',
      imageUrl: imgSrc,
      author: 'Sri Infra Official',
    }));

    setUpdates((prev) => [...newUpdatesList, ...prev]);
    setUploadSuccessMessage(`Successfully added ${photosToAdd.length} photo(s) to the Venture Photo Gallery!`);

    // Reset Form
    setTimeout(() => {
      setSelectedFilePreviews([]);
      setImageUrlInput('');
      setPhotoTitle('');
      setPhotoDescription('');
      setUploadSuccessMessage(null);
      setIsUploaderOpen(false);
    }, 1200);
  };

  const handleDeletePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this photo from the venture feed?')) {
      setUpdates((prev) => prev.filter((item) => item.id !== id));
      if (lightboxImage?.id === id) {
        setLightboxImage(null);
      }
    }
  };

  const handleClearToDemo = () => {
    if (window.confirm('Reset all photos to default official gallery?')) {
      setUpdates(INITIAL_DAILY_UPDATES);
      setOnlyUserPhotos(false);
      localStorage.removeItem('sri_infra_venture_photos_v2');
      localStorage.removeItem('sri_infra_only_user_photos');
    }
  };

  // Filtered photos
  const filteredPhotos = updates.filter((item) => {
    if (onlyUserPhotos && !item.id.startsWith('user-photo-')) {
      return false;
    }
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
        {/* Main Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" /> Our Prime Residential & Commercial Ventures
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'te'
                ? 'మన వెంచర్లు & రోజువారీ సైట్ ఫోటోలు (Daily Site Updates)'
                : 'Our Prime Ventures & Daily Development Photos'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {language === 'te'
                ? 'శ్రీ ఇన్ ఫ్రా హైవే కౌంటీ (పిండిప్రోలు) వెంచర్ తాజా ఫోటోలు, 40/33 అడుగుల BT రోడ్లు, గ్రాండ్ ఆర్చీ, డ్రైనేజీ మరియు గెస్ట్ హౌస్ నిర్మాణ అప్‌డేట్స్.'
                : 'Live photo feed and on-ground development progress for Sri Infra Highway County on Khammam-Warangal National Highway.'}
            </p>
          </div>

          {/* Action Buttons: Easy Photo Loader Trigger & Options */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="open-easy-photo-loader-btn"
              onClick={() => setIsUploaderOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'te' ? '+ కొత్త ఫోటోలు అప్‌లోడ్ చేయండి' : '+ Upload Your Venture Photos'}</span>
            </button>
          </div>
        </div>

        {/* Quick Toolbar: Filter by Category & Toggle "Only My Photos" */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* User Photos Only Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyUserPhotos}
                onChange={(e) => setOnlyUserPhotos(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-700"
              />
              <span className={onlyUserPhotos ? 'text-amber-400' : 'text-slate-400'}>
                {language === 'te' ? 'నేను ఇచ్చిన ఫోటోలు మాత్రమే చూపించు' : 'Show Only Uploaded Photos'}
              </span>
            </label>

            {updates.length > 0 && (
              <button
                onClick={handleClearToDemo}
                title="Reset to default photos"
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Easy Quick Upload Hero Box (Always Visible Banner for Instant Loading) */}
        <div className="mb-10 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === 'te'
                  ? 'సులభమైన ఫోటో లోడర్ (Easy Photo Loader)'
                  : 'Easy Photo Loader for Sri Infra Ventures'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'te'
                  ? 'మీ మొబైల్ లేదా కంప్యూటర్ నుండి మీ వెంచర్ ఆర్చీ, రోడ్లు, లేదా ప్లాట్ల ఫోటోలను ఎంపిక చేసి 1-క్లిక్‌తో అప్‌లోడ్ చేయండి.'
                  : 'Upload your authentic venture arch, blacktop road, layout, and guest house construction photos directly.'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select & Upload Photos (ఫోటోలు ఎంచుకోండి)</span>
              </button>
              <span className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP from Phone Gallery or Camera</span>
            </div>
          </div>
        </div>

        {/* Photos Grid Stream */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Camera className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">No photos found in this category</h4>
            <p className="text-xs text-slate-400">
              {onlyUserPhotos
                ? 'You currently have no custom photos uploaded under this filter. Upload a photo or uncheck "Show Only Uploaded Photos".'
                : 'Try selecting "All" or upload a new photo.'}
            </p>
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Upload Photo Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 flex flex-col cursor-pointer relative"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badge: Category & Date */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold shadow">
                      {item.category}
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-slate-300 text-[10px] font-semibold border border-slate-800">
                      {item.date}
                    </span>
                  </div>

                  {/* Delete button (hover) */}
                  <button
                    onClick={(e) => handleDeletePhoto(item.id, e)}
                    title="Delete Photo"
                    className="absolute bottom-3 right-3 p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-xl shadow opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Click to Zoom Icon */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                    <Maximize2 className="w-3 h-3" /> View Fullscreen
                  </div>
                </div>

                {/* Photo Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> Pindiprolu Venture
                    </span>
                    <span className="text-amber-400 font-semibold font-mono">₹5,999/sq.yd</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Easy Photo Loader Form */}
        {isUploaderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsUploaderOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {language === 'te' ? 'సులభమైన ఫోటో లోడర్ (Easy Photo Loader)' : 'Upload Venture Photos'}
                  </h3>
                  <p className="text-xs text-slate-400">Add photos to your Sri Infra development gallery</p>
                </div>
              </div>

              {uploadSuccessMessage ? (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">{uploadSuccessMessage}</h4>
                </div>
              ) : (
                <form onSubmit={handleSavePhotos} className="space-y-4 text-xs">
                  {/* Mode switcher: Device upload vs URL */}
                  <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setUploadMode('device')}
                      className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                        uploadMode === 'device' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" /> From Phone / Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                        uploadMode === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Paste Image URL
                    </button>
                  </div>

                  {/* Device File Input */}
                  {uploadMode === 'device' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="font-semibold text-slate-200">
                          Click to select photos from your device
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Supports multiple photos (JPG, PNG, WEBP)
                        </div>
                      </div>

                      {/* Selected Previews Grid */}
                      {selectedFilePreviews.length > 0 && (
                        <div className="mt-3">
                          <div className="font-semibold text-slate-300 mb-1.5">
                            Selected {selectedFilePreviews.length} Photo(s):
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {selectedFilePreviews.map((img, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setSelectedFilePreviews((prev) => prev.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/venture-arch-photo.jpg"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* Photo Title */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Photo Title / Label *</label>
                    <input
                      type="text"
                      required
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="e.g. Sri Infra Grand Entrance Arch / 40ft BT Road Laying"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
                    <textarea
                      rows={2}
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                      placeholder="e.g. Construction of 40-feet main venture road and underground drainage pipeline at Keshavapuram Road..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Add to Venture Photos (అప్‌లోడ్ చేయండి)
                    </button>
                  </div>
                </form>
              )}
            </div>
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

                  <button
                    onClick={() => handleDeletePhoto(lightboxImage.id)}
                    className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
