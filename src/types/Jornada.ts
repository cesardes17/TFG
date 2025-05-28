// src/types/Jornada.ts:
export type EstadoJornada = 'pendiente' | 'en-curso' | 'finalizada';

export type Jornada = {
  id: string;
  nombre: string; // Ej: "Jornada 1"
  numero: number;
  estado: EstadoJornada;
};
