import { Platform } from 'react-native';

/**
 * Devuelve la clase Timestamp según la plataforma
 */
export async function getPlatformTimestampClass() {
  if (Platform.OS === 'web') {
    const mod = await import('firebase/firestore');
    return mod.Timestamp;
  } else {
    const mod = await import('@react-native-firebase/firestore');
    return mod.Timestamp;
  }
}

/**
 * Devuelve true si el objeto parece ser un Timestamp (web o native)
 */
export function isFirestoreTimestamp(obj: any): boolean {
  return (
    obj && typeof obj.toDate === 'function' && typeof obj.seconds === 'number'
  );
}
