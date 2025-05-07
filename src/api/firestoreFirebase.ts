// src/api/firestoreFirebase.ts
import { Platform } from 'react-native';

// Web & Native both use modular API v22

/**
 * Get Firestore instance for Web or Native
 */
async function getDb() {
  if (Platform.OS === 'web') {
    const { getFirestore } = await import('firebase/firestore');
    return getFirestore();
  } else {
    const { getFirestore } = await import('@react-native-firebase/firestore');
    return getFirestore();
  }
}

/**
 * Fetch a single document
 */
export async function getDocumentFS<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, getDoc } = await import('firebase/firestore');
    const ref = doc(
      db as import('firebase/firestore').Firestore,
      collectionName,
      id
    );
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as T) : null;
  } else {
    const { doc, getDoc } = await import('@react-native-firebase/firestore');
    const ref = doc(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      collectionName,
      id
    );
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as T) : null;
  }
}

/**
 * Fetch all documents in a collection
 */
export async function getDocumentsFS<T>(collectionName: string): Promise<T[]> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { collection, getDocs } = await import('firebase/firestore');
    const collRef = collection(
      db as import('firebase/firestore').Firestore,
      collectionName
    );
    const qSnap = await getDocs(collRef);
    return qSnap.docs.map((d) => d.data() as T);
  } else {
    const { collection, getDocs } = await import(
      '@react-native-firebase/firestore'
    );
    const collRef = collection(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      collectionName
    );
    const qSnap = await getDocs(collRef);
    return qSnap.docs.map((d) => d.data() as T);
  }
}

/**
 * Create or replace a document
 */
export async function setDocumentFS<T extends Record<string, any>>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, setDoc, addDoc, collection, serverTimestamp } = await import(
      'firebase/firestore'
    );
    const payload = { ...data, createdAt: serverTimestamp() };
    if (id) {
      const ref = doc(
        db as import('firebase/firestore').Firestore,
        collectionName,
        id
      );
      await setDoc(ref, payload);
      return id;
    } else {
      const collRef = collection(
        db as import('firebase/firestore').Firestore,
        collectionName
      );
      const docRef = await addDoc(collRef, payload);
      return docRef.id;
    }
  } else {
    const { doc, setDoc, addDoc, collection, serverTimestamp } = await import(
      '@react-native-firebase/firestore'
    );
    const payload = { ...data, createdAt: serverTimestamp() };
    if (id) {
      const ref = doc(
        db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
        collectionName,
        id
      );
      await setDoc(ref, payload);
      return id;
    } else {
      const collRef = collection(
        db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
        collectionName
      );
      const docRef = await addDoc(collRef, payload);
      return docRef.id;
    }
  }
}

/**
 * Update an existing document
 */
export async function updateDocumentFS<T>(
  collectionName: string,
  id: string,
  updates: Partial<T>
): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, updateDoc } = await import('firebase/firestore');
    const ref = doc(
      db as import('firebase/firestore').Firestore,
      collectionName,
      id
    );
    await updateDoc(ref, updates as any);
  } else {
    const { doc, updateDoc } = await import('@react-native-firebase/firestore');
    const ref = doc(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      collectionName,
      id
    );
    await updateDoc(ref, updates as any);
  }
}

/**
 * Delete a document
 */
export async function deleteDocumentFS(
  collectionName: string,
  id: string
): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const ref = doc(
      db as import('firebase/firestore').Firestore,
      collectionName,
      id
    );
    await deleteDoc(ref);
  } else {
    const { doc, deleteDoc } = await import('@react-native-firebase/firestore');
    const ref = doc(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      collectionName,
      id
    );
    await deleteDoc(ref);
  }
}
