import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthStateChangedListener,
} from '../api/authFirebase';

/**
 * Capa de servicio de Auth para el resto de la app
 */
export const AuthService = {
  async login(email: string, password: string) {
    const credential = await signInWithEmail(email, password);
    return credential.user;
  },

  async register(email: string, password: string) {
    const credential = await signUpWithEmail(email, password);
    return credential.user;
  },

  async logout() {
    await signOutUser();
  },

  onAuthChange(callback: (user: any) => void) {
    return onAuthStateChangedListener(callback);
  },
};
