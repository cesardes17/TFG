// src/types/Jornada.ts:
type EstadoJornada = 'pendiente' | 'en-curso' | 'finalizada';

type Jornada = {
  id: string;
  nombre: string; // Ej: "Jornada 1"
  numero: number;
  estado: EstadoJornada;
  fechaInicio: Date;
  fechaFin?: Date;
};
