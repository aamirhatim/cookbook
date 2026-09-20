import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    connectFirestoreEmulator,
    type Firestore,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);

// Initialize Firestore with multi-tab IndexedDB persistence for offline support
let db: Firestore;
try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
        }),
    });
} catch {
    db = getFirestore(app);
}

const storage = getStorage(app);

// Flag to prevent re-attaching emulators across Hot Module Replacement (HMR)
let emulatorsConnected = false;

export function initEmulators() {
    const shouldUseEmulators =
        import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost');

    if (shouldUseEmulators && !emulatorsConnected) {
        emulatorsConnected = true;

        // Connect to Auth Emulator
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });

        // Connect to Firestore Emulator
        connectFirestoreEmulator(db, '127.0.0.1', 8080);

        // Connect to Storage Emulator
        connectStorageEmulator(storage, '127.0.0.1', 9199);

        console.info('🔌 Connected to local Firebase Emulators (Auth: 9099, Firestore: 8080, Storage: 9199)');
    }
}

// Automatically connect emulators in browser development environment
if (import.meta.env.DEV) {
    initEmulators();
}

export { app, auth, db, storage };

