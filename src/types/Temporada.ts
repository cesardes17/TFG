// src/types/Temporada.ts
export type Temporada = {
  id: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date | null;
  activa: boolean;
};
