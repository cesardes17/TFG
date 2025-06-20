import { TipoCompeticion } from './Competicion';
import { EstadisticasEquiposPartido } from './estadisticas/equipo';
import { EstadisticasJugadores } from './estadisticas/jugador';

export type EstadoPartido = 'pendiente' | 'en-juego' | 'finalizado';

export interface ArbitroAsignado {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
}

export type Partido = {
  jornadaId: string;
  serieId?: string;
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

  siguientePartidoId?: string; // id del partido al que avanza el ganador solo en partidos copa

  arbitro1?: ArbitroAsignado | null;
  arbitro2?: ArbitroAsignado | null;
  arbitro3?: ArbitroAsignado | null;
};

export type PartidoRT = Partido & {
  cuartoActual: string;
  minutoActual: number;
};
