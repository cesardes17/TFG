import Constants from 'expo-constants';
import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';

// Lee la config desde app.config.js → extra.firebaseConfig
const extra = Constants.expoConfig?.extra as {
  firebaseConfig?: FirebaseOptions;
};
const firebaseConfig = extra.firebaseConfig;
if (!firebaseConfig) {
  throw new Error(
    'Missing Firebase config in Constants.expoConfig.extra. Revisa tu .env y app.config.js'
  );
}

// Inicializa la app web
const appWeb: FirebaseApp = initializeApp(firebaseConfig);

// Exporta instancias modulares
export const auth: Auth = getAuth(appWeb);
export const firestore: Firestore = getFirestore(appWeb);
export const storage: FirebaseStorage = getStorage(appWeb);
export const database: Database = getDatabase(appWeb);
