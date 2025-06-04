// utils/modoMesa/inicializarCuarto.ts
import { Partido, PartidoRT } from '../../types/Partido';

export function inicializarCuarto(
  partido: Omit<PartidoRT, 'minutoActual' | 'cuartoActual'>,
  cuartoActual: string
): PartidoRT {
  // si el cuarto actual es Descanso no incializamos estadisticas
  if (cuartoActual === 'DESCANSO') {
    return { ...partido, minutoActual: 0, cuartoActual: cuartoActual };
  }
  // Clonamos todo el objeto partido
  const partidoInicializado: PartidoRT = {
    ...partido,
    minutoActual: 12,
    cuartoActual: cuartoActual,
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
