// src/services/userService.ts
import type { UserRegistration, User } from '../types/User';
import type { ResultService } from '../types/ResultService';
import { AuthService } from './authService';
import { FirestoreService } from './firestoreService';
import { Timestamp } from 'firebase/firestore';

/**
 * Servicio de usuario: registro y lectura de perfil
 */
export const UserService = {
  /**
   * Registra un nuevo usuario:
   *  1) AuthService.register(email, pass)
   *  2) FirestoreService.setDocument('users', {...userData, uid, createdAt})
   *  3) En caso de fallo en Firestore, revierte el registro de Auth (AuthService.logout o .deleteUser)
   */
  createUser: async (
    uid: string,
    registrationData: UserRegistration
  ): Promise<ResultService<User>> => {
    // 2) arma el payload Firestore (sin password, con createdAt)

    const firestorePayload = {
      uid,
      ...registrationData,
      createdAt: Timestamp.now(), // Changed from Date to Timestamp
    };

    // 3) escribe en Firestore
    const fsRes = await FirestoreService.setDocument<User>(
      'users',
      firestorePayload,
      uid
    );
    if (!fsRes.success) {
      // 4) si falla Firestore, revierte el registro Auth
      await AuthService.logout();
      return { success: false, errorMessage: fsRes.errorMessage };
    }

    // 5) todo OK: devuelve el usuario recién creado
    return {
      success: true,
      data: {
        ...(firestorePayload as User),
        uid,
        createdAt: firestorePayload.createdAt,
      },
    };
  },

  /**
   * Obtiene el perfil de usuario por UID
   */
  getUserProfile: async (uid: string): Promise<ResultService<User>> => {
    try {
      const result = await FirestoreService.getDocument<User>('users', uid);

      if (!result.success || !result.data) {
        throw new Error(
          result.errorMessage || 'No se encontró el perfil de usuario'
        );
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'No se pudo obtener el perfil de usuario',
      };
    }
  },
};
