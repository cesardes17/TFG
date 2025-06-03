// src/utils/FormatearYGuardarPartido.ts
import { ToastType } from '../../components/common/Toast';
import { ligaService } from '../../services/competicionService/ligaService';
import { partidoService } from '../../services/partidoService';
import { jugadorEstadisticasService } from '../../services/jugadorEstadisticasService';
import { equipoService } from '../../services/equipoService';
import { Partido } from '../../types/Partido';

export async function FormatearYGuardarPartido(
  temporadaId: string,
  partido: Partido,
  setIsGuardando: (isGuardando: boolean) => void,
  setGuardandoTexto: (texto: string) => void
): Promise<{ message: string; type: ToastType }> {
  try {
    setIsGuardando(true);
    setGuardandoTexto('Guardando partido...');
    console.log(JSON.stringify(partido, null, 2));

    // Paso 1: Formatear el partido
    const partidoFinalizado: Partido = {
      ...partido,
      estado: 'finalizado',
      resultado: {
        puntosLocal: partido.estadisticasEquipos!.totales.local.puntos,
        puntosVisitante: partido.estadisticasEquipos!.totales.visitante.puntos,
      },
    };

    // Paso 2: Guardar el partido
    const res = await partidoService.finalizarPartido(
      temporadaId,
      partidoFinalizado.tipoCompeticion,
      partidoFinalizado
    );
    if (!res.success) {
      throw new Error('Error al guardar partido');
    }

    // Paso 3: Actualizar estadísticas de jugadores
    setGuardandoTexto('Actualizando estadísticas de jugadores...');
    const jugadoresLocales = Object.values(
      partido.estadisticasJugadores!.local
    );
    const jugadoresVisitantes = Object.values(
      partido.estadisticasJugadores!.visitante
    );

    const actualizarJugadorPromises = [
      ...jugadoresLocales
        .filter((jugador) => jugador.haJugado)
        .map((jugador) =>
          jugadorEstadisticasService.actualizarEstadisticasJugador(
            jugador.jugadorId,
            temporadaId,
            partidoFinalizado.tipoCompeticion,
            jugador
          )
        ),
      ...jugadoresVisitantes
        .filter((jugador) => jugador.haJugado)
        .map((jugador) =>
          jugadorEstadisticasService.actualizarEstadisticasJugador(
            jugador.jugadorId,
            temporadaId,
            partidoFinalizado.tipoCompeticion,
            jugador
          )
        ),
    ];
    await Promise.all(actualizarJugadorPromises);

    // Paso 4: Actualizar estadísticas de equipo
    setGuardandoTexto('Actualizando estadísticas de equipos...');
    await equipoService.actualizarEstadisticasEquipo(
      temporadaId,
      partidoFinalizado.equipoLocal.id,
      partidoFinalizado.tipoCompeticion,
      partido.estadisticasEquipos!.totales.local
    );
    await equipoService.actualizarEstadisticasEquipo(
      temporadaId,
      partidoFinalizado.equipoVisitante.id,
      partidoFinalizado.tipoCompeticion,
      partido.estadisticasEquipos!.totales.visitante
    );

    // Paso 5: Actualizar clasificación
    if (partidoFinalizado.tipoCompeticion === 'liga-regular') {
      setGuardandoTexto('Actualizando clasificación...');
      const resultado = await ligaService.onFinalizarPartido(
        temporadaId,
        partidoFinalizado
      );
      if (!resultado.success) {
        throw new Error('Error al actualizar clasificación');
      }
    }

    setIsGuardando(false);
    return { message: 'Partido guardado correctamente', type: 'success' };
  } catch (error) {
    setGuardandoTexto('');
    setIsGuardando(false);
    console.error(error);
    return {
      message: 'Error al guardar el partido',
      type: 'error',
    };
  }
}
