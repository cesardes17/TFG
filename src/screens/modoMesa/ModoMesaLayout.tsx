// MesaLayout.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { TipoCompeticion } from '../../types/Competicion';
import usePartido from '../../hooks/usePartido';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import StyledAlert from '../../components/common/StyledAlert';
import { useTheme } from '../../contexts/ThemeContext';
import MesaSuperior from '../../components/modoMesa/superior/MesaSuperior';
import { inicializarCuarto } from '../../utils/modoMesa/inicializarCuarto';
import MesaInferior from '../../components/modoMesa/inferior/MesaInferior';

import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useInscripcionesPartido } from '../../hooks/useInscripcionesPartido';
import { inicializarPartido } from '../../utils/modoMesa/inicializarPartido';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import { getRandomUID } from '../../utils/getRandomUID';
import { FormatearYGuardarPartido } from '../../utils/modoMesa/FormatearYGurardarPartido';
import { useToast } from '../../contexts/ToastContext';
import { router } from 'expo-router';

interface Props {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}
export type ActualizarEstadisticaJugadorParams = {
  jugadorId: string;
  equipo: 'local' | 'visitante';
  accion:
    | 'puntos'
    | 'asistencias'
    | 'rebotes'
    | 'faltasCometidas'
    | 'tirosLibres'
    | 'tirosDos'
    | 'tirosTres';
  valor: number; // Ejemplo: +1 o -1
  tipoTiro?: TipoTiro; // solo para tiros
};

export type HistorialAccion = ActualizarEstadisticaJugadorParams & {
  nombre: string;
  apellidos: string;
  dorsal: number;
  id: string;
};

export type TipoTiro = 'anotados' | 'fallados';

