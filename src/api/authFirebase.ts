// src/api/authFirebase.ts
import { Platform } from 'react-native';
import { auth } from './config/firebase';

/**
 * Sign in user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  if (Platform.OS === 'web') {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    return signInWithEmailAndPassword(
      auth as import('firebase/auth').Auth,
      email,
      password
    );
  }
  return (
    auth as import('@react-native-firebase/auth').FirebaseAuthTypes.Module
  ).signInWithEmailAndPassword(email, password);
};

/**
 * Create new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  if (Platform.OS === 'web') {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    return createUserWithEmailAndPassword(
      auth as import('firebase/auth').Auth,
      email,
      password
    );
  }
  return (
    auth as import('@react-native-firebase/auth').FirebaseAuthTypes.Module
  ).createUserWithEmailAndPassword(email, password);
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  if (Platform.OS === 'web') {
    const { signOut } = await import('firebase/auth');
    return signOut(auth as import('firebase/auth').Auth);
  }
  return (
    auth as import('@react-native-firebase/auth').FirebaseAuthTypes.Module
  ).signOut();
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  if (Platform.OS === 'web') {
    const { onAuthStateChanged } = require('firebase/auth');
    return onAuthStateChanged(auth as import('firebase/auth').Auth, callback);
  }
  return (
    auth as import('@react-native-firebase/auth').FirebaseAuthTypes.Module
  ).onAuthStateChanged(callback);
};
