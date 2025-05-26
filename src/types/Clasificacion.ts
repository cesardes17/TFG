// src/types/Clasificacion.ts:
export type Clasificacion = {
  id: string;
  equipo: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  puntos: number;
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  puntosFavor: number;
  puntosContra: number;
  diferencia: number;
};
