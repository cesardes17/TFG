import { EstadisticasTiro } from './tiro';

export type EstadisticasEquipo = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
  tiemposMuertos: number;
};

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
