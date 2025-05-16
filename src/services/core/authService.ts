import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthStateChangedListener,
  deleteCurrentUser, // 👈 importa la nueva función
  getCurrentUser as getCurrentUserFromFirebase, // ⬅ alias para evitar colisión
} from '../../api/authFirebase';
import type { ResultService } from '../../types/ResultService';
import { translateAuthError } from '../../utils/errorTranslator';

export const AuthService = {
  login: async (
    email: string,
    password: string
  ): Promise<ResultService<any>> => {
    try {
      const userCredential = await signInWithEmail(email, password);
      return { data: userCredential.user, success: true };
    } catch (error: any) {
      const code = error.code || '';
      const message = translateAuthError(code, 'No se pudo iniciar sesión.');
      return { success: false, errorMessage: message };
    }
  },

  register: async (
    email: string,
    password: string
  ): Promise<ResultService<any>> => {
    try {
      const userCredential = await signUpWithEmail(email, password);
      return { data: userCredential.user, success: true };
    } catch (error: any) {
      const code = error.code || '';
      const message = translateAuthError(
        code,
        'No se pudo registrar el usuario.'
      );
      return { success: false, errorMessage: message };
    }
  },

  logout: async (): Promise<ResultService<null>> => {
    try {
      await signOutUser();
      return { success: true };
    } catch (error: any) {
      return { success: false, errorMessage: 'No se pudo cerrar sesión.' };
    }
  },

  deleteUser: async (): Promise<ResultService<null>> => {
    try {
      await deleteCurrentUser();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error?.message ?? 'No se pudo eliminar el usuario actual.',
      };
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const user = await getCurrentUserFromFirebase();
      if (!user) throw new Error('No hay usuario autenticado');
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      return null;
    }
  },

  onAuthChange: (callback: (user: any) => void) =>
    onAuthStateChangedListener(callback),
};
