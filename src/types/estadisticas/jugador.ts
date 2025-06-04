import { EstadisticasTiro, TipoTiro } from './tiro';

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

export type ActualizarEstadisticaJugadorParams = {
  jugadorId: string;
  equipo: 'local' | 'visitante';
  accion:
    | 'puntos'
    | 'asistencias'
    | 'rebotes'
    | 'faltasCometidas'
    | 'tirosLibres'
    | 'tirosDos'
    | 'tirosTres';
  valor: number; // Ejemplo: +1 o -1
  tipoTiro?: TipoTiro; // solo para tiros
};
