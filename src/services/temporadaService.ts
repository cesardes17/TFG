import { ResultService } from '../types/ResultService';
import { Temporada } from '../types/Temporada';
import { FirestoreService } from './core/firestoreService';

export const temporadaService = {
  getTemporadaActual: async (): Promise<ResultService<Temporada>> => {
    try {
      const snapshot = await FirestoreService.getDocumentsWithFilter(
        'temporadas',
        [['activa', '==', true]]
      );

      if (!snapshot.success || !snapshot.data || snapshot.data.length === 0) {
        return {
          success: false,
          errorMessage: 'No se encontró una temporada activa',
        };
      }

      const doc = snapshot.data[0] as { id: string; data: Temporada };

      return {
        success: true,
        data: doc.data,
      };
    } catch (error) {
      console.error('Error al obtener temporada activa:', error);
      return {
        success: false,
        errorMessage: 'ERROR_GET_TEMPORADA_ACTUAL',
      };
    }
  },

  createTemporada: async (): Promise<ResultService<Temporada>> => {
    try {
      const temporadaID = getNombreTemporadaActual();
      // TODO: Crear temporada en Firestore

      const temporadaData: Temporada = {
        id: temporadaID,
        nombre: temporadaID,
        fechaInicio: new Date().toISOString(),
        fechaFin: null,
        activa: true,
      };

      const { success, data, errorMessage } =
        await FirestoreService.setDocument('temporadas', temporadaData);

      if (!success || !data) {
        throw new Error(errorMessage || 'Error al crear la temporada');
      }

      return {
        success: true,
        data: temporadaData,
      };
    } catch (error) {
      console.error('Error al crear la temporada:', error);
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Error al crear la temporada',
      };
    }
  },
};
const getNombreTemporadaActual = (): string => {
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  const añoInicio = añoActual.toString().slice(-2);
  const añoFin = (añoActual + 1).toString().slice(-2);
  return `Temporada ${añoInicio}/${añoFin}`;
};
