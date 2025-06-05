// src/services/userService.ts

import type {
  UserRegistration,
  User,
  PlayerUser,
  OtherUser,
  Rol,
} from '../types/User';
import type { ResultService } from '../types/ResultService';
import { AuthService } from './core/authService';
import { FirestoreService } from './core/firestoreService';
import { Timestamp } from '@react-native-firebase/firestore';
import { RealtimeService } from './core/realtimeService';

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
  ): Promise<ResultService<string>> => {
    try {
      // Armar payload sin contraseña
      const payload = {
        uid,
        ...registrationData,
        fechaCreacion: new Date(),
      };

      // Inserta en Firestore en 'users/{uid}'
      const res = await FirestoreService.setDocumentByPath<User>(
        'users',
        uid,
        payload
      );
      if (!res.success) {
        await AuthService.logout();
        throw new Error(res.errorMessage || 'Error al crear usuario ');
      }

      // Ensure we return the correct type
      if (!res.data) {
        return { success: false, errorMessage: 'Failed to create user data' };
      }

      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Error al crear usuario',
      };
    }
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

  /**
   * Actualiza el perfil de usuario por UID en 'users/{uid}'
   */
  UpdatePlayerProfile: async (
    uid: string,
    updatedData: Partial<PlayerUser>
  ): Promise<ResultService<User>> => {
    try {
      // Comprobación del usuario actual
      const res = await UserService.getUserProfile(uid);
      if (!res.success || !res.data) {
        return { success: false, errorMessage: 'Usuario no encontrado' };
      }
      if (res.data.rol !== 'jugador' && res.data.rol !== 'capitan') {
        return { success: false, errorMessage: 'El usuario no es un jugador' };
      }

      console.log('userService updatedData - ', updatedData);
      // Actualización parcial del documento
      const resUpdate = await FirestoreService.updateDocumentByPath(
        ['users', uid],
        updatedData
      );

      if (!resUpdate.success) {
        return { success: false, errorMessage: resUpdate.errorMessage };
      }
      console.log('userService resUpdate - ', resUpdate.data);
      // Devolver el nuevo perfil fusionado (a nivel local)
      const nuevoPerfil = {
        ...res.data,
        ...updatedData,
      } as PlayerUser;

      return { success: true, data: nuevoPerfil };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar perfil de usuario',
      };
    }
  },

  updateUserProfile: async (
    uid: string,
    updatedData: Partial<User>
  ): Promise<ResultService<null>> => {
    try {
      const path = ['users', uid];
      const resUpdate = await FirestoreService.updateDocumentByPath(
        path,
        updatedData
      );

      if (!resUpdate.success) {
        throw new Error(
          resUpdate.errorMessage || 'Error al actualizar usuario'
        );
      }

      return { success: true, data: resUpdate.data };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar perfil de usuario',
      };
    }
  },

  marcarVisitaTablon: async (uid: string): Promise<ResultService<null>> => {
    try {
      // usamos Timestamp de Firestore
      const ahora = new Date();
      const res = await FirestoreService.updateDocumentByPath(['users', uid], {
        ultimaVisitaTablon: ahora,
      });
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: null };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  /**
   * Recupera la fecha de ultimaVisitaTablon o null
   */
  obtenerVisitaTablon: async (
    uid: string
  ): Promise<ResultService<Date | null>> => {
    try {
      const res = await FirestoreService.getDocumentByPath<User>('users', uid);
      if (!res.success) throw new Error(res.errorMessage);
      const ts = res.data?.ultimaVisitaTablon ?? null;
      return { success: true, data: ts };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  // Obtiene la lista de usuarios
  getUsers: async (): Promise<ResultService<User[]>> => {
    try {
      const path = ['users'];
      const res = await FirestoreService.getCollectionByPath<User>(path);
      if (!res.success) throw new Error(res.errorMessage);
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  },

  updateUserRol: async (
    uid: string,
    rolNuevo: Rol,
    rolAntiguo: Rol
  ): Promise<ResultService<null>> => {
    try {
      const path = ['users', uid];
      const resUpdate = await FirestoreService.updateDocumentByPath(path, {
        rol: rolNuevo,
      });

      if (!resUpdate.success) {
        throw new Error(
          resUpdate.errorMessage || 'Error al actualizar usuario'
        );
      }

      if (rolAntiguo === 'arbitro' || rolAntiguo === 'coorganizador') {
        const path = ['usuarios', uid];
        const resRT = await RealtimeService.removeValue(path);
        if (!resRT.success) {
          throw new Error(resRT.errorMessage || 'Error al actualizar usuario');
        }
      }

      if (rolNuevo === 'arbitro' || rolNuevo === 'coorganizador') {
        const path = ['usuarios', uid];
        const resRT = await RealtimeService.setValue(path, { rol: rolNuevo });
        if (!resRT.success) {
          throw new Error(resRT.errorMessage || 'Error al actualizar usuario');
        }
      }

      return { success: true, data: resUpdate.data };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al actualizar perfil de usuario',
      };
    }
  },
};
