// src/constants/navigationItems.ts

import { Role } from '../types/User';

export type NavigationAllowedRole = '*' | 'auth' | Role;

export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  path: string;
  allowedRoles: NavigationAllowedRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'ajustes',
    title: 'Ajustes',
    description: 'Configura tu experiencia en la aplicación.',
    path: '/ajustesMobile',
    allowedRoles: ['*'], // cualquier usuario, incluso invitado
  },
  {
    id: 'solicitudes',
    title: 'Solicitudes',
    description: 'Gestiona tus solicitudes de unión a equipos.',
    path: '/solicitudesMobile',
    allowedRoles: ['jugador', 'capitan', 'organizador', 'coorganizador'], // solo jugadores y capitanes
  },
  {
    id: 'panelControl',
    title: 'Panel de Control',
    description: 'Gestiona la Liga Municipal de Baloncesto.',
    path: '/panelControlMobile',
    allowedRoles: ['organizador', 'coorganizador'], // solo organizadores y coorganizadores
  },
  {
    id: 'bolsaJugadores',
    title: 'Bolsa de Jugadores',
    description: 'Ficha a jugadores que están listos para jugar.',
    path: '/bolsaJugadores',
    allowedRoles: ['organizador', 'coorganizador', 'capitan'], // solo organizadores y coorganizadores
  },
];
