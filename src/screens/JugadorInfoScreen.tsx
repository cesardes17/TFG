// src/screens/JugadorInfoScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useTheme } from '../contexts/ThemeContext';
import StyledAlert from '../components/common/StyledAlert';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { useJugadorInfo } from '../hooks/useJugadorInfo';
import { useEstadisticasJugador } from '../hooks/useEstadisticaJugador';
import JugadorInfoCard from '../components/jugador/JugadorInfoCard';
import EstadisticasJugador from '../components/jugador/EstadisticasJugador';

interface Props {
  jugadorId: string;
}

const JugadorInfoScreen: React.FC<Props> = ({ jugadorId }) => {
  const { temporada } = useTemporadaContext();
  const { theme } = useTheme();

  const {
    jugadorInfo,
    loading: loadingJugador,
    errorMsg: errorJugador,
  } = useJugadorInfo(jugadorId);

  const {
    estadisticasCopa,
    estadisticasLiga,
    estadisticasPlayoff,
    loading: loadingEstadisticas,
    errorMsg: errorEstadisticas,
  } = useEstadisticasJugador(jugadorId, temporada?.id);

  const isLoading = loadingJugador || loadingEstadisticas;
  const errorMsg = errorJugador || errorEstadisticas;

  if (isLoading) {
    return <LoadingIndicator text='Cargando información del jugador...' />;
  }

  if (errorMsg || !jugadorInfo) {
    return (
      <View style={styles.centered}>
        <StyledAlert
          variant='error'
          message={errorMsg || 'Error al obtener la información del jugador'}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <JugadorInfoCard
        jugadorInfo={jugadorInfo}
        estadisticas={estadisticasLiga}
      />
      <EstadisticasJugador
        estadisticasLiga={estadisticasLiga}
        estadisticasCopa={estadisticasCopa}
        estadisticasPlayoff={estadisticasPlayoff}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JugadorInfoScreen;
