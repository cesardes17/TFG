// src/utils/equipos/disolverEquipo.ts
import { FirestoreService } from '../../services/core/firestoreService';
import { equipoService } from '../../services/equipoService';
import { inscripcionesService } from '../../services/inscripcionesService';
import { UserService } from '../../services/userService';

export async function disolverEquipo(
  temporadaId: string,
  equipoId: string,
  onProgress?: (text: string) => void
): Promise<void> {
  onProgress?.('Obteniendo inscripciones del equipo...');
  const res = await inscripcionesService.getInscripcionesByTeam(
    temporadaId,
    equipoId
  );

  if (!res.success || !res.data || res.data.length === 0) {
    throw new Error(res.errorMessage || 'No se encontraron inscripciones');
  }

  const inscripciones = res.data;

  onProgress?.('Eliminando inscripciones...');
  for (const inscripcion of inscripciones) {
    await inscripcionesService.deleteInscripcionById(
      temporadaId,
      inscripcion.id
    );

    await UserService.UpdatePlayerProfile(inscripcion.jugador.id, {
      equipo: FirestoreService.getDeleteField(),
      rol: 'jugador', // Siempre forzamos aquí
    });
  }

  onProgress?.('Eliminando equipo...');
  const deleteRes = await equipoService.deleteEquipo(temporadaId, equipoId);
  if (!deleteRes.success) {
    throw new Error(deleteRes.errorMessage || 'Error al eliminar equipo');
  }
}
