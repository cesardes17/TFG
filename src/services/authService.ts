// src/services/authService.ts
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthStateChangedListener,
} from '../api/authFirebase';

/**
 * Higher-level Auth Service wrapping Firebase auth operations
 */
export const AuthService = {
  /**
   * Logs in a user with email and password
   */
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmail(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registers a new user
   */
  register: async (email: string, password: string) => {
    try {
      const userCredential = await signUpWithEmail(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logs out the current user
   */
  logout: async () => {
    try {
      await signOutUser();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Subscribes to auth state changes
   */
  onAuthChange: (callback: (user: any) => void) => {
    return onAuthStateChangedListener(callback);
  },
};
