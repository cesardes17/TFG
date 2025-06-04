import { ActualizarEstadisticaJugadorParams } from './estadisticas/jugador';

//Acciones Historial Partido en Vivo
export type HistorialAccion = ActualizarEstadisticaJugadorParams & {
  nombre: string;
  apellidos: string;
  dorsal: number;
  id: string;
};
