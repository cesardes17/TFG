// src/api/config/firebase.web.ts
import Constants from 'expo-constants';
import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';

// Load Firebase config injected via app.config.js
const extra = Constants.expoConfig?.extra as {
  firebaseConfig?: FirebaseOptions;
};
const firebaseConfig = extra.firebaseConfig;

if (!firebaseConfig) {
  throw new Error(
    'Missing Firebase configuration. Ensure your .env and app.config.js define the FIREBASE_* variables.'
  );
}

// Initialize Firebase Web SDK (Modular API)
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const database: Database = getDatabase(app);

export { auth, firestore, storage, database };
