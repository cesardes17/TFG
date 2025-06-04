// src/screens/modoMesa/MesaLayout.tsx
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { TipoCompeticion } from '../../types/Competicion';
import { useTheme } from '../../contexts/ThemeContext';
import MesaSuperior from '../../components/modoMesa/superior/MesaSuperior';
import MesaInferior from '../../components/modoMesa/inferior/MesaInferior';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import usePartidoMesa from '../../hooks/usePartidoMesa';

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
    tiempoMuertoPendiente,
    tiempoMuertoActivo,
    modal,
    jugadorExpulsadoPendiente,
    pararCronometro,
    cuartoIniciado,
    accionesPartido,
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
    handlePararCronometro,
    handleCuartoIniciado,
    handleJugadorExpulsadoPendiente,
    handleActualizarEstadisticaJugador,
    handleEliminarAccion,
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
    return;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
        translucent
      />
      <View style={styles.superior}>
        <View style={styles.superior}>
          <MesaSuperior
            // 🏀 Datos de equipos y estadísticas
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
            tiempoMuertoIniciado={tiempoMuertoActivo}
            onSolicitarTiempoMuerto={handleSolicitarTiempoMuerto}
            onCancelarTiempoMuerto={handleCancelarTiempoMuerto}
            // ⏱️ Control de tiempo
            setCronometroActivo={setCronometroActivo}
            cuartoActual={cuartoActual}
            setCuartoIniciado={handleCuartoIniciado}
            onFinTiempoMuerto={handleFinTiempoMuerto}
            onFinCuarto={handleFinCuarto}
            setTiempoMuertoIniciado={handleInicioTiempoMuerto}
            pararCronometro={pararCronometro}
            setPararCronometro={handlePararCronometro}
            partidoIniciado={partidoIniciado}
            setPartidoIniciado={handlePartidoIniciado}
            quintetosListos={quintetosListos}
            puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
            // ⚠️ Incidencias
            jugadorExpulsadoPendiente={jugadorExpulsadoPendiente}
          />
        </View>
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
          cronometroActivo={cronometroActivo}
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
