import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { DailyUpdate } from '../types';
import { INITIAL_DAILY_UPDATES } from '../data/properties';

const COLLECTION_NAME = 'venture_photos';
const LOCAL_STORAGE_BACKUP = 'sri_infra_venture_photos_v4';
const PHOTO_EVENT_NAME = 'sri_infra_photos_updated';

/**
 * Merge Firestore uploaded photos with initial showcase photos
 */
function mergeWithInitialPhotos(cloudPhotos: DailyUpdate[]): DailyUpdate[] {
  const map = new Map<string, DailyUpdate>();
  
  // First add cloud photos (user uploads have highest priority)
  cloudPhotos.forEach((item) => {
    if (item && item.id && item.imageUrl) {
      map.set(item.id, item);
    }
  });

  // Then add initial default items if they are not already in map
  INITIAL_DAILY_UPDATES.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  const merged = Array.from(map.values());
  
  // Sort user uploaded photos first, then by date / timestamp
  merged.sort((a, b) => {
    const isUserA = a.id.startsWith('photo-') || a.id.startsWith('user-photo-');
    const isUserB = b.id.startsWith('photo-') || b.id.startsWith('user-photo-');
    if (isUserA && !isUserB) return -1;
    if (!isUserA && isUserB) return 1;
    const timeA = new Date((a as any).createdAt || 0).getTime();
    const timeB = new Date((b as any).createdAt || 0).getTime();
    return timeB - timeA;
  });

  return merged;
}

/**
 * Fetch all venture photos from Cloud Firestore.
 */
export async function getStoredPhotos(): Promise<DailyUpdate[]> {
  try {
    const photosRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(photosRef);

    if (!snapshot.empty) {
      const cloudPhotos: DailyUpdate[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id && data.imageUrl) {
          cloudPhotos.push(data as DailyUpdate);
        }
      });

      const merged = mergeWithInitialPhotos(cloudPhotos);

      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(merged));
      } catch (e) {
        // quota safety
      }

      return merged;
    }
  } catch (error) {
    console.warn('Firestore fetch notice (using cache/initial):', error);
  }

  // Fallback to localStorage cache
  try {
    const ls = localStorage.getItem(LOCAL_STORAGE_BACKUP);
    if (ls) {
      const parsed = JSON.parse(ls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return INITIAL_DAILY_UPDATES;
}

/**
 * Save / publish a single photo to Cloud Firestore
 */
export async function savePhotoToCloud(photo: DailyUpdate): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, photo.id);
    const payload = {
      id: photo.id,
      title: photo.title || 'Venture Development Update',
      date: photo.date || new Date().toLocaleDateString('en-IN'),
      category: photo.category || 'Venture Arch & Entrance',
      projectTitle: photo.projectTitle || 'Sri Infra Highway County',
      description: photo.description || 'Latest live on-ground development photo uploaded by management.',
      imageUrl: photo.imageUrl,
      author: photo.author || 'Sri Infra Official',
      createdAt: (photo as any).createdAt || new Date().toISOString(),
    };
    
    await setDoc(docRef, payload, { merge: true });

    // Notify local window listeners immediately
    window.dispatchEvent(new CustomEvent('sri_infra_single_photo_added', { detail: payload }));
    return true;
  } catch (error) {
    console.error('Error saving photo to Firestore:', error);
    return false;
  }
}

/**
 * Save photos list to Firestore and local broadcast
 */
export async function savePhotosToDB(photos: DailyUpdate[]): Promise<boolean> {
  // Always update local cache & broadcast immediately for instant UI update
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(photos));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHOTO_EVENT_NAME, { detail: photos }));
  }

  // Sync any newly added photos to Firestore
  try {
    const userPhotos = photos.filter(p => p.id.startsWith('photo-') || p.id.startsWith('user-photo-'));
    for (const photo of userPhotos) {
      await savePhotoToCloud(photo);
    }
    return true;
  } catch (err) {
    console.error('Failed to sync photos to Firestore:', err);
    return false;
  }
}

/**
 * Delete a photo from Cloud Firestore
 */
export async function deletePhotoFromCloud(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting photo from Firestore:', error);
    return false;
  }
}

/**
 * Subscribe to real-time Cloud Firestore updates across all devices.
 */
export function subscribeToPhotoUpdates(callback: (photos: DailyUpdate[]) => void) {
  let unsubscribeFirestore = () => {};

  try {
    const photosRef = collection(db, COLLECTION_NAME);

    unsubscribeFirestore = onSnapshot(photosRef, (snapshot) => {
      const livePhotos: DailyUpdate[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.id && data.imageUrl) {
            livePhotos.push(data as DailyUpdate);
          }
        });
      }

      const merged = mergeWithInitialPhotos(livePhotos);

      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(merged));
      } catch (e) {}

      callback(merged);
    }, (error) => {
      console.warn('Firestore live subscription notice:', error);
    });
  } catch (err) {
    console.error('Subscribe to photos error:', err);
  }

  const localHandler = (e: any) => {
    if (e.detail) {
      if (Array.isArray(e.detail)) {
        callback(e.detail);
      } else if (e.detail.id) {
        getStoredPhotos().then(callback);
      }
    }
  };

  window.addEventListener(PHOTO_EVENT_NAME, localHandler);
  window.addEventListener('sri_infra_single_photo_added', localHandler);

  return () => {
    unsubscribeFirestore();
    window.removeEventListener(PHOTO_EVENT_NAME, localHandler);
    window.removeEventListener('sri_infra_single_photo_added', localHandler);
  };
}
