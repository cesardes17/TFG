// src/types/User.ts
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Roles disponibles en la aplicación
 */
export type Role =
  | 'espectador'
  | 'jugador'
  | 'capitan'
  | 'arbitro'
  | 'coorganizador'
  | 'organizador';

/**
 * Campos comunes a todos los usuarios en Firestore
 */
export interface UserBase {
  uid: string;
  correo: string;
  nombre: string;
  apellidos: string;
  role: Role;
  fechaCreacion: Date;
  ultimaVisitaTablon?: Date;
}

/**
 * Campos específicos para usuarios con rol Jugador o Capitán
 */
export interface PlayerProfile {
  altura: number;
  peso: number;
  dorsal: number;
  posicion: string;
  /** En este caso es obligatoria la foto de perfil */
  photoURL: string;
  equipo?: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  sancionado: boolean;
}

/**
 * Usuario con rol Jugador o Capitán
 */
export interface PlayerUser extends UserBase, PlayerProfile {
  role: 'jugador' | 'capitan';
}

/**
 * Usuario con cualquier otro rol distinto de Jugador o Capitán
 */
export interface OtherUser extends UserBase {
  role: Exclude<Role, 'jugador' | 'capitan'>;
}

/**
 * Tipo de usuario que consumirá la app
 */
export type User = PlayerUser | OtherUser;

/**
 * Campos necesarios para registrar un usuario (antes de tener uid y createdAt)
 */
export interface UserRegistrationBase {
  correo: string;
  nombre: string;
  apellidos: string;
  role: Role;
}

/**
 * Datos para registrar un Jugador o Capitán
 */
export type PlayerRegistration = UserRegistrationBase &
  PlayerProfile & {
    role: 'jugador' | 'capitan';
  };

/**
 * Datos para registrar cualquier otro tipo de usuario
 */
export type OtherRegistration = UserRegistrationBase & {
  role: Exclude<Role, 'jugador' | 'capitan'>;
  /** Foto opcional para otros roles */
  photoURL?: string;
};

/**
 * Tipo unificado para creación de usuarios
 */
export type UserRegistration = PlayerRegistration | OtherRegistration;

/**
 * Type guard para identificar un PlayerUser
 */
export function isPlayer(user: User): user is PlayerUser {
  return user.role === 'jugador' || user.role === 'capitan';
}
