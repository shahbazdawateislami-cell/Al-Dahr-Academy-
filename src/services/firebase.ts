import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
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

// Connection test on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'test-connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline status detected. Operating with optimistic state.');
    }
  }
}

testConnection();
