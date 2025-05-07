// src/utils/getRandomUID.ts
// 1) Importa el polyfill una única vez
import 'react-native-get-random-values';
// 2) Importa uuid
import { v4 as uuidv4 } from 'uuid';

/**
 * Devuelve un UUID v4 válido en React Native / Expo.
 */
export function getRandomUID(): string {
  return uuidv4();
}
