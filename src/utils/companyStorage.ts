import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COMPANY_INFO } from '../data/properties';

export interface CompanySettings {
  name: string;
  nameTelugu: string;
  tagline: string;
  taglineTelugu: string;
  phone: string;
  whatsapp: string;
  email: string;
  priceFormatted: string;
  launchDate: string;
  customLogoUrl?: string | null;
  customArchUrl?: string | null;
  managingDirectorName?: string;
  managingDirectorNameTelugu?: string;
}

const SETTINGS_DOC_PATH = ['site_configuration', 'general_settings'] as const;
const LOCAL_STORAGE_KEY = 'sri_infra_company_settings_v3';
const EVENT_NAME = 'sri_infra_settings_updated';

export const DEFAULT_SETTINGS: CompanySettings = {
  name: COMPANY_INFO.name,
  nameTelugu: COMPANY_INFO.nameTelugu,
  tagline: COMPANY_INFO.tagline,
  taglineTelugu: COMPANY_INFO.taglineTelugu,
  phone: COMPANY_INFO.phone,
  whatsapp: COMPANY_INFO.whatsapp,
  email: COMPANY_INFO.email,
  priceFormatted: COMPANY_INFO.launchOffer.priceFormatted,
  launchDate: COMPANY_INFO.launchOffer.launchDate,
  customLogoUrl: null,
  customArchUrl: null,
  managingDirectorName: COMPANY_INFO.managingDirector.name,
  managingDirectorNameTelugu: COMPANY_INFO.managingDirector.nameTelugu,
};

/**
 * Get current company settings (cached or initial)
 */
export function getLocalSettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

/**
 * Fetch settings from Cloud Firestore
 */
export async function fetchCloudSettings(): Promise<CompanySettings> {
  try {
    const docRef = doc(db, SETTINGS_DOC_PATH[0], SETTINGS_DOC_PATH[1]);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CompanySettings;
      const merged = { ...DEFAULT_SETTINGS, ...data };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {}
      return merged;
    }
  } catch (error) {
    console.warn('Firestore fetch settings notice:', error);
  }
  return getLocalSettings();
}

/**
 * Save settings to Firebase Firestore and broadcast globally
 */
export async function saveCloudSettings(settings: Partial<CompanySettings>): Promise<boolean> {
  const current = getLocalSettings();
  const updated: CompanySettings = {
    ...current,
    ...settings,
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  }

  try {
    const docRef = doc(db, SETTINGS_DOC_PATH[0], SETTINGS_DOC_PATH[1]);
    await setDoc(docRef, updated, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to save settings to Firestore:', error);
    return false;
  }
}

/**
 * Subscribe to real-time company settings updates from Firestore across all devices
 */
export function subscribeToSettings(callback: (settings: CompanySettings) => void) {
  try {
    const docRef = doc(db, SETTINGS_DOC_PATH[0], SETTINGS_DOC_PATH[1]);

    const unsubscribeFirestore = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as CompanySettings;
        const merged = { ...DEFAULT_SETTINGS, ...data };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        callback(merged);
      } else {
        callback(getLocalSettings());
      }
    }, (error) => {
      console.warn('Firestore settings listener error:', error);
    });

    const localHandler = (e: any) => {
      if (e.detail) {
        callback(e.detail);
      }
    };
    window.addEventListener(EVENT_NAME, localHandler);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener(EVENT_NAME, localHandler);
    };
  } catch (e) {
    const localHandler = (e: any) => {
      if (e.detail) callback(e.detail);
    };
    window.addEventListener(EVENT_NAME, localHandler);
    return () => window.removeEventListener(EVENT_NAME, localHandler);
  }
}
