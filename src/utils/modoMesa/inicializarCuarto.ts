// utils/modoMesa/inicializarCuarto.ts
import { Partido } from '../../types/Partido';

export function inicializarCuarto(
  partido: Partido,
  cuartoActual: string
): Partido {
  // Clonamos el partido para no mutar el original
  const partidoInicializado: Partido = {
    ...partido,
    estadisticasEquipos: {
      porCuarto: {
        ...partido.estadisticasEquipos?.porCuarto,
        [cuartoActual]: {
          local: {
            puntos: 0,
            tirosLibres: { anotados: 0, fallados: 0 },
            tirosDos: { anotados: 0, fallados: 0 },
            tirosTres: { anotados: 0, fallados: 0 },
            asistencias: 0,
            rebotes: 0,
            faltasCometidas: 0,
            tiemposMuertos: 0,
          },
          visitante: {
            puntos: 0,
            tirosLibres: { anotados: 0, fallados: 0 },
            tirosDos: { anotados: 0, fallados: 0 },
            tirosTres: { anotados: 0, fallados: 0 },
            asistencias: 0,
            rebotes: 0,
            faltasCometidas: 0,
            tiemposMuertos: 0,
          },
        },
      },
      totales: partido.estadisticasEquipos?.totales ?? {
        local: {
          puntos: 0,
          tirosLibres: { anotados: 0, fallados: 0 },
          tirosDos: { anotados: 0, fallados: 0 },
          tirosTres: { anotados: 0, fallados: 0 },
          asistencias: 0,
          rebotes: 0,
          faltasCometidas: 0,
          tiemposMuertos: 0,
        },
        visitante: {
          puntos: 0,
          tirosLibres: { anotados: 0, fallados: 0 },
          tirosDos: { anotados: 0, fallados: 0 },
          tirosTres: { anotados: 0, fallados: 0 },
          asistencias: 0,
          rebotes: 0,
          faltasCometidas: 0,
          tiemposMuertos: 0,
        },
      },
    },
  };

  return partidoInicializado;
}
