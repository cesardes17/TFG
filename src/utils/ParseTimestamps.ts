import {
  isFirestoreTimestamp,
  getPlatformTimestampClass,
} from './firebaseUtils';

/**
 * Detecta si un objeto es un FieldValue especial (como deleteField, serverTimestamp, etc.)
 */
function isFirestoreFieldValue(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    (typeof obj._methodName === 'string' || obj._type === 'delete')
  );
}

/**
 * Serializa recursivamente las fechas: Date → Firestore.Timestamp
 * Mantiene los valores especiales de Firestore como deleteField y serverTimestamp.
 */
export async function serializeDates(obj: any): Promise<any> {
  const Timestamp = await getPlatformTimestampClass();

  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }

  if (isFirestoreFieldValue(obj)) {
    return obj; // no lo tocamos
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(serializeDates));
  }

  if (obj && typeof obj === 'object') {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => [
        key,
        await serializeDates(value),
      ])
    );
    return Object.fromEntries(entries);
  }

  return obj;
}

/**
 * Parsea recursivamente: Firestore.Timestamp → Date
 */
export function parseTimestamps(obj: any): any {
  if (isFirestoreTimestamp(obj)) {
    return obj.toDate();
  }

  if (Array.isArray(obj)) {
    return obj.map(parseTimestamps);
  }

  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, parseTimestamps(value)])
    );
  }

  return obj;
}
