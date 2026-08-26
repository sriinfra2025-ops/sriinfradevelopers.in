import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { DailyUpdate } from '../types';
import { INITIAL_DAILY_UPDATES } from '../data/properties';

const COLLECTION = 'venture_photos';
const CACHE_KEY = 'sri_infra_daily_photos_v6';

const normalize = (photo: DailyUpdate): DailyUpdate => ({
  ...photo,
  createdAt: photo.createdAt || new Date().toISOString(),
});

const sortPhotos = (photos: DailyUpdate[]) =>
  [...photos].sort((a, b) => {
    const ta = new Date(a.createdAt || a.date || 0).getTime();
    const tb = new Date(b.createdAt || b.date || 0).getTime();
    return tb - ta;
  });

export function mergeWithInitialPhotos(cloudPhotos: DailyUpdate[]) {
  const map = new Map<string, DailyUpdate>();
  cloudPhotos.forEach((p) => p?.id && p?.imageUrl && map.set(p.id, normalize(p)));
  INITIAL_DAILY_UPDATES.forEach((p) => {
    if (!map.has(p.id)) map.set(p.id, p);
  });
  return sortPhotos(Array.from(map.values()));
}

export async function getStoredPhotos(): Promise<DailyUpdate[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const photos = mergeWithInitialPhotos(snap.docs.map((d) => d.data() as DailyUpdate));
    localStorage.setItem(CACHE_KEY, JSON.stringify(photos));
    return photos;
  } catch (error) {
    console.warn('Firestore unavailable; using local cache.', error);
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
      return Array.isArray(cached) && cached.length ? cached : INITIAL_DAILY_UPDATES;
    } catch {
      return INITIAL_DAILY_UPDATES;
    }
  }
}

export async function savePhotoToCloud(photo: DailyUpdate) {
  const payload = normalize(photo);
  await setDoc(doc(db, COLLECTION, payload.id), payload, { merge: true });
  return payload;
}

export async function deletePhotoFromCloud(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function subscribeToPhotoUpdates(callback: (photos: DailyUpdate[]) => void) {
  const unsubscribe = onSnapshot(
    collection(db, COLLECTION),
    (snap) => callback(mergeWithInitialPhotos(snap.docs.map((d) => d.data() as DailyUpdate))),
    (error) => console.warn('Live photo updates unavailable:', error)
  );
  return unsubscribe;
}
