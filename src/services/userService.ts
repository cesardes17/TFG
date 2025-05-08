// src/services/userService.ts

import type { UserRegistration, User } from '../types/User';
import type { ResultService } from '../types/ResultService';
import { AuthService } from './core/authService';
import { FirestoreService } from './core/firestoreService';
import { Timestamp } from 'firebase/firestore';

/**
 * Servicio de usuario: registro y lectura de perfil
 */
export const UserService = {
  /**
   * Crea un nuevo usuario en Auth y en Firestore (colección 'users/{uid}')
   */
  createUser: async (
    uid: string,
    registrationData: UserRegistration
  ): Promise<ResultService<User>> => {
    // Armar payload sin contraseña
    const payload: Omit<User, 'password'> & { createdAt: any } = {
      uid,
      ...registrationData,
      createdAt: Timestamp.now(),
    };

    // Inserta en Firestore en 'users/{uid}'
    // Firma: setDocumentByPath(collection: string, docId: string, data: T)
    const res = await FirestoreService.setDocumentByPath<User>(
      'users',
      uid,
      payload as User
    );
    if (!res.success) {
      // Si falla Firestore, revierte la sesión en Auth
      await AuthService.logout();
      return { success: false, errorMessage: res.errorMessage };
    }

    // Devolver el usuario creado
    return { success: true, data: payload as User };
  },

  /**
   * Obtiene el perfil de usuario por UID desde 'users/{uid}'
   */
  getUserProfile: async (uid: string): Promise<ResultService<User>> => {
    try {
      // Firma: getDocumentByPath<T>(collection: string, docId: string)
      const res = await FirestoreService.getDocumentByPath<User>('users', uid);
      if (!res.success || !res.data) {
        return { success: false, errorMessage: 'Usuario no encontrado' };
      }
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al obtener perfil de usuario',
      };
    }
  },
};
