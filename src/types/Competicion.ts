// src/types/Competicion.ts:
export type TipoCompeticion = 'liga-regular' | 'copa' | 'playoffs';
export type EstadoCompeticion = 'pendiente' | 'en-curso' | 'finalizada';

export type Competicion = {
  id: string;
  tipo: TipoCompeticion;
  nombre: string;
  estado: EstadoCompeticion;
  fechaInicio: Date;
  fechaFin?: Date | null;
};
