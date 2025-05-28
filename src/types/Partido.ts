import {
  EstadisticasEquipo,
  EstadisticasEquiposPartido,
} from './estadisticas/equipo';
import { EstadisticasJugador } from './estadisticas/jugador';

type EstadoPartido = 'pendiente' | 'en-juego' | 'finalizado';

export type Partido = {
  jornadaId: string;
  id: string;
  equipoLocal: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  equipoVisitante: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  resultado?: {
    puntosLocal: number;
    puntosVisitante: number;
  } | null;
  estado: EstadoPartido;
  fecha?: Date;
  cancha?: string;
  idEliminatoria?: string;

  estadisticasJugadores?: {
    local: Record<string, EstadisticasJugador>;
    visitante: Record<string, EstadisticasJugador>;
  } | null;

  estadisticasEquipos?: EstadisticasEquiposPartido | null;

  jugadoresPresentes?: {
    local: Record<
      string,
      {
        nombre: string;
        apellidos: string;
        photoURL?: string;
      }
    >;
    visitante: Record<
      string,
      {
        nombre: string;
        apellidos: string;
        photoURL?: string;
      }
    >;
  } | null;
};
