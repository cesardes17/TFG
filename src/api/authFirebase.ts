import { Platform } from 'react-native';
import { auth as nativeAuth } from './config/firebase';

const isWeb = Platform.OS === 'web';

/**
 * Inicia sesión con email + password
 */
export async function signInWithEmail(email: string, password: string) {
  if (isWeb) {
    const { getAuth, signInWithEmailAndPassword } = await import(
      'firebase/auth'
    );
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }
  // nativeAuth ya es la instancia modular de getAuth()
  return nativeAuth.signInWithEmailAndPassword(email, password);
}

/**
 * Registra un usuario nuevo con email + password
 */
export async function signUpWithEmail(email: string, password: string) {
  if (isWeb) {
    const { getAuth, createUserWithEmailAndPassword } = await import(
      'firebase/auth'
    );
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }
  return nativeAuth.createUserWithEmailAndPassword(email, password);
}

/**
 * Cierra sesión
 */
export async function signOutUser() {
  if (isWeb) {
    const { getAuth, signOut } = await import('firebase/auth');
    const auth = getAuth();
    return signOut(auth);
  }
  return nativeAuth.signOut();
}

/**
 * Escucha cambios en el estado de auth
 */
export function onAuthStateChangedListener(callback: (user: any) => void) {
  if (isWeb) {
    const { getAuth, onAuthStateChanged } = require('firebase/auth');
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
  }
  return nativeAuth.onAuthStateChanged(callback);
}

/**
 * Elimina el usuario actualmente autenticado
 */
export async function deleteCurrentUser(): Promise<void> {
  if (isWeb) {
    const { getAuth, deleteUser } = await import('firebase/auth');
    const auth = getAuth();
    if (auth.currentUser) {
      return deleteUser(auth.currentUser);
    }
    throw new Error('No hay usuario autenticado');
  }

  const currentUser = nativeAuth.currentUser;
  if (currentUser) {
    return currentUser.delete();
  }

  throw new Error('No hay usuario autenticado');
}

export async function getCurrentUser() {
  if (isWeb) {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    return auth.currentUser;
  }
  return nativeAuth.currentUser;
}
