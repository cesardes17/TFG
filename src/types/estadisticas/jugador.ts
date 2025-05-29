import { EstadisticasTiro } from './tiro';

export type EstadisticasJugador = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
  nombre: string;
  apellidos: string;
  fotoUrl: string;
};

export type EstadisticasJugadores = {
  local: Record<string, EstadisticasJugador>;
  visitante: Record<string, EstadisticasJugador>;
};
