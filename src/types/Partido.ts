import { TipoCompeticion } from './Competicion';
import { EstadisticasEquiposPartido } from './estadisticas/equipo';
import { EstadisticasJugadores } from './estadisticas/jugador';

export type EstadoPartido = 'pendiente' | 'en-juego' | 'finalizado';

export type Partido = {
  jornadaId: string;
  id: string;
  tipoCompeticion: TipoCompeticion;
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

  estadisticasJugadores?: EstadisticasJugadores | null;

  estadisticasEquipos?: EstadisticasEquiposPartido | null;
};

export type PartidoRT = Partido & {
  cuartoActual: string;
  minutoActual: number;
};
