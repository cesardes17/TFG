import { TipoCompeticion } from '../../types/Competicion';
import { ResultService } from '../../types/ResultService';
import { generarCuadroCopa } from '../../utils/competiciones/generarCuadroCopa';
import { clasificacionService } from '../clasificacionService';
import { FirestoreService } from '../core/firestoreService';

const competicion: TipoCompeticion = 'copa';

export const copaService = {
  crear: async (
    temporadaId: string,
    onProgress?: (text: string) => void
  ): Promise<ResultService<null>> => {
    try {
      if (onProgress) onProgress('Obteniendo Top 8 Equipos...');
      // 1. Obtener clasificación actual de la liga regular (podrías tener un servicio o usar Firestore directamente)
      const resClasificacion = await clasificacionService.get(
        temporadaId,
        competicion
      );
      if (!resClasificacion.success || !resClasificacion.data)
        throw new Error(resClasificacion.errorMessage);
      // 2. Ordenar por puntos
      const topClasificados = resClasificacion.data.slice(0, 8);

      // 2.1. Extraer solo la info del equipo
      const topEquipos = topClasificados.map((c) => c.equipo);

      if (onProgress) onProgress('Generando Cuadro de Copa...');
      // 3. Crear estructura de la Copa (cuadro, rondas, etc.)
      const copa = {
        id: competicion,
        nombre: 'Copa',
        tipo: competicion,
        estado: 'en-curso',
        fechaInicio: new Date(),
      };

      // 4. Guardar la competición Copa en Firestore
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

      // 5. Crear las rondas y partidos (lógica de cuadro de copa)
      await generarCuadroCopa(temporadaId, competicion, topEquipos);

      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, errorMessage: error.message };
    }
  },
};
