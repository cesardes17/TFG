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
export type TipoTiro = 'anotados' | 'fallados';

export default function MesaLayout({ idPartido, tipoCompeticion }: Props) {
  const { theme, mode } = useTheme();
  const { temporada } = useTemporadaContext();
  const {
    partido,
    isLoading: isLoadingPartido,
    error,
  } = usePartido(idPartido, tipoCompeticion);

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
    if (cuartoActual === 'Q1' || cuartoActual === 'DESCANSO') return;
    if (partidoActual) {
      const partidoActualizado = inicializarCuarto(partidoActual, cuartoActual);
      setPartidoActual(partidoActualizado);
      setEquipoSolicitandoTM(null);
    }
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
    setCuartoActual((prevCuarto) => {
      if (prevCuarto === 'Q1') return 'Q2';
      if (prevCuarto === 'Q2') return 'DESCANSO';
      if (prevCuarto === 'DESCANSO') return 'Q3';
      if (prevCuarto === 'Q3') return 'Q4';
      if (prevCuarto === 'Q4') return 'PR1';
      if (prevCuarto.startsWith('PR')) {
        const num = parseInt(prevCuarto.replace('PR', ''), 10) || 1;
        return `PR${num + 1}`;
      }
      return 'Q1';
    });
  };

  const handleActualizarEstadisticaJugador = ({
    jugadorId,
    equipo,
    accion,
    valor,
    tipoTiro,
  }: ActualizarEstadisticaJugadorParams) => {
    // 1️⃣ Copia del estado
    if (!partidoActual) return;

    const partidoCopia = { ...partidoActual };

    if (
      !partidoCopia.estadisticasEquipos ||
      !partidoCopia.estadisticasJugadores
    )
      return;

    // 2️⃣ Actualizar estadística del jugador
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

    // 3️⃣ Actualizar estadística del equipo en el cuarto actual
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

    // 4️⃣ Actualizar estadística total del equipo
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

    // 5️⃣ Marcar que el jugador ha jugado
    if (!jugadorStats.haJugado) {
      jugadorStats.haJugado = true;
    }

    // 6️⃣ Guardar el nuevo estado
    setPartidoActual(partidoCopia);
  };

  const handleQuintetoListo = (
    equipo: 'local' | 'visitante',
    listo: boolean
  ) => {
    setQuintetosListos((prev) => ({ ...prev, [equipo]: listo }));
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
        />
      </View>
      <View style={styles.inferior}>
        <MesaInferior
          estadisticasJugadores={partidoActual.estadisticasJugadores}
          onActualizarEstadisticasJugadores={handleActualizarEstadisticaJugador}
          tiempoMuertoIniciado={tiempoMuertoIniciado}
          cuartoIniciado={cuartoIniciado}
          setQuintetosListos={handleQuintetoListo}
        />
      </View>
    </SafeAreaView>
  );
}
