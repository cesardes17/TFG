import { Partido, PartidoRT } from '../../types/Partido';
import { Inscripcion } from '../../types/Inscripcion';
import { EstadisticasJugador } from '../../types/estadisticas/jugador';
import { inicializarCuarto } from './inicializarCuarto';

/**
 * Inicializa las estadísticas de jugadores para un partido.
 * @param partido El partido actual (debe existir)
 * @param inscripcionesLocal Array de inscripciones del equipo local
 * @param inscripcionesVisitante Array de inscripciones del equipo visitante
 * @returns El partido actualizado con estadísticas inicializadas
 */
export function inicializarPartido(
  partido: Omit<PartidoRT, 'cuartoActual' | 'minutoActual'>,
  inscripcionesLocal: Inscripcion[],
  inscripcionesVisitante: Inscripcion[]
): PartidoRT {
  // Mapea inscripciones a estadísticas iniciales
  const crearEstadisticasJugadores = (
    inscripciones: Inscripcion[]
  ): Record<string, EstadisticasJugador> => {
    const jugadoresStats: Record<string, EstadisticasJugador> = {};

    inscripciones.forEach((inscripcion) => {
      const { id, nombre, apellidos, fotoUrl, dorsal } = inscripcion.jugador;

      jugadoresStats[id] = {
        puntos: 0,
        tirosLibres: { anotados: 0, fallados: 0 },
        tirosDos: { anotados: 0, fallados: 0 },
        tirosTres: { anotados: 0, fallados: 0 },
        asistencias: 0,
        rebotes: 0,
        faltasCometidas: 0,
        nombre,
        apellidos,
        fotoUrl,
        haJugado: false,
        dorsal,
        jugadorId: id,
        partidosJugados: 0,
      };
    });

    return jugadoresStats;
  };

  // Creamos las estadísticas iniciales para local y visitante
  const estadisticasJugadores = {
    local: crearEstadisticasJugadores(inscripcionesLocal),
    visitante: crearEstadisticasJugadores(inscripcionesVisitante),
  };

  const partidoInicializado = inicializarCuarto(
    { ...partido, estadisticasJugadores },
    'C1'
  );

  return partidoInicializado;
}
