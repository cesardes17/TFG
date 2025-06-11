//src/types/Serie.ts
export type Serie = {
  id: string; // ID autogenerado o por ti
  jornadaId: string; // ID de la jornada/ronda a la que pertenece
  temporadaId: string; // Temporada (para consistencia y queries globales)
  tipoCompeticion: 'playoffs'; // Tipo de competición, por si quieres reutilizarlo en el futuro
  local: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  visitante: {
    id: string;
    nombre: string;
    escudoUrl: string;
  };
  partidosGanadosLocal: number;
  partidosGanadosVisitante: number;
  partidosJugados: number; // Por control
  maxPartidos: number; // Normalmente 3
  estado: 'pendiente' | 'en_curso' | 'finalizada'; // Estado global
  ganadorId?: string; // ID del equipo ganador, si ya terminó
  nextSerieId?: string; // ID de la siguiente serie (opcional, solo si quieres mostrar cuadro)
  createdAt: Date;
};