export default function MesaLayout({ idPartido, tipoCompeticion }: Props) {
  const { theme, mode } = useTheme();
  const { temporada } = useTemporadaContext();
  const {
    partido,
    isLoading: isLoadingPartido,
    error,
  } = usePartido(idPartido, tipoCompeticion);
  const { showToast } = useToast();
  const [isGuardadando, setIsGuardando] = useState(false);
  const [textoGuardando, setTextoGuardando] = useState('');
  const [partidoActual, setPartidoActual] = useState<typeof partido | null>(
    null
  );
  const [cuartoActual, setCuartoActual] = useState('Q1');
  const [tiemposMuertosUsados, setTiemposMuertosUsados] = useState({
    local: { primeraMitad: false, segundaMitad: false, prorroga: false },
    visitante: { primeraMitad: false, segundaMitad: false, prorroga: false },
  });
  const [equipoSolicitandoTM, setEquipoSolicitandoTM] = useState<
    'local' | 'visitante' | null
  >(null);
  const [tiempoMuertoIniciado, setTiempoMuertoIniciado] = useState(false);
  const [cuartoIniciado, setCuartoIniciado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  const [quintetosListos, setQuintetosListos] = useState({
    local: false,
    visitante: false,
  });
  const [pararCronometro, setPararCronometro] = useState(false);
  const [jugadorExpulsadoPendiente, setJugadorExpulsadoPendiente] = useState({
    local: false,
    visitante: false,
  });
  const [modal, setModal] = useState<{
    title: string;
    message: string;
    visible: boolean;
  }>({
    title: '',
    message: '',
    visible: false,
  });
  const [accionesRealizadas, setAccionesRealizadas] = useState<
    HistorialAccion[]
  >([]);
  // Cargar inscripciones de ambos equipos
  const temporadaId = temporada!.id;
  const equipoLocalId = partidoActual?.equipoLocal?.id;
  const equipoVisitanteId = partidoActual?.equipoVisitante?.id;

  const {
    inscripcionesLocal,
    inscripcionesVisitante,
    isLoading: isLoadingInscripciones,
    error: errorInscripciones,
  } = useInscripcionesPartido(
    temporadaId,
    equipoLocalId || '',
    equipoVisitanteId || ''
  );

  //inicializamos partido
  useEffect(() => {
    setIsLoading(true);
    if (
      !partido ||
      isLoadingInscripciones ||
      !inscripcionesLocal ||
      !inscripcionesVisitante
    )
      return;

    const partidoInicializado = inicializarPartido(
      partido,
      inscripcionesLocal,
      inscripcionesVisitante
    );
    setPartidoActual(partidoInicializado);
    setIsLoading(false);
  }, [
    partido,
    isLoadingInscripciones,
    inscripcionesLocal,
    inscripcionesVisitante,
  ]);

  //Actualizamos las estadisticas del equipo para los cuartos
  useEffect(() => {
    if (!partidoActual) return;

    if (cuartoActual === 'Q1' || cuartoActual === 'DESCANSO') return;

    if (cuartoActual === 'FINALIZADO') {
      // Llama a tu función auxiliar para guardar el partido finalizado
      FormatearYGuardarPartido(
        temporadaId,
        partidoActual,
        setIsGuardando,
        setTextoGuardando
      ).then(({ message, type }) => {
        if (type === 'success') {
          showToast(message, type);
          router.back();
        }
      });
      return;
    }

    const partidoActualizado = inicializarCuarto(partidoActual, cuartoActual);
    setPartidoActual(partidoActualizado);
    setEquipoSolicitandoTM(null);
    setAccionesRealizadas([]);
  }, [cuartoActual]);
  const obtenerMitadActual = (cuarto: string) => {
    if (cuarto === 'Q1' || cuarto === 'Q2') return 'primeraMitad';
    if (cuarto === 'Q3' || cuarto === 'Q4') return 'segundaMitad';
    return 'prorroga';
  };

  const puedeSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    const mitad = obtenerMitadActual(cuartoActual);
    return !tiemposMuertosUsados[equipo][mitad];
  };

  const handleSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    const mitad = obtenerMitadActual(cuartoActual);

    if (equipoSolicitandoTM === equipo) {
      setEquipoSolicitandoTM(null); // cancela
      console.log(`Tiempo muerto cancelado por ${equipo} en la ${mitad}.`);
      return;
    }

    if (tiemposMuertosUsados[equipo][mitad]) {
      console.log(
        `El equipo ${equipo} ya usó su tiempo muerto en la ${mitad}.`
      );
      return;
    }

    setEquipoSolicitandoTM(equipo);
    console.log(`Tiempo muerto solicitado por ${equipo} en la ${mitad}.`);
  };

  const handleFinCuarto = () => {
    if (!partidoActual || !partidoActual.estadisticasEquipos) return;

    const puntosLocal = partidoActual.estadisticasEquipos.totales.local.puntos;
    const puntosVisitante =
      partidoActual.estadisticasEquipos.totales.visitante.puntos;

    // Lógica especial para final del Q4 o una prórroga
    if (cuartoActual === 'Q4' || cuartoActual.startsWith('PR')) {
      if (puntosLocal === puntosVisitante) {
        // Empate ➜ generar siguiente prórroga
        if (cuartoActual.startsWith('PR')) {
          const num = parseInt(cuartoActual.replace('PR', ''), 10) || 1;
          setCuartoActual(`PR${num + 1}`);
        } else {
          setCuartoActual('PR1');
        }
      } else {
        // Hay ganador ➜ finalizar partido
        setCuartoActual('FINALIZADO');
      }
    } else {
      // Secuencia normal de cuartos
      if (cuartoActual === 'Q1') return setCuartoActual('Q2');
      if (cuartoActual === 'Q2') return setCuartoActual('DESCANSO');
      if (cuartoActual === 'DESCANSO') return setCuartoActual('Q3');
      if (cuartoActual === 'Q3') return setCuartoActual('Q4');
    }
  };

  const handleActualizarEstadisticaJugador = ({
    jugadorId,
    equipo,
    accion,
    valor,
    tipoTiro,
  }: ActualizarEstadisticaJugadorParams) => {
    // Paso 1: Copia del estado
    if (!partidoActual) return;

    const partidoCopia = { ...partidoActual };

    if (
      !partidoCopia.estadisticasEquipos ||
      !partidoCopia.estadisticasJugadores
    )
      return;

    //Paso 2: Actualizar estadística del jugador
    const jugadorStats = partidoCopia.estadisticasJugadores[equipo][jugadorId];
    if (!jugadorStats) return;

    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      jugadorStats[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        jugadorStats[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          jugadorStats.puntos += puntosASumar * valor;
        }
      }
    }
    if (jugadorStats.faltasCometidas >= 5) {
      setPararCronometro(true);
      setModal({
        title: 'JugadorExpulsado!',
        message: 'El jugador ha cometido 5 faltas.',
        visible: true,
      });
    }

    // Paso 3: Actualizar estadística del equipo en el cuarto actual
    const equipoStatsCuarto =
      partidoCopia.estadisticasEquipos.porCuarto[cuartoActual][equipo];
    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      equipoStatsCuarto[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        equipoStatsCuarto[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales al equipo
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          equipoStatsCuarto.puntos += puntosASumar * valor;
        }
      }
    }

    // Paso 4: Actualizar estadística total del equipo
    const equipoStatsTotales = partidoCopia.estadisticasEquipos.totales[equipo];
    if (
      accion === 'puntos' ||
      accion === 'asistencias' ||
      accion === 'rebotes' ||
      accion === 'faltasCometidas'
    ) {
      equipoStatsTotales[accion] += valor;
    } else if (
      accion === 'tirosLibres' ||
      accion === 'tirosDos' ||
      accion === 'tirosTres'
    ) {
      if (tipoTiro) {
        equipoStatsTotales[accion][tipoTiro] += valor;

        // 💡 Si es un tiro ANOTADO, sumar los puntos reales al total
        if (tipoTiro === 'anotados') {
          let puntosASumar = 0;
          if (accion === 'tirosLibres') puntosASumar = 1;
          if (accion === 'tirosDos') puntosASumar = 2;
          if (accion === 'tirosTres') puntosASumar = 3;

          equipoStatsTotales.puntos += puntosASumar * valor;
        }
      }
    }

    // Paso 5: Marcar que el jugador ha jugado
    if (!jugadorStats.haJugado) {
      jugadorStats.haJugado = true;
    }

    // Paso 6: Agregar la acción al historial
    if (valor > 0) {
      const accionRealizada: HistorialAccion = {
        nombre: jugadorStats.nombre,
        apellidos: jugadorStats.apellidos,
        dorsal: jugadorStats.dorsal,
        jugadorId,
        equipo,
        accion,
        valor,
        tipoTiro,
        id: getRandomUID(),
      };
      setAccionesRealizadas((prev) => [accionRealizada, ...prev]);
    }
    // Paso 7: Actualizar el estado
    setPartidoActual(partidoCopia);
  };

  const handleEliminarAccion = (idAccion: string) => {
    // Buscar la acción
    const accion = accionesRealizadas.find((a) => a.id === idAccion);
    if (!accion) return;

    // Deshacer la acción (aplicando la misma acción pero con valor negativo)
    handleActualizarEstadisticaJugador({
      jugadorId: accion.jugadorId,
      equipo: accion.equipo,
      accion: accion.accion,
      valor: -accion.valor,
      tipoTiro: accion.tipoTiro,
    });

    // Eliminarla del historial
    setAccionesRealizadas((prev) => prev.filter((a) => a.id !== idAccion));
  };

  const handleQuintetoListo = (
    equipo: 'local' | 'visitante',
    listo: boolean
  ) => {
    setQuintetosListos((prev) => ({ ...prev, [equipo]: listo }));
  };

  const pararCronometroHandler = (parar: boolean) => {
    setPararCronometro(parar);
  };

  const setJugadorExpulsadoPendienteHandler = (
    equipo: 'local' | 'visitante',
    pendiente: boolean
  ) => {
    setJugadorExpulsadoPendiente((prev) => ({ ...prev, [equipo]: pendiente }));
  };

  if (isLoadingPartido || isLoadingInscripciones || isLoading) {
    return <LoadingIndicator text='Cargando datos del partido...' />;
  }

  if (error || errorInscripciones || !partidoActual) {
    return (
      <StyledAlert
        variant='error'
        message={`Error al cargar el partido o inscripciones: ${
          error || errorInscripciones
        }`}
      />
    );
  }

  if (
    !partidoActual.estadisticasEquipos ||
    !partidoActual.estadisticasJugadores
  )
    return null;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    superior: { flex: 1 },
    inferior: { flex: 2 },
  });

  if (isGuardadando) {
    return <LoadingIndicator text={textoGuardando} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
        translucent
      />
      <View style={styles.superior}>
        <MesaSuperior
          puntos={{
            local: partidoActual.estadisticasEquipos.totales.local.puntos,
            visitante:
              partidoActual.estadisticasEquipos.totales.visitante.puntos,
          }}
          equipoLocal={partidoActual.equipoLocal}
          equipoVisitante={partidoActual.equipoVisitante}
          estadisticasCuartoActual={
            partidoActual.estadisticasEquipos.porCuarto[cuartoActual]
          }
          cuartoActual={cuartoActual}
          onSolicitarTiempoMuerto={handleSolicitarTiempoMuerto}
          onFinCuarto={handleFinCuarto}
          onFinTiempoMuerto={() => {
            setTiemposMuertosUsados((prev) => ({
              ...prev,
              [equipoSolicitandoTM!]: {
                ...prev[equipoSolicitandoTM!],
                [obtenerMitadActual(cuartoActual)]: true,
              },
            }));
            setEquipoSolicitandoTM(null);
          }}
          tiempoMuertoSolicitado={
            equipoSolicitandoTM
              ? {
                  local: equipoSolicitandoTM === 'local',
                  visitante: equipoSolicitandoTM === 'visitante',
                }
              : { local: false, visitante: false }
          }
          puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          setTiempoMuertoIniciado={setTiempoMuertoIniciado}
          setCuartoIniciado={setCuartoIniciado}
          quintetosListos={quintetosListos}
          partidoIniciado={partidoIniciado}
          setPartidoIniciado={setPartidoIniciado}
          pararCronometro={pararCronometro}
          setPararCronometro={pararCronometroHandler}
          jugadorExpulsadoPendiente={jugadorExpulsadoPendiente}
        />
      </View>
      <View style={styles.inferior}>
        <MesaInferior
          cuartoActual={cuartoActual}
          estadisticasJugadores={partidoActual.estadisticasJugadores}
          onActualizarEstadisticasJugadores={handleActualizarEstadisticaJugador}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          cuartoIniciado={cuartoIniciado}
          setQuintetosListos={handleQuintetoListo}
          setJugadorExpulsadoPendiente={setJugadorExpulsadoPendienteHandler}
          historialAcciones={accionesRealizadas}
          onEliminarAccion={handleEliminarAccion}
        />
      </View>
      <BaseConfirmationModal
        onCancel={() => {
          setModal({
            title: '',
            message: '',
            visible: false,
          });
        }}
        onConfirm={() => {
          setModal({
            title: '',
            message: '',
            visible: false,
          });
        }}
        title={modal.title}
        type='create'
        visible={modal.visible}
        description={modal.message}
      />
    </SafeAreaView>
  );
}
