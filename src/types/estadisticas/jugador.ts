import { EstadisticasTiro } from './tiro';

export type EstadisticasSimpleJugador = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
  partidosJugados: number;
};
export type EstadisticasJugador = EstadisticasSimpleJugador & {
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

export type DocumentoEstadisticasJugador = {
  estadisticasLiga: EstadisticasSimpleJugador;
  estadisticasCopa: EstadisticasSimpleJugador;
  estadisticasPlayoff: EstadisticasSimpleJugador;
};
