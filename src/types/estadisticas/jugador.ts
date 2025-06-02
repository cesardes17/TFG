import { EstadisticasTiro } from './tiro';

export type EstadisticasJugador = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
  jugadorId: string;
  nombre: string;
  apellidos: string;
  fotoUrl: string;
  dorsal: number;
  haJugado: boolean;
};

export type EstadisticasJugadores = {
  local: Record<string, EstadisticasJugador>;
  visitante: Record<string, EstadisticasJugador>;
};
