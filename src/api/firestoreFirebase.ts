// src/api/firestoreFirebase.ts
import { Platform } from 'react-native';

// Web & Native usan la misma API modular en v22
// Solo cambia el paquete de donde importas las funciones:
//  • Web:  'firebase/firestore'
//  • Native:'@react-native-firebase/firestore'
//
// En ambos casos:
//  import { getFirestore, doc, collection, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from '...';

let webDb: import('firebase/firestore').Firestore;
let nativeDb: import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module;

if (Platform.OS === 'web') {
  webDb = require('./config/firebase').firestore as any;
} else {
  // Esta instancia ya no la usaremos para operaciones; solo sirve si en algún punto necesitas acceder al Module
  nativeDb = require('./config/firebase').firestore as any;
}

// ------------------------------------------------------------

/**
 * Crea o reemplaza un documento en Firestore
 */
export async function setDocumentFS<T extends Record<string, any>>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> {
  if (Platform.OS === 'web') {
    const { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } =
      await import('firebase/firestore');
    const db = getFirestore();
    // Inyectamos createdAt usando serverTimestamp si lo deseas
    const payload = { ...data, createdAt: serverTimestamp() };

    if (id) {
      const ref = doc(db, collectionName, id);
      await setDoc(ref, payload);
      return id;
    } else {
      const collRef = collection(db, collectionName);
      const docRef = await addDoc(collRef, payload);
      return docRef.id;
    }
  } else {
    const { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } =
      await import('@react-native-firebase/firestore');
    const db = getFirestore();
    const payload = { ...data, createdAt: serverTimestamp() };

    if (id) {
      const ref = doc(db, collectionName, id);
      await setDoc(ref, payload);
      return id;
    } else {
      const collRef = collection(db, collectionName);
      const docRef = await addDoc(collRef, payload);
      return docRef.id;
    }
  }
}

/**
 * Actualiza parcialmente un documento existente
 */
export async function updateDocumentFS<T>(
  collectionName: string,
  id: string,
  updates: Partial<T>
): Promise<void> {
  if (Platform.OS === 'web') {
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, updates as any);
  } else {
    const { getFirestore, doc, updateDoc } = await import(
      '@react-native-firebase/firestore'
    );
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, updates as any);
  }
}

/**
 * Elimina un documento
 */
export async function deleteDocumentFS(
  collectionName: string,
  id: string
): Promise<void> {
  if (Platform.OS === 'web') {
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
  } else {
    const { getFirestore, doc, deleteDoc } = await import(
      '@react-native-firebase/firestore'
    );
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
  }
}
