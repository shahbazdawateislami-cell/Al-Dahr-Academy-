import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Silence Firestore internal network watchdog warnings (such as 10s streaming timeouts)
setLogLevel('silent');

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errCode = (error as any)?.code;
  const errMsg = error instanceof Error ? error.message : String(error);

  // Avoid noisy console warnings for standard offline/unavailable network blips
  if (
    errCode === 'unavailable' ||
    errMsg.includes('offline') ||
    errMsg.includes('backend') ||
    errMsg.includes('10 seconds') ||
    errMsg.includes('Could not reach Cloud Firestore')
  ) {
    console.info(`[Firestore] Operating with offline cache for ${path || 'query'}.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Context: ', JSON.stringify(errInfo));
  return errInfo;
}

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId;

// Initialize Firestore with immediate long-polling in browser environments to avoid streaming WebSocket timeouts behind reverse proxies/iframes
export const db = (() => {
  try {
    const isBrowser = typeof window !== 'undefined';
    return initializeFirestore(
      app,
      isBrowser
        ? { experimentalForceLongPolling: true }
        : { experimentalAutoDetectLongPolling: true },
      databaseId
    );
  } catch {
    return getFirestore(app, databaseId);
  }
})();

export const auth = getAuth(app);

// Google Auth Provider configured for clean, frictionless sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export let cachedWorkspaceToken: string | null = null;

export async function signInAdminWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedWorkspaceToken = credential.accessToken;
    }
    return result.user;
  } catch (err: any) {
    // Handle expected user cancellation or popup dismissal cleanly
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request'
    ) {
      console.info('Google sign-in popup was dismissed by user.');
      return null;
    }
    if (err?.code === 'auth/popup-blocked') {
      console.warn('Google sign-in popup was blocked by the browser.');
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups or use the Admin Passcode below.');
    }
    if (err?.code === 'auth/unauthorized-domain') {
      console.warn('Domain not authorized for Google Sign-In in Firebase Console.');
      throw new Error('Current domain is not authorized in Firebase Auth. Please use the Admin Passcode (aldahr2025) below.');
    }
    console.warn('Sign-in issue encountered:', err?.message || err);
    throw err;
  }
}

export async function signOutAdmin() {
  await signOut(auth);
  cachedWorkspaceToken = null;
}

// Connection test on boot (softly checks connection without throwing unhandled exceptions)
export async function testConnection() {
  try {
    const probePromise = getDocFromServer(doc(db, 'settings', 'test-connection'));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 4000)
    );
    await Promise.race([probePromise, timeoutPromise]);
  } catch (error: any) {
    if (
      error?.code === 'unavailable' ||
      error?.message?.includes('offline') ||
      error?.message?.includes('could not reach') ||
      error?.message?.includes('timeout')
    ) {
      console.info('[Firestore] Initial connection probe: operating with cache/optimistic state.');
    }
  }
}

testConnection();
