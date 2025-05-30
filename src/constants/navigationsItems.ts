// src/constants/navigationItems.ts

import { Rol } from '../types/User';

export type NavigationAllowedRole = '*' | 'auth' | Rol;

export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  path: string;
  allowedRoles: NavigationAllowedRole[];
  showBadge?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'solicitudes',
    title: 'Solicitudes',
    description: 'Gestiona y consulta tus solicitudes.',
    path: '/solicitudesMobile',
    allowedRoles: ['jugador', 'capitan', 'organizador', 'coorganizador'], // solo jugadores y capitanes
    showBadge: true, // ← puede mostrar un badge o no,
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
    path: '/bolsaJugadoresMobile',
    allowedRoles: ['organizador', 'coorganizador', 'capitan'], // solo organizadores y coorganizadores
  },
  {
    id: 'tablonAnuncios',
    title: 'Tablon de Anuncios',
    description: 'Consulta los anuncios de la Liga.',
    path: '/tablonAnunciosMobile',
    allowedRoles: ['*'], // cualquier usuario, incluso invitado
    showBadge: true, // ← puede mostrar un badge o no,
  },
  {
    id: 'ajustes',
    title: 'Ajustes',
    description: 'Configura tu experiencia en la aplicación.',
    path: '/ajustesMobile',
    allowedRoles: ['*'], // cualquier usuario, incluso invitado
  },
  {
    id: 'administrarUsuarios',
    title: 'Administrar Usuarios',
    description: 'Administra usuarios de la aplicación.',
    path: '/administrarUsuariosMobile',
    allowedRoles: ['organizador', 'coorganizador'], // cualquier usuario, incluso invitado
  },
];
