// src/api/realtimeFirebase.ts
import { Platform } from 'react-native';

// Tipos de Firebase Realtime Database para web y nativo
type WebDB = import('firebase/database').Database;
type NativeDB =
  import('@react-native-firebase/database').FirebaseDatabaseTypes.Module;

let nativeDatabase: NativeDB | null = null;

/**
 * Devuelve la instancia de Realtime Database según plataforma.
 */
async function getDb(): Promise<WebDB | NativeDB> {
  if (Platform.OS === 'web') {
    const { getDatabase } = await import('firebase/database');
    // Asume que ya has inicializado firebase/app en algún lugar
    return getDatabase();
  } else {
    if (!nativeDatabase) {
      // @ts-ignore
      nativeDatabase = (
        await import('@react-native-firebase/database')
      ).default();
    }
    return nativeDatabase;
  }
}

/**
 * Convierte un valor de JavaScript a algo que RTDB entienda.
 * En Realtime DB, los Timestamps los puedes guardar como `serverTimestamp()`
 * o bien como un número UNIX. Aquí ponemos como ejemplo serverTimestamp() solo en web.
 */
function getServerTimestamp() {
  if (Platform.OS === 'web') {
    const { serverTimestamp } = require('firebase/database');
    return serverTimestamp();
  } else {
    // react-native-firebase no tiene serverTimestamp de la misma forma;
    // si necesitas timestamp del servidor, tendrías que escribir Date.now() en el cliente
    return Date.now();
  }
}

/**
 * Escribe (o reemplaza) un nodo completo en Realtime DB.
 */
export async function setValueRT<T = any>(
  pathSegments: string[],
  value: T
): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { ref, set } = await import('firebase/database');
    const r = ref(db as WebDB, pathSegments.join('/'));
    await set(r, value);
  } else {
    // Native
    const r = (db as NativeDB).ref(pathSegments.join('/'));
    await r.set(value);
  }
}

/**
 * Actualiza campos puntuales dentro de un nodo (merge parcial).
 */
export async function updateValueRT<T = any>(
  pathSegments: string[],
  updates: Partial<T>
): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { ref, update } = await import('firebase/database');
    const r = ref(db as WebDB, pathSegments.join('/'));
    await update(r, updates);
  } else {
    const r = (db as NativeDB).ref(pathSegments.join('/'));
    await r.update(updates as any);
  }
}

/**
 * Elimina un nodo completo.
 */
export async function removeValueRT(pathSegments: string[]): Promise<void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { ref, remove } = await import('firebase/database');
    const r = ref(db as WebDB, pathSegments.join('/'));
    await remove(r);
  } else {
    const r = (db as NativeDB).ref(pathSegments.join('/'));
    await r.remove();
  }
}

/**
 * Lee el valor una única vez.
 */
export async function getValueRT<T = any>(
  pathSegments: string[]
): Promise<T | null> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { ref, get } = await import('firebase/database');
    const r = ref(db as WebDB, pathSegments.join('/'));
    const snapshot = await get(r);
    return snapshot.exists() ? (snapshot.val() as T) : null;
  } else {
    const r = (db as NativeDB).ref(pathSegments.join('/'));
    const snapshot = await r.once('value');
    return snapshot.exists() ? (snapshot.val() as T) : null;
  }
}

/**
 * Se suscribe en tiempo real a un nodo. Devuelve una función para desenlazar.
 * callback se ejecuta con el valor cada vez que cambia.
 */
export async function onValueRT<T = any>(
  pathSegments: string[],
  callback: (val: T | null) => void
): Promise<() => void> {
  const db = await getDb();
  if (Platform.OS === 'web') {
    const { ref, onValue, off } = await import('firebase/database');
    const r = ref(db as WebDB, pathSegments.join('/'));
    const listener = onValue(r, (snapshot) => {
      callback(snapshot.exists() ? (snapshot.val() as T) : null);
    });
    // `listener` es simplemente una referencia interna; para desenlazar:
    return () => off(r, 'value', listener);
  } else {
    const r = (db as NativeDB).ref(pathSegments.join('/'));
    const subscription = r.on('value', (snapshot: any) => {
      callback(snapshot.exists ? (snapshot.val() as T) : null);
    });
    return () => r.off('value', subscription);
  }
}
