import { TipoCompeticion } from '../../types/Competicion';
import { Partido } from '../../types/Partido';
import { ResultService } from '../../types/ResultService';
import { generarCuadroCopa } from '../../utils/competiciones/generarCuadroCopa';
import { clasificacionService } from '../clasificacionService';
import { FirestoreService } from '../core/firestoreService';
import { jornadaService } from '../jornadaService';
import { partidoService } from '../partidoService';
import { competitionBaseService } from './baseService';

const competicion: TipoCompeticion = 'copa';

export const copaService = {
  crear: async (
    temporadaId: string,
    onProgress?: (text: string) => void
  ): Promise<ResultService<null>> => {
    try {
      if (onProgress) onProgress('Obteniendo Top 8 Equipos...');

      // 1. Obtener clasificación actual de la liga regular
      const resClasificacion = await clasificacionService.get(
        temporadaId,
        'liga-regular'
      );
      if (!resClasificacion.success || !resClasificacion.data)
        throw new Error(resClasificacion.errorMessage);

      const topClasificados = resClasificacion.data.slice(0, 8);
      const topEquipos = topClasificados.map((c) => c.equipo);

      if (onProgress) onProgress('Generando Cuadro de Copa...');

      // 2. Crear documento de competición 'Copa'
      const competicion = 'copa';
      const copa = {
        id: competicion,
        nombre: 'Copa',
        tipo: competicion,
        estado: 'en-curso',
        fechaInicio: new Date(),
      };

      const res = await FirestoreService.setDocumentByPath(
        'temporadas',
        temporadaId,
        'competiciones',
        copa.id,
        copa
      );
      if (!res.success) {
        return { success: false, errorMessage: res.errorMessage };
      }

      // 3. Generar rondas y partidos (sin persistencia)
      const { rondas, partidosPorRonda } = generarCuadroCopa(topEquipos);

      if (onProgress) onProgress('Guardando rondas y partidos en Firestore...');

      // 4. Guardar rondas
      for (const ronda of rondas) {
        await jornadaService.crear(temporadaId, copa.id, ronda);
      }

      // 5. Guardar partidos
      for (const [rondaId, partidos] of Object.entries(partidosPorRonda)) {
        for (const partido of partidos) {
          await partidoService.crear(temporadaId, copa.id, partido);
        }
      }

      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },

  onFinalizarPartido: async (
    temporadaId: string,
    partidoFinalizado: Partido
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    try {
      // 1️⃣ Determinar el equipo ganador
      const ganador =
        partidoFinalizado.resultado!.puntosLocal >=
        partidoFinalizado.resultado!.puntosVisitante
          ? partidoFinalizado.equipoLocal
          : partidoFinalizado.equipoVisitante;

      // 2️⃣ Obtener el partido siguiente
      const siguientePartidoId = partidoFinalizado.siguientePartidoId;
      if (!siguientePartidoId) {
        console.log('El partido no tiene siguientePartidoId; fin del cuadro.');
        return { success: true };
      }

      // 3️⃣ Obtener el partido siguiente
      const resPartidoSiguiente = await partidoService.getPartido(
        temporadaId,
        'copa',
        siguientePartidoId
      );
      if (!resPartidoSiguiente.success || !resPartidoSiguiente.data) {
        return {
          success: false,
          errorMessage: 'No se encontró el partido siguiente',
        };
      }

      const partidoSiguiente = resPartidoSiguiente.data;

      // 4️⃣ Asignar ganador como local o visitante
      if (partidoSiguiente.equipoLocal.id === 'por-definir') {
        partidoSiguiente.equipoLocal = ganador;
      } else if (partidoSiguiente.equipoVisitante.id === 'por-definir') {
        partidoSiguiente.equipoVisitante = ganador;
      } else {
        console.warn('El partido siguiente ya tiene ambos equipos definidos');
      }

      // 5️⃣ Guardar el partido siguiente actualizado
      const resUpdate = await partidoService.actualizarPartido(
        temporadaId,
        'copa',
        partidoSiguiente.id,
        partidoSiguiente
      );
      if (!resUpdate.success) {
        return {
          success: false,
          errorMessage: 'Error al actualizar el siguiente partido',
        };
      }

      // 6️⃣ Borrar el partido de RT
      const resDelete = await partidoService.deleteRealtime(
        partidoFinalizado.id
      );

      if (!resDelete.success) {
        return {
          success: false,
          errorMessage: 'Error al eliminar el partido de RT',
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error(error);
      return { success: false, errorMessage: error.message };
    }
  },
  pausar: async (temporadaId: string): Promise<ResultService<boolean>> => {
    return competitionBaseService.pausarCompetcion(temporadaId, competicion);
  },

  reanudar: async (temporadaId: string): Promise<ResultService<boolean>> => {
    return competitionBaseService.reanudarCompeticion(temporadaId, competicion);
  },
};
