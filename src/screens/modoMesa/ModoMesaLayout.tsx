// src/components/mesa/MesaLayout.tsx
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { TipoCompeticion } from '../../types/Competicion';
import { useTheme } from '../../contexts/ThemeContext';
import MesaSuperior from '../../components/modoMesa/superior/MesaSuperior';
import MesaInferior from '../../components/modoMesa/inferior/MesaInferior';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import usePartidoMesa from '../../hooks/usePartidoMesa';
import LoadingIndicator from '../../components/common/LoadingIndicator';

interface Props {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}

export default function MesaLayout({ idPartido, tipoCompeticion }: Props) {
  const { theme, mode } = useTheme();
  const {
    partido,
    partidoIniciado,
    quintetosListos,
    cuartoActual,
    cronometroActivo,
    tiempoActualCuarto,
    tiempoMuertoPendiente,
    tiempoMuertoActivo,
    modal,
    jugadorExpulsadoPendiente,
    cuartoIniciado,
    accionesPartido,
    deshabilitarEstadisticas,
    isGuardando,
    guardandoTexto,
    puedeSolicitarTiempoMuerto,
    handlePartidoIniciado,
    handleQuintetosListos,
    handleFinCuarto,
    setCronometroActivo,
    handleCancelarTiempoMuerto,
    handleSolicitarTiempoMuerto,
    handleInicioTiempoMuerto,
    handleFinTiempoMuerto,
    setModal,
    handleCuartoIniciado,
    handleJugadorExpulsadoPendiente,
    handleActualizarEstadisticaJugador,
    handleEliminarAccion,
    iniciarCronometro,
    pausarCronometro,
  } = usePartidoMesa(tipoCompeticion, idPartido);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    superior: { flex: 1 },
    inferior: { flex: 2 },
  });

  if (
    !partido ||
    !partido.estadisticasEquipos ||
    !partido.estadisticasJugadores
  )
    return null;

  if (isGuardando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator text={guardandoTexto} />
      </View>
    );
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
          equipoLocal={partido.equipoLocal}
          equipoVisitante={partido.equipoVisitante}
          puntos={{
            local: partido.estadisticasEquipos.totales.local.puntos,
            visitante: partido.estadisticasEquipos.totales.visitante.puntos,
          }}
          estadisticasCuartoActual={
            partido.estadisticasEquipos.porCuarto[cuartoActual]
          }
          tiempoMuertoSolicitado={tiempoMuertoPendiente}
          tiempoMuertoIniciado={tiempoMuertoActivo} // 🟢 Nombre correcto para MesaSuperior
          onSolicitarTiempoMuerto={handleSolicitarTiempoMuerto}
          onCancelarTiempoMuerto={handleCancelarTiempoMuerto}
          cuartoActual={cuartoActual}
          tiempoActualCuarto={tiempoActualCuarto}
          iniciarCronometro={iniciarCronometro}
          pausarCronometro={pausarCronometro}
          setCuartoIniciado={handleCuartoIniciado}
          onFinTiempoMuerto={handleFinTiempoMuerto}
          onFinCuarto={handleFinCuarto}
          setTiempoMuertoIniciado={handleInicioTiempoMuerto}
          partidoIniciado={partidoIniciado}
          setPartidoIniciado={handlePartidoIniciado}
          quintetosListos={quintetosListos}
          puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
          cronometroActivo={cronometroActivo}
          jugadorExpulsadoPendiente={jugadorExpulsadoPendiente}
          setCronometroActivo={setCronometroActivo} // 🟢 importante para el control final del cronómetro
        />
      </View>
      <View style={styles.inferior}>
        <MesaInferior
          cuartoActual={cuartoActual}
          estadisticasJugadores={partido.estadisticasJugadores}
          onActualizarEstadisticasJugadores={handleActualizarEstadisticaJugador}
          tiempoMuertoIniciado={tiempoMuertoActivo}
          cuartoIniciado={cuartoIniciado}
          setQuintetosListos={handleQuintetosListos}
          setJugadorExpulsadoPendiente={handleJugadorExpulsadoPendiente}
          historialAcciones={accionesPartido}
          onEliminarAccion={handleEliminarAccion}
          jugadorExpulsadoPendiente={
            jugadorExpulsadoPendiente.local ||
            jugadorExpulsadoPendiente.visitante
          }
          deshabilitarEstadisticas={deshabilitarEstadisticas}
        />
      </View>
      <BaseConfirmationModal
        onCancel={() => setModal({ title: '', message: '', visible: false })}
        onConfirm={() => setModal({ title: '', message: '', visible: false })}
        title={modal.title}
        type='create'
        visible={modal.visible}
        description={modal.message}
      />
    </SafeAreaView>
  );
}
