// utils/modoMesa/inicializarCuarto.ts
import { Partido } from '../../types/Partido';

export function inicializarCuarto(
  partido: Partido,
  cuartoActual: string
): Partido {
  // Clonamos todo el objeto partido
  const partidoInicializado: Partido = {
    ...partido,
    estadisticasEquipos: {
      ...partido.estadisticasEquipos, // Clona todo lo que ya había
      porCuarto: {
        ...(partido.estadisticasEquipos?.porCuarto ?? {}),
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
      totales:
        partido.estadisticasEquipos && partido.estadisticasEquipos.totales
          ? partido.estadisticasEquipos.totales
          : {
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
