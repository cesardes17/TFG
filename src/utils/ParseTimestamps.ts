import {
  isFirestoreTimestamp,
  getPlatformTimestampClass,
} from './firebaseUtils';

/**
 * Serializa recursivamente las fechas: Date → Firestore.Timestamp
 */
export async function serializeDates(obj: any): Promise<any> {
  console.log('OBJETO A SERIALIZAR');
  console.log(obj);
  const Timestamp = await getPlatformTimestampClass();

  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
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
