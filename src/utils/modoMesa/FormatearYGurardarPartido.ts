// src / utils / FormatearYGuardarPartido.ts;
import { ToastType } from '../../components/common/Toast';
import { ligaService } from '../../services/competicionService/ligaService';
import { partidoService } from '../../services/partidoService';
import { jugadorEstadisticasService } from '../../services/jugadorEstadisticasService';
import { equipoService } from '../../services/equipoService';
import { Partido } from '../../types/Partido';
import { jornadaService } from '../../services/jornadaService';
import { copaService } from '../../services/competicionService/copaService';
import { competitionBaseService } from '../../services/competicionService/baseService';
import { playoffService } from '../../services/competicionService/playoffService';

export async function FormatearYGuardarPartido(
  temporadaId: string,
  partido: Partido,
  setIsGuardando: (isGuardando: boolean) => void,
  setGuardandoTexto: (texto: string) => void
): Promise<{ message: string; type: ToastType }> {
  try {
    setIsGuardando(true);
    setGuardandoTexto('Guardando partido...');

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

    // Paso 5: Actualizar clasificación o cuadro
    if (partidoFinalizado.tipoCompeticion === 'liga-regular') {
      setGuardandoTexto('Actualizando clasificación...');
      const resultado = await ligaService.onFinalizarPartido(
        temporadaId,
        partidoFinalizado
      );
      if (!resultado.success) {
        throw new Error('Error al actualizar clasificación');
      }
    } else if (partidoFinalizado.tipoCompeticion === 'copa') {
      setGuardandoTexto('Actualizando cuadro de Copa...');
      const resultado = await copaService.onFinalizarPartido(
        temporadaId,
        partidoFinalizado
      );
      if (!resultado.success) {
        throw new Error('Error al actualizar cuadro de Copa');
      }
    } else if (partidoFinalizado.tipoCompeticion === 'playoffs') {
      setGuardandoTexto('Actualizando Serie...');
      const resultado = await playoffService.onPartidoFinalizado(
        temporadaId,
        partidoFinalizado
      );
      if (!resultado.success) {
        throw new Error('Error al actualizar Serie');
      }
    }

    // Paso 6: Eliminar partido de RT
    setGuardandoTexto('Actualizando estado partido...');
    const resDeleteRT = await partidoService.deleteRealtime(
      partidoFinalizado.id
    );

    if (!resDeleteRT.success) {
      throw new Error('Error al eliminar partido de RT');
    }
    setGuardandoTexto('');

    // Paso 7: Comprobar si se debe finalizar la jornada
    setGuardandoTexto('Verificando estado de la jornada...');
    const resCJ = await jornadaService.finalizarJornadaSiEsNecesario(
      temporadaId,
      partidoFinalizado.tipoCompeticion,
      partidoFinalizado.jornadaId!
    );

    if (!resCJ.success) {
      throw new Error('Error al verificar estado de la jornada');
    }

    // Paso 8: Comprobar si se debe finalizar la competición
    setGuardandoTexto('Verificando estado de la competición...');
    const resCC =
      await competitionBaseService.finalizarCompeticionSiEsNecesario(
        temporadaId,
        partidoFinalizado.tipoCompeticion
      );

    if (!resCC.success) {
      throw new Error('Error al verificar estado de la competición');
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
