import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Vite에서 환경 변수는 import.meta.env를 통해 접근합니다.
// Fix: Cast import.meta to any to resolve TypeScript property 'env' error
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseSetup = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
try {
  if (isFirebaseSetup) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

export const db = app ? getFirestore(app) : ({} as any);
export const auth = app ? getAuth(app) : ({} as any);
export const storage = app ? getStorage(app) : ({} as any);