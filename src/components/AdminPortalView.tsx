import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Key,
  RefreshCw,
  LogOut,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  Database,
  Tag,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { COMPANY_INFO, INITIAL_DAILY_UPDATES } from '../data/properties';
import { DailyUpdate } from '../types';
import {
  checkIsAdmin,
  loginAdmin,
  logoutAdmin,
  getStoredAdminPin,
  setCustomAdminPin
} from '../utils/adminAuth';
import { 
  getStoredPhotos, 
  savePhotoToCloud, 
  savePhotosToDB, 
  subscribeToPhotoUpdates, 
  deletePhotoFromCloud 
} from '../utils/photoStorage';
import { compressImageFile } from '../utils/imageCompressor';
import { testFirestoreConnection } from '../firebase/config';
import { getLocalSettings, saveCloudSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface AdminPortalViewProps {
  onExitAdmin: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onExitAdmin }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => checkIsAdmin());
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab inside Admin
  const [activeTab, setActiveTab] = useState<'photos' | 'branding' | 'settings' | 'security'>('photos');

  // Venture Photos State
  const [updates, setUpdates] = useState<DailyUpdate[]>(INITIAL_DAILY_UPDATES);

  // Database Connection Diagnostics State
  const [dbStatus, setDbStatus] = useState<{ testing: boolean; connected: boolean | null; message: string }>({
    testing: false,
    connected: null,
    message: 'Connecting to Google Cloud Firestore...',
  });

  const handleTestDatabase = async () => {
    setDbStatus({ testing: true, connected: null, message: 'Pinging Google Cloud Firestore...' });
    const res = await testFirestoreConnection();
    setDbStatus({
      testing: false,
      connected: res.success,
      message: res.message,
    });
  };

  // Load photos & subscribe to real-time updates
  useEffect(() => {
    handleTestDatabase();

    getStoredPhotos().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setUpdates(loaded);
      }
    });

    const unsubscribePhotos = subscribeToPhotoUpdates((updatedList) => {
      if (updatedList && updatedList.length > 0) {
        setUpdates(updatedList);
      }
    });

    const unsubscribeSettings = subscribeToSettings((updatedSettings) => {
      setCompanySettings(updatedSettings);
    });

    return () => {
      unsubscribePhotos();
      unsubscribeSettings();
    };
  }, []);

  // Photo Uploader Form State
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<string>('Venture Arch & Entrance');
  const [photoDescription, setPhotoDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedFilePreviews, setSelectedFilePreviews] = useState<string[]>([]);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishProgress, setPublishProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => getLocalSettings());
  const [settingsSavedNotice, setSettingsSavedNotice] = useState<boolean>(false);
  const [tempLogoUrl, setTempLogoUrl] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const archInputRef = useRef<HTMLInputElement>(null);

  // Security / PIN State
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);

  const categories = [
    'Venture Arch & Entrance',
    'Road Laying & BT Roads',
    'Underground Drainage',
    'Layout & Plots',
    'Guest House Construction',
    'Customer Site Visits',
    'Plantation & Park',
  ];

  const handleLoginWithPin = (pinToTest: string) => {
    setLoginError(null);
    const success = loginAdmin(pinToTest);
    if (success) {
      setIsAdmin(true);
      setPinInput('');
    } else {
      setLoginError('Invalid Passcode. Enter the authorized Sri Infra Admin PIN (Default: 2025).');
    }
  };

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginWithPin(pinInput);
  };

  const handleKeypadPress = (val: string) => {
    setLoginError(null);
    if (val === 'clear') {
      setPinInput('');
    } else if (val === 'backspace') {
      setPinInput((prev) => prev.slice(0, -1));
    } else {
      const nextPin = pinInput + val;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        // Auto submit on 4th digit
        setTimeout(() => handleLoginWithPin(nextPin), 150);
      }
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setPinInput('');
  };

  // Handle Photo files selection with instant auto-compression
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const fileList = Array.from(files) as File[];
      const compressedPromises = fileList.map((file: File) => compressImageFile(file, 1000, 1000, 0.72));
      const results = await Promise.all(compressedPromises);
      setSelectedFilePreviews((prev) => [...prev, ...results]);
      if (!photoTitle) {
        setPhotoTitle(`Sri Infra Venture Site Progress ${new Date().toLocaleDateString('en-IN')}`);
      }
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSavePhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadErrorMessage(null);
    setUploadSuccessMessage(null);
    const photosToAdd: string[] = [];

    if (uploadMode === 'device') {
      photosToAdd.push(...selectedFilePreviews);
    } else if (imageUrlInput.trim()) {
      photosToAdd.push(imageUrlInput.trim());
    }

    if (photosToAdd.length === 0) {
      alert('Please select at least one photo or enter a photo URL.');
      return;
    }

    setIsPublishing(true);

    try {
      const todayDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const newItems: DailyUpdate[] = photosToAdd.map((imgSrc, index) => ({
        id: `photo-${Date.now()}-${index}`,
        title: photoTitle.trim() || `Sri Infra Highway County Site Photo #${index + 1}`,
        date: todayDate,
        category: photoCategory as any,
        projectTitle: 'Sri Infra Highway County (Pindiprolu Venture)',
        description: photoDescription.trim() || 'Latest live on-ground development photo uploaded by management.',
        imageUrl: imgSrc,
        author: 'Sri Infra Official',
      }));

      // 1. Write each photo directly to Firestore
      for (let i = 0; i < newItems.length; i++) {
        setPublishProgress(`Uploading photo ${i + 1} of ${newItems.length} to Cloud Firestore...`);
        await savePhotoToCloud(newItems[i]);
      }

      // 2. Immediately update local state so admin sees it instantly
      const updatedTotalList = [...newItems, ...updates];
      setUpdates(updatedTotalList);
      await savePhotosToDB(updatedTotalList);

      setUploadSuccessMessage(`Successfully published ${photosToAdd.length} photo(s) to live website!`);
      setSelectedFilePreviews([]);
      setImageUrlInput('');
      setPhotoTitle('');
      setPhotoDescription('');

      setTimeout(() => {
        setUploadSuccessMessage(null);
        setPublishProgress('');
      }, 4000);
    } catch (err: any) {
      console.error('Error saving photo:', err);
      setUploadErrorMessage(err?.message || 'Upload failed. Please check your connection.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this photo?')) {
      const remaining = updates.filter((item) => item.id !== id);
      setUpdates(remaining);
      await deletePhotoFromCloud(id);
      await savePhotosToDB(remaining);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 512, 512, 0.9);
        const updated = { ...companySettings, customLogoUrl: compressed };
        setCompanySettings(updated);
        await saveCloudSettings(updated);
        setSettingsSavedNotice(true);
        setTimeout(() => setSettingsSavedNotice(false), 2500);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleArchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 900, 0.8);
        const updated = { ...companySettings, customArchUrl: compressed };
        setCompanySettings(updated);
        await saveCloudSettings(updated);
        setSettingsSavedNotice(true);
        setTimeout(() => setSettingsSavedNotice(false), 2500);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...companySettings,
      customLogoUrl: tempLogoUrl.trim() ? tempLogoUrl.trim() : companySettings.customLogoUrl,
    };
    await saveCloudSettings(updated);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2500);
  };

  const handleResetBranding = async () => {
    const reset = {
      ...companySettings,
      name: COMPANY_INFO.name,
      nameTelugu: COMPANY_INFO.nameTelugu,
      tagline: COMPANY_INFO.tagline,
      taglineTelugu: COMPANY_INFO.taglineTelugu,
      customLogoUrl: null,
    };
    setCompanySettings(reset);
    await saveCloudSettings(reset);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    if (newPin.trim().length < 4) {
      setPinChangeError('PIN must be at least 4 characters or digits.');
      return;
    }
    const saved = setCustomAdminPin(newPin.trim());
    if (saved) {
      setPinChangeSuccess(true);
      setNewPin('');
      setTimeout(() => setPinChangeSuccess(false), 2500);
    }
  };

  // ==========================================
  // IF NOT AUTHENTICATED: SHOW SECURE PIN GATE
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Management Portal
            </div>
            <h1 className="text-2xl font-black text-white">Sri Infra Admin Login</h1>
            <p className="text-xs text-slate-400">
              Enter your 4-digit security PIN to unlock photo upload & management controls.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginFormSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Admin Passcode / Master PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  maxLength={10}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-white font-mono text-center tracking-[0.4em] text-2xl outline-none transition shadow-inner"
                />
              </div>
            </div>

            {/* Quick Touch Keypad for Mobile & Quick Entry */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num.toString())}
                  className="py-3 bg-slate-950 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-base transition flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypadPress('clear')}
                className="py-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 bg-slate-950 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-base transition flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('backspace')}
                className="py-3 bg-slate-950 hover:bg-slate-800 text-red-400 border border-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                ⌫ Delete
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" /> Unlock Admin Access
            </button>

            {/* Quick 1-Click Login Helper */}
            <button
              type="button"
              onClick={() => handleLoginWithPin('2025')}
              className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs transition border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quick Login with Master PIN: 2025
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED: RENDER ADMIN PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Admin Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-md">
              శ్రీ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-wide">
                  {companySettings.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Management Control Panel • Highway County Venture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal (Logout)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Real-time Cloud Connection Health Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-white">Google Cloud Firestore Database</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  LIVE REAL-TIME SYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {dbStatus.message}
              </p>
            </div>
          </div>

          <button
            onClick={handleTestDatabase}
            disabled={dbStatus.testing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${dbStatus.testing ? 'animate-spin' : ''}`} />
            <span>{dbStatus.testing ? 'Testing...' : 'Test Database Sync'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Venture Photos ({updates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Company Branding & Titles</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pricing, Phones & MD Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Admin PIN & Security</span>
          </button>
        </div>

        {/* TAB 1: VENTURE PHOTOS & UPLOADER */}
        {activeTab === 'photos' && (
          <div className="space-y-8">
            {/* Upload Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Upload Venture Site Photos</h2>
                  <p className="text-xs text-slate-400">
                    Add photos from your mobile camera or computer. They are saved directly to Google Cloud Firestore.
                  </p>
                </div>
              </div>

              {uploadSuccessMessage && (
                <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{uploadSuccessMessage}</span>
                </div>
              )}

              {uploadErrorMessage && (
                <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-300 text-xs font-bold animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{uploadErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSavePhotos} className="space-y-5 text-xs">
                {/* Switcher */}
                <div className="flex max-w-sm rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUploadMode('device')}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === 'device' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" /> From Phone / PC
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Image URL
                  </button>
                </div>

                {uploadMode === 'device' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-950/50 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-white font-bold text-sm">
                        {isCompressing ? 'Optimizing images for instant cloud upload...' : 'Click here to choose photos from your device'}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Select multiple photos (PNG, JPG, HEIC, WebP). Automatic HD compression included.
                      </p>
                    </div>

                    {/* Previews */}
                    {selectedFilePreviews.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs font-bold text-amber-400">
                          Selected {selectedFilePreviews.length} Photo(s) to Publish:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {selectedFilePreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700">
                              <img src={preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setSelectedFilePreviews((p) => p.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
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
                    <label className="block text-slate-300 font-bold mb-1.5">Direct Image Web URL</label>
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
                    <label className="block text-slate-300 font-bold mb-1.5">Photo Title / Headline</label>
                    <input
                      type="text"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="e.g. Highway County Grand Entrance Arch Works"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Venture Category</label>
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Telugu / English Progress Description</label>
                  <textarea
                    rows={2}
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    placeholder="e.g. ఖమ్మం - వరంగల్ నేషనల్ హైవే ప్రక్కన పిండిప్రోలు వెంచర్ లో రోడ్ల నిర్మాణం మరియు ప్లాట్ల హద్దుల పనులు వేగవంతంగా జరుగుతున్నాయి."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> {publishProgress || 'Publishing to Google Cloud Firestore...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Publish Photos to Live Website
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Current Photos List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Live Gallery Photos ({updates.length})</h3>
                  <p className="text-xs text-slate-400">All photos currently visible to visitors worldwide</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {updates.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-black">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">{item.date}</div>
                        <h4 className="font-bold text-white text-xs mt-0.5 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-mono font-semibold">
                          ₹5,999/sq.yd
                        </span>
                        <button
                          onClick={() => handleDeletePhoto(item.id)}
                          className="px-2.5 py-1 bg-red-950 text-red-300 hover:bg-red-900 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRANDING & LOGO */}
        {activeTab === 'branding' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Logo & Brand Identity</h2>
                <p className="text-xs text-slate-400">
                  Update the company logo, English title, Telugu name, and tagline synced live via Firebase.
                </p>
              </div>
            </div>

            {settingsSavedNotice && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Brand settings synced to Google Cloud!</span>
              </div>
            )}

            <form onSubmit={handleSaveCompanySettings} className="space-y-5 text-xs">
              {/* Logo Preview & Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {companySettings.customLogoUrl ? (
                    <img
                      src={companySettings.customLogoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-amber-400 font-bold text-center text-xs">
                      Default<br />Logo
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-xs font-bold text-white">Company Logo Image</div>
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
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Logo
                    </button>
                    {companySettings.customLogoUrl && (
                      <button
                        type="button"
                        onClick={handleResetBranding}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grand Entrance Arch Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-24 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  <img
                    src={companySettings.customArchUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'}
                    alt="Grand Arch"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-xs font-bold text-white">Venture Grand Entrance Arch Photo</div>
                  <input
                    type="file"
                    ref={archInputRef}
                    accept="image/*"
                    onChange={handleArchUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => archInputRef.current?.click()}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Arch Photo
                    </button>
                    {companySettings.customArchUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = { ...companySettings, customArchUrl: null };
                          setCompanySettings(updated);
                          await saveCloudSettings(updated);
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset Arch
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Company Title (English)</label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Company Title (Telugu)</label>
                <input
                  type="text"
                  value={companySettings.nameTelugu}
                  onChange={(e) => setCompanySettings({ ...companySettings, nameTelugu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Tagline / Subtitle (English)</label>
                <input
                  type="text"
                  value={companySettings.tagline}
                  onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Tagline / Subtitle (Telugu)</label>
                <input
                  type="text"
                  value={companySettings.taglineTelugu}
                  onChange={(e) => setCompanySettings({ ...companySettings, taglineTelugu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <Save className="w-4 h-4" /> Save Brand Details to Cloud
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PRICING, PHONES & MD DETAILS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pricing, Phone & Contact Info</h2>
                <p className="text-xs text-slate-400">
                  Update customer contact numbers, launch price per sq.yd, and launch date.
                </p>
              </div>
            </div>

            {settingsSavedNotice && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Contact details & Pricing synced to Google Cloud!</span>
              </div>
            )}

            <form onSubmit={handleSaveCompanySettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Official Phone Numbers</label>
                  <input
                    type="text"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    placeholder="+91 98490 12345 / +91 80080 67890"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">WhatsApp Number (e.g. 919849012345)</label>
                  <input
                    type="text"
                    value={companySettings.whatsapp}
                    onChange={(e) => setCompanySettings({ ...companySettings, whatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Launch Offer Price (Formatted)</label>
                  <input
                    type="text"
                    value={companySettings.priceFormatted}
                    onChange={(e) => setCompanySettings({ ...companySettings, priceFormatted: e.target.value })}
                    placeholder="₹5,999/-"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Launch Date Note</label>
                  <input
                    type="text"
                    value={companySettings.launchDate}
                    onChange={(e) => setCompanySettings({ ...companySettings, launchDate: e.target.value })}
                    placeholder="19.08.2026 (బుధవారం)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Managing Director Name (English)</label>
                  <input
                    type="text"
                    value={companySettings.managingDirectorName || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, managingDirectorName: e.target.value })}
                    placeholder="Srinivas Bhoga"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Managing Director Name (Telugu)</label>
                  <input
                    type="text"
                    value={companySettings.managingDirectorNameTelugu || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, managingDirectorNameTelugu: e.target.value })}
                    placeholder="శ్రీనివాసు భోగ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Contact Email</label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <Save className="w-4 h-4" /> Save Contact & Pricing Details
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: SECURITY & PIN */}
        {activeTab === 'security' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Security & Passcode</h2>
                <p className="text-xs text-slate-400">Change your secret PIN for logging into Sri Infra Admin.</p>
              </div>
            </div>

            {pinChangeSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Admin Passcode successfully updated!</span>
              </div>
            )}

            {pinChangeError && (
              <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-300 text-xs font-bold animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{pinChangeError}</span>
              </div>
            )}

            <form onSubmit={handleChangePin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Current PIN: <span className="font-mono text-amber-400">{getStoredAdminPin()}</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">New Admin PIN</label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN (at least 4 digits)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-base tracking-widest font-mono outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <Save className="w-4 h-4" /> Save New Passcode
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
