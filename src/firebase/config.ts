import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

/**
 * Diagnostic tool to verify live read/write capability to Cloud Firestore
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const testDoc = doc(db, 'system_health', 'status');
    const timestamp = new Date().toISOString();
    await setDoc(testDoc, {
      status: 'online',
      lastPing: timestamp,
      appletId: 'sri-infra-production',
    }, { merge: true });

    const snap = await getDoc(testDoc);
    if (snap.exists()) {
      return { success: true, message: `Connected to Google Cloud Firestore (${snap.data()?.status})` };
    }
    return { success: true, message: 'Firestore write succeeded' };
  } catch (error: any) {
    console.error('Firestore Diagnostic check error:', error);
    return { success: false, message: error?.message || 'Database connection error' };
  }
}

export default app;
