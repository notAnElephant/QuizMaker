import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const firebaseAuthEmulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL;
const hasRealFirebaseConfig = [
  import.meta.env.VITE_FIREBASE_API_KEY,
  import.meta.env.VITE_FIREBASE_APP_ID,
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId,
].every(Boolean);
const isFirebaseAuthEmulatorEnabled = Boolean(
  firebaseAuthEmulatorUrl && firebaseProjectId,
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    `demo-app-id-${firebaseProjectId || "quizmaker"}`,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    `${firebaseProjectId || "demo-quizmaker"}.firebaseapp.com`,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-sender-id",
  projectId: firebaseProjectId || "demo-quizmaker",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    `${firebaseProjectId || "demo-quizmaker"}.firebasestorage.app`,
};

export const isFirebaseAuthEnabled =
  hasRealFirebaseConfig || isFirebaseAuthEmulatorEnabled;
export const isFirebaseAuthEmulatorMode = isFirebaseAuthEmulatorEnabled;

const firebaseApp = isFirebaseAuthEnabled
  ? initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseStorage =
  firebaseApp && hasRealFirebaseConfig ? getStorage(firebaseApp) : null;
if (firebaseAuth && firebaseAuthEmulatorUrl) {
  connectAuthEmulator(firebaseAuth, firebaseAuthEmulatorUrl, {
    disableWarnings: true,
  });
}
export const googleAuthProvider = firebaseAuth
  ? new GoogleAuthProvider()
  : null;
