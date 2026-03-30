/**
 * @fileoverview Firebase SDK — CalcPro.NP
 *
 * Lazy initialization: Firebase only loads when needed.
 * If .env.local is missing, all 37 calculator pages still work.
 * Only blog + admin pages require Firebase.
 *
 * Setup: copy .env.local.example → .env.local, fill credentials.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export function isConfigured(): boolean {
  const k = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!(k && k !== 'your_api_key_here' && k.length > 10);
}

let _app: FirebaseApp | null = null;

function getApp(): FirebaseApp | null {
  if (!isConfigured()) return null;
  if (_app) return _app;
  if (getApps().length > 0) { _app = getApps()[0]; return _app; }
  try {
    _app = initializeApp({
      apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    return _app;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('CalcPro: Firebase not configured — blog/admin disabled.');
    }
    return null;
  }
}

export function getDb(): Firestore | null {
  const app = getApp();
  if (!app) return null;
  try { return process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ? getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID) : getFirestore(app); }
  catch { return null; }
}

export function getFirebaseAuth(): Auth | null {
  const app = getApp();
  if (!app) return null;
  try { return getAuth(app); }
  catch { return null; }
}

export const db   = getDb();
export const auth = getFirebaseAuth();

export enum OperationType {
  CREATE = 'create', UPDATE = 'update', DELETE = 'delete',
  LIST = 'list', GET = 'get', WRITE = 'write',
}

export function handleFirestoreError(
  error: unknown, operation: OperationType, resource: string
): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Firestore ${operation} on '${resource}':`, error);
  }
}
