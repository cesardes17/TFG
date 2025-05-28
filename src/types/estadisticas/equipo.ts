import { EstadisticasTiro } from './tiro';

export type EstadisticasEquipo = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
};

// Un periodo puede ser "Q1", "Q2", ..., "T1", "T2", etc.
export type EstadisticasEquiposPorPeriodo = {
  [periodo: string]: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
};

export type EstadisticasEquiposPartido = {
  porCuarto: EstadisticasEquiposPorPeriodo;
  totales: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
};
