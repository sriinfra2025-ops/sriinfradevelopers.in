import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Phone,
  MessageCircle,
  Database,
  RefreshCw,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Tag,
  MapPin,
  ShieldCheck,
  Globe,
  Plus
} from 'lucide-react';
import { DailyUpdate } from '../types';
import { INITIAL_DAILY_UPDATES, COMPANY_INFO } from '../data/properties';
import {
  getStoredPhotos,
  savePhotoToCloud,
  savePhotosToDB,
  deletePhotoFromCloud,
  subscribeToPhotoUpdates
} from '../utils/photoStorage';
import { compressImageFile } from '../utils/imageCompressor';
import { testFirestoreConnection } from '../firebase/config';
import { getLocalSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface TestGalleryMainViewProps {
  language: 'te' | 'en';
  setLanguage: (lang: 'te' | 'en') => void;
}

export const TestGalleryMainView: React.FC<TestGalleryMainViewProps> = ({
  language,
  setLanguage,
}) => {
  const [photos, setPhotos] = useState<DailyUpdate[]>(INITIAL_DAILY_UPDATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSettings());

  // Database Connection Diagnostics
  const [dbStatus, setDbStatus] = useState<{ testing: boolean; connected: boolean | null; message: string }>({
    testing: false,
    connected: null,
    message: 'Checking Google Cloud Firestore...',
  });

  // Photo Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Upload Box Toggle & Form States
  const [showUploadCard, setShowUploadCard] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<string>('Venture Arch & Entrance');
  const [photoDescription, setPhotoDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'All',
    'Venture Arch & Entrance',
    'Road Laying & BT Roads',
    'Underground Drainage',
    'Layout & Plots',
    'Guest House Construction',
    'Customer Site Visits',
  ];

  // Test Cloud Firestore Connection
  const handleTestDatabase = async () => {
    setDbStatus({ testing: true, connected: null, message: 'Pinging Google Cloud Firestore...' });
    const res = await testFirestoreConnection();
    setDbStatus({
      testing: false,
      connected: res.success,
      message: res.success ? 'Google Cloud Firestore Connected (Live)' : res.message,
    });
  };

  // Load photos and listen to real-time updates
  useEffect(() => {
    handleTestDatabase();

    getStoredPhotos().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setPhotos(loaded);
      }
    });

    const unsubPhotos = subscribeToPhotoUpdates((updatedList) => {
      if (updatedList && updatedList.length > 0) {
        setPhotos(updatedList);
      }
    });

    const unsubSettings = subscribeToSettings((updatedSettings) => {
      setSettings(updatedSettings);
    });

    return () => {
      unsubPhotos();
      unsubSettings();
    };
  }, []);

  // Handle image files selection from mobile camera / PC
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const fileList = Array.from(files) as File[];
      const compressedList = await Promise.all(
        fileList.map((file: File) => compressImageFile(file, 1200, 1200, 0.75))
      );
      setSelectedPreviews((prev) => [...prev, ...compressedList]);
      if (!photoTitle) {
        setPhotoTitle(`Sri Infra Site Photo - ${new Date().toLocaleDateString('en-IN')}`);
      }
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit and Upload Photos directly to Firestore
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(null);

    const imagesToUpload: string[] = [];
    if (uploadMode === 'device') {
      imagesToUpload.push(...selectedPreviews);
    } else if (imageUrlInput.trim()) {
      imagesToUpload.push(imageUrlInput.trim());
    }

    if (imagesToUpload.length === 0) {
      alert('Please select a photo from your device or paste an image URL.');
      return;
    }

    setIsUploading(true);
    try {
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      const newPhotos: DailyUpdate[] = imagesToUpload.map((imgUrl, i) => ({
        id: `photo-${Date.now()}-${i}`,
        title: photoTitle.trim() || `Sri Infra Highway County Site Photo #${i + 1}`,
        date: dateStr,
        category: photoCategory as any,
        projectTitle: 'Sri Infra Highway County (Pindiprolu Venture)',
        description: photoDescription.trim() || 'Latest on-ground development update photo uploaded by management.',
        imageUrl: imgUrl,
        author: 'Sri Infra Official',
      }));

      // Upload each photo to Firestore
      for (let i = 0; i < newPhotos.length; i++) {
        setUploadStatus(`Uploading photo ${i + 1} of ${newPhotos.length} to Cloud Firestore...`);
        await savePhotoToCloud(newPhotos[i]);
      }

      // Update local state immediately for instant feedback
      const updatedTotal = [...newPhotos, ...photos];
      setPhotos(updatedTotal);
      await savePhotosToDB(updatedTotal);

      setUploadSuccess(`Successfully uploaded ${newPhotos.length} photo(s)! They are now live.`);
      setSelectedPreviews([]);
      setImageUrlInput('');
      setPhotoTitle('');
      setPhotoDescription('');
      setShowUploadCard(false);

      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err?.message || 'Upload failed. Please check your connection.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this photo from the gallery?')) {
      const remaining = photos.filter((p) => p.id !== id);
      setPhotos(remaining);
      await deletePhotoFromCloud(id);
      await savePhotosToDB(remaining);
    }
  };

  // Filtered photos
  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const phoneCallNumber = (settings.phone || COMPANY_INFO.phone).split('/')[0].trim();
  const whatsappNumber = settings.whatsapp || '919849012345';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-red-500/40 py-2.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
              LAUNCH OFFER
            </span>
            <span className="text-amber-300 font-black text-sm">
              ఒక గజం ధర కేవలం {settings.priceFormatted || '₹5,999/-'}
            </span>
            <span className="text-slate-300 hidden sm:inline">
              (Limited Period 3 Months Offer • Pindiprolu, Khammam-Warangal NH)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phoneCallNumber}`}
              className="text-white hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" /> {phoneCallNumber}
            </a>
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3" /> {language === 'te' ? 'English' : 'తెలుగు'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & TITLE SECTION */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Company Title */}
          <div className="text-center md:text-left space-y-0.5">
            <div className="text-amber-400 font-bold text-base sm:text-lg">
              {settings.nameTelugu || 'శ్రీ ఇన్ ఫ్రా డెవలపర్స్ & కన్స్ట్రక్షన్స్'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {settings.name || 'Sri Infra Developers & Constructions'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Sri Infra Highway County, Pindiprolu (Khammam-Warangal NH)
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> DTCP Layout
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20Sri%20Infra,%20I%20want%20details%20about%20Pindiprolu%20Venture%20plots`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>

            <a
              href={`tel:${phoneCallNumber}`}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Call MD
            </a>
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT: REAL-TIME GALLERY & UPLOADER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Real-time Cloud Firestore Connection Status Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Google Cloud Firestore Status:</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {dbStatus.testing ? 'Testing...' : (dbStatus.connected ? 'Connected (Live)' : dbStatus.message)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Photos uploaded here sync immediately and remain permanent across all devices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestDatabase}
              disabled={dbStatus.testing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 text-amber-400 ${dbStatus.testing ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>

            <button
              onClick={() => setShowUploadCard(!showUploadCard)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition"
            >
              {showUploadCard ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showUploadCard ? 'Close Upload' : '➕ Upload New Photo'}</span>
            </button>
          </div>
        </div>

        {/* Upload Success / Error Notifications */}
        {uploadSuccess && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-300 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* 4. PHOTO UPLOAD CARD (TOGGLEABLE) */}
        {showUploadCard && (
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload Venture Site Photo</h3>
                  <p className="text-xs text-slate-400">
                    Take a picture from your phone or choose a file from your computer.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowUploadCard(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Device / URL Switcher */}
              <div className="flex max-w-xs rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadMode('device')}
                  className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    uploadMode === 'device' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Mobile / PC File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    uploadMode === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Web URL
                </button>
              </div>

              {uploadMode === 'device' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFilesSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-950/60 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-white font-bold text-sm">
                      {isCompressing ? 'Compressing and optimizing images...' : 'Click to select photos from phone or computer'}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Supports JPG, PNG, HEIC from camera. Auto-optimizes for fast cloud loading.
                    </p>
                  </div>

                  {/* Previews */}
                  {selectedPreviews.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold text-amber-400">
                        Selected {selectedPreviews.length} Photo(s) ready to upload:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {selectedPreviews.map((preview, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700">
                            <img src={preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setSelectedPreviews((p) => p.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Direct Image Web URL</label>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Photo Title</label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Grand Entrance Arch Progress"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description (Telugu / English)</label>
                <textarea
                  rows={2}
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="e.g. ఖమ్మం - వరంగల్ నేషనల్ హైవే ప్రక్కన పిండిప్రోలు వెంచర్ తాజా ఫోటో."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{uploadStatus || 'Uploading to Cloud...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Publish Photo to Live Gallery</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUploadCard(false)}
                  className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. GALLERY SECTION HEADER & CATEGORIES */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> LIVE ON-GROUND PROGRESS
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {language === 'te' ? 'వెంచర్ తాజా ఫోటో గ్యాలరీ' : 'Venture Daily Live Photo Gallery'}
              </h2>
              <p className="text-xs text-slate-400">
                Showing {filteredPhotos.length} photo(s) • Tap any photo to view in full screen
              </p>
            </div>

            <button
              onClick={() => setShowUploadCard(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Camera className="w-4 h-4" />
              <span>Add More Photos</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6. PHOTO CARDS GRID */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <Camera className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-base font-bold text-white">No photos in this category yet</div>
            <p className="text-xs text-slate-400">Click the upload button above to add the first photo.</p>
            <button
              onClick={() => setShowUploadCard(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] shadow">
                      {photo.category}
                    </span>
                  </div>

                  {/* Fullscreen Expand Icon */}
                  <div className="absolute top-3 right-3 p-2 bg-slate-950/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.date}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-amber-300 transition">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Sri Infra Official
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setLightboxIndex(index)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 7. FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-xs text-amber-400 font-semibold">
                Photo {lightboxIndex + 1} of {filteredPhotos.length}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                {filteredPhotos[lightboxIndex].title}
              </h4>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image View */}
          <div
            className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].imageUrl}
              alt={filteredPhotos[lightboxIndex].title}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />

            {/* Navigation Arrows */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700 transition shadow-xl cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {lightboxIndex < filteredPhotos.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700 transition shadow-xl cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Details Bar */}
          <div
            className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {filteredPhotos[lightboxIndex].description}
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-amber-400">
              <span>📅 {filteredPhotos[lightboxIndex].date}</span>
              <span>•</span>
              <span>🏷️ {filteredPhotos[lightboxIndex].category}</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-400 space-y-3">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="font-extrabold text-white text-sm">
            {settings.name || COMPANY_INFO.name} ({settings.nameTelugu || COMPANY_INFO.nameTelugu})
          </div>
          <p className="text-slate-400 text-xs">
            Managing Director: <strong className="text-amber-400">{settings.managingDirectorName || COMPANY_INFO.managingDirector.name} ({settings.managingDirectorNameTelugu || COMPANY_INFO.managingDirector.nameTelugu})</strong>
          </p>
          <p className="text-slate-500 text-[11px]">
            Opposite Function Hall, Keshavapuram Road, Pindiprolu (V), Tirumalayapalem (M), Khammam to Warangal National Highway.
          </p>
          <div className="pt-2 text-slate-500 text-[10px]">
            © {new Date().getFullYear()} Sri Infra Developers & Constructions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
