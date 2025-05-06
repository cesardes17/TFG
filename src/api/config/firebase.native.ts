import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';
import type { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { getDatabase } from '@react-native-firebase/database';
import type { FirebaseDatabaseTypes } from '@react-native-firebase/database';

// Inicializa la app nativa
const app = getApp();

// Exporta instancias modulares
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// Tipos (opcional)
export type {
  FirebaseAuthTypes,
  FirebaseFirestoreTypes,
  FirebaseStorageTypes,
  FirebaseDatabaseTypes,
};
