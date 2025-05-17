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
 * Devuelve el valor especial para eliminar un campo en Firestore
 */
export function deleteField() {
  if (Platform.OS === 'web') {
    const { deleteField } = require('firebase/firestore');
    return deleteField();
  } else {
    const firestore = require('@react-native-firebase/firestore').default;
    return firestore.FieldValue.delete();
  }
}

type WhereClause = [string, import('firebase/firestore').WhereFilterOp, any];
type OrderClause = [string, 'asc' | 'desc'];

/**
 * Obtiene documentos de colección con filtros, OR, orden y paginación.
 * @param pathSegments       Ruta dinámica, e.g. ['coleccion','idDoc','subColec']
 * @param andFilters         Condiciones AND
 * @param orFilters          Condiciones OR dentro de un único OR
 * @param orderBy            Campo y dirección para ordenar
 * @param limit              Máximo de documentos
 * @param startAfter         Cursor para paginación
 */
export async function getCollectionWithOptionsFS<T>(
  pathSegments: string[],
  andFilters: WhereClause[] = [],
  orFilters: WhereClause[] = [],
  orderBy: OrderClause[] = [],
  limit?: number,
  startAfter?: any
): Promise<T[]> {
  // Debe terminar en colección (longitud impar)
  if (pathSegments.length % 2 === 0) {
    throw new Error(
      'getCollectionWithOptionsFS: debe terminar en colección (longitud impar)'
    );
  }
  const db = await getDb();
  const isWeb = Platform.OS === 'web';

  // Import dinámico del SDK correcto
  const mod = isWeb
    ? await import('firebase/firestore')
    : await import('@react-native-firebase/firestore');
  const {
    collection,
    query,
    where,
    orderBy: _orderBy,
    limit: _limit,
    startAfter: _startAfter,
    getDocs,
    or,
  } = mod;

  // Referencia a colección
  const collRef = (collection as any)(db as any, ...pathSegments);

  // Construcción de constraints
  const constraints: any[] = [];

  andFilters.forEach(([field, op, val]) => {
    const value = val instanceof Date ? mod.Timestamp.fromDate(val) : val;
    constraints.push((where as any)(field, op, value));
  });

  if (orFilters.length > 0 && (or as any)) {
    const orClauses = orFilters.map(([field, op, val]) => {
      const value = val instanceof Date ? mod.Timestamp.fromDate(val) : val;
      return (where as any)(field, op, value);
    });
    constraints.push((or as any)(...orClauses));
  }

  orderBy.forEach(([field, dir]) => {
    constraints.push((_orderBy as any)(field, dir));
  });

  if (limit != null) {
    constraints.push((_limit as any)(limit));
  }
  if (startAfter != null) {
    constraints.push((_startAfter as any)(startAfter));
  }

  const q = (query as any)(collRef, ...constraints);
  const snap = await (getDocs as any)(q);
  return snap.docs.map((d: any) => d.data() as T);
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
    const ref = (doc as any)(db as any, ...pathSegments);
    const snap = await (getDoc as any)(ref);
    return snap.exists() ? (snap.data() as T) : null;
  } else {
    const { doc, getDoc } = await import('@react-native-firebase/firestore');
    const ref = (doc as any)(db as any, ...pathSegments);
    const snap = await (getDoc as any)(ref);
    return snap.exists ? (snap.data() as T) : null;
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
  const segments = pathSegmentsAndData as string[];
  const isAutoId = segments.length % 2 === 1;
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { collection, doc, setDoc, addDoc, serverTimestamp } = await import(
      'firebase/firestore'
    );
    const fdb = db as any;
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
    const fdb = db as any;
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
 * Actualiza parcialmente un documento según path
 */
export async function updateDocumentByPathFS(
  pathSegments: string[],
  data: Record<string, any>
): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { doc, updateDoc } = await import('firebase/firestore');
    const ref = (doc as any)(db as any, ...pathSegments);
    await (updateDoc as any)(ref, data);
  } else {
    const { doc, updateDoc } = await import('@react-native-firebase/firestore');
    const ref = (doc as any)(db as any, ...pathSegments);
    await (updateDoc as any)(ref, data);
  }
}

/**
 * Elimina un documento en la ruta dada: ...'colección','docId'
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
    const ref = (doc as any)(db as any, ...pathSegments);
    await (deleteDoc as any)(ref);
  } else {
    const { doc, deleteDoc } = await import('@react-native-firebase/firestore');
    const ref = (doc as any)(db as any, ...pathSegments);
    await (deleteDoc as any)(ref);
  }
}
