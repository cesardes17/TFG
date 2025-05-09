// src/api/firestoreFirebase.ts
import { Platform } from 'react-native';

/**
 * Devuelve la instancia de Firestore según plataforma
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
 * Obtiene un documento por path dinámico: ...'colección','docId'
 */
export async function getDocumentByPathFS<T>(
  ...pathSegments: string[]
): Promise<T | null> {
  if (pathSegments.length % 2 !== 0) {
    throw new Error(
      'getDocumentByPathFS: pathSegments debe ser pares [colección, docId]'
    );
  }
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, getDoc } = await import('firebase/firestore');
    const ref = (doc as any)(
      db as import('firebase/firestore').Firestore,
      ...pathSegments
    );
    const snap = await (getDoc as any)(ref);
    return snap.exists() ? (snap.data() as T) : null;
  } else {
    const { doc, getDoc } = await import('@react-native-firebase/firestore');
    const ref = (doc as any)(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      ...pathSegments
    );
    const snap = await (getDoc as any)(ref);
    return snap.exists ? (snap.data() as T) : null;
  }
}

/**
 * Obtiene una colección por path dinámico: ...'colección','docId','subcolección',... terminando en colección
 */
export async function getCollectionByPathFS<T>(
  ...pathSegments: string[]
): Promise<T[]> {
  if (pathSegments.length % 2 === 0) {
    throw new Error(
      'getCollectionByPathFS: pathSegments debe terminar en colección (長idad impar)'
    );
  }
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { collection, getDocs } = await import('firebase/firestore');
    const collRef = (collection as any)(
      db as import('firebase/firestore').Firestore,
      ...pathSegments
    );
    const snap = await (getDocs as any)(collRef);
    return snap.docs.map((d: any) => d.data() as T);
  } else {
    const { collection, getDocs } = await import(
      '@react-native-firebase/firestore'
    );
    const collRef = (collection as any)(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      ...pathSegments
    );
    const snap = await (getDocs as any)(collRef);
    return snap.docs.map((d: any) => d.data() as T);
  }
}

/**
 * Crea o reemplaza un documento según path:
 * - Si pathSegments.length impar → addDoc (ID auto)
 * - Si par → setDoc con ID explícito
 */
export async function setDocumentByPathFS<T extends Record<string, any>>(
  ...pathSegmentsAndData: [...string[], T]
): Promise<string> {
  const data = pathSegmentsAndData.pop() as T;
  // Los elementos restantes son los segmentos de ruta (todos strings)
  const segments = pathSegmentsAndData as string[];
  const isAutoId = segments.length % 2 === 1;
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { collection, doc, setDoc, addDoc, serverTimestamp } = await import(
      'firebase/firestore'
    );
    const fdb = db as import('firebase/firestore').Firestore;
    const payload = { ...data, createdAt: serverTimestamp() };
    if (isAutoId) {
      const collRef = (collection as any)(fdb, ...segments);
      const newRef = await (addDoc as any)(collRef, payload);
      return newRef.id;
    } else {
      const ref = (doc as any)(fdb, ...segments);
      await setDoc(ref, payload);
      return segments[segments.length - 1];
    }
  } else {
    const { collection, doc, setDoc, addDoc, serverTimestamp } = await import(
      '@react-native-firebase/firestore'
    );
    const fdb =
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module;
    const payload = { ...data, createdAt: serverTimestamp() };
    if (isAutoId) {
      const collRef = (collection as any)(fdb, ...segments);
      const newRef = await (addDoc as any)(collRef, payload);
      return newRef.id;
    } else {
      const ref = (doc as any)(fdb, ...segments);
      await setDoc(ref, payload);
      return segments[segments.length - 1];
    }
  }
}

/**
 * Elimina un documento en la ruta dada: ...'colección','docId', etc
 */
export async function deleteDocumentByPathFS(
  ...pathSegments: string[]
): Promise<void> {
  if (pathSegments.length % 2 !== 0) {
    throw new Error('deleteDocumentByPathFS: pathSegments debe ser pares');
  }
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const ref = (doc as any)(
      db as import('firebase/firestore').Firestore,
      ...pathSegments
    );
    await (deleteDoc as any)(ref);
  } else {
    const { doc, deleteDoc } = await import('@react-native-firebase/firestore');
    const ref = (doc as any)(
      db as import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Module,
      ...pathSegments
    );
    await (deleteDoc as any)(ref);
  }
}

/**
 * Obtiene documentos con lógica AND + OR en una ruta arbitraria.
 * @param andFilters Arreglo de tuplas [campo, operador, valor] que se combinan en AND
 * @param orFilters Arreglo de tuplas [campo, operador, valor] que se agrupan bajo un único OR
 * @param pathSegments Ruta: 'colección', 'docId', 'subcolección', ... terminando en colección
 */
export async function getCollectionByPathWithFilterFS<T>(
  andFilters: [string, import('firebase/firestore').WhereFilterOp, any][],
  orFilters: [string, import('firebase/firestore').WhereFilterOp, any][],
  ...pathSegments: string[]
): Promise<T[]> {
  if (pathSegments.length % 2 === 0) {
    throw new Error(
      'getCollectionByPathWithFilterFS: path debe terminar en colección'
    );
  }
  const db = await getDb();
  const isWeb = Platform.OS === 'web';

  // Importa funciones dinámicamente
  const mod = isWeb
    ? await import('firebase/firestore')
    : await import('@react-native-firebase/firestore');
  const { collection, query, where, getDocs, or } = mod;

  // Referencia a la colección
  const collRef = (collection as any)(db as any, ...pathSegments);

  // Construcción de constraints
  const constraints: any[] = [];
  // AND filters
  for (const [field, op, val] of andFilters) {
    constraints.push((where as any)(field, op, val));
  }
  // OR filters (si existen)
  if (orFilters.length > 0) {
    const orClauses = orFilters.map(([field, op, val]) =>
      (where as any)(field, op, val)
    );
    constraints.push((or as any)(...orClauses));
  }

  // Ejecuta query
  const q = (query as any)(collRef, ...constraints);
  const snap = await (getDocs as any)(q);
  return snap.docs.map((d: any) => d.data() as T);
}
