// src/types/Partido.ts:
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
};
