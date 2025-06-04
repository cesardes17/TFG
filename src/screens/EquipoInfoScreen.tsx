import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTemporadaContext } from '../contexts/TemporadaContext';
import { useTheme } from '../contexts/ThemeContext';
import StyledAlert from '../components/common/StyledAlert';
import EquipoInfoCard from '../components/equipo/EquipoInfoCard';
import TablaJugadores from '../components/equipo/TablaJugadores';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { useEquipoInfo } from '../hooks/useEquipoInfo';
import { useInscripcionesEquipo } from '../hooks/useInscripcionesEquipo';
import useClasificacionEquipo from '../hooks/useClasificacionEquipo';
import EstadisticasEquipo from '../components/equipo/EstadisticasEquipo';
import StyledText from '../components/common/StyledText';

interface EquipoInfoScreenProps {
  equipoId: string;
}

export default function EquipoInfoScreen({ equipoId }: EquipoInfoScreenProps) {
  const { temporada } = useTemporadaContext();
  const { theme } = useTheme();

  const {
    equipoInfo,
    loading: loadingEquipo,
    errorMsg: errorEquipo,
  } = useEquipoInfo(temporada?.id, equipoId);

  const {
    jugadores,
    loading: loadingInscripciones,
    errorMsg: errorInscripciones,
  } = useInscripcionesEquipo(temporada?.id, equipoId);

  const { clasificacion, isLoading: isLoadingClasificacion } =
    useClasificacionEquipo(temporada?.id || null, 'liga-regular', equipoId);

  const [vista, setVista] = useState<'estadisticas' | 'jugadores'>(
    'estadisticas'
  );

  const isLoading = loadingEquipo || loadingInscripciones;
  const errorMsg = errorEquipo || errorInscripciones;

  if (isLoading) {
    return <LoadingIndicator text='Cargando información...' />;
  }

  if (errorMsg || !equipoInfo || !jugadores) {
    return (
      <View style={styles.centeredContainer}>
        <StyledAlert
          variant='error'
          message={errorMsg || 'Error al obtener la información del equipo'}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <EquipoInfoCard
        nombre={equipoInfo.nombre}
        capitan={equipoInfo.capitan}
        escudoUrl={equipoInfo.escudoUrl}
        clasificacion={clasificacion}
      />

      <View
        style={[
          styles.selectorContainer,
          { borderBottomColor: theme.border.secondary },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'estadisticas' && {
              borderBottomWidth: 3,
              borderBottomColor: theme.text.success,
            },
          ]}
          onPress={() => setVista('estadisticas')}
        >
          <StyledText
            variant={vista === 'estadisticas' ? 'success' : 'primary'}
            style={[
              styles.selectorTexto,
              vista === 'estadisticas' && styles.selectorTextoActivo,
            ]}
          >
            Estadísticas
          </StyledText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'jugadores' && {
              borderBottomWidth: 3,
              borderBottomColor: theme.text.success,
            },
          ]}
          onPress={() => setVista('jugadores')}
        >
          <StyledText
            variant={vista === 'jugadores' ? 'success' : 'primary'}
            style={[
              styles.selectorTexto,
              vista === 'jugadores' && styles.selectorTextoActivo,
            ]}
          >
            Jugadores
          </StyledText>
        </TouchableOpacity>
      </View>

      <View style={styles.contenidoContainer}>
        {vista === 'estadisticas' ? (
          <EstadisticasEquipo
            estadisticasCopa={equipoInfo.estadisticasCopa}
            estadisticasLiga={equipoInfo.estadisticasLigaRegular}
            estadisticasPlayoff={equipoInfo.estadisticasPlayoff}
          />
        ) : (
          <TablaJugadores players={jugadores} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectorTexto: {
    fontWeight: '500',
  },
  selectorTextoActivo: {},
  contenidoContainer: {
    flex: 1,
    marginTop: 12,
  },
});
