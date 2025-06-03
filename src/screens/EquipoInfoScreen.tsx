import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
    useClasificacionEquipo(
      temporada?.id || null,
      'liga-regular', // o la competición que corresponda
      equipoId
    );

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

      {/* Botonera de selección de vista */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'estadisticas' && styles.selectorActivo,
          ]}
          onPress={() => setVista('estadisticas')}
        >
          <Text
            style={[
              styles.selectorTexto,
              vista === 'estadisticas' && styles.selectorTextoActivo,
            ]}
          >
            Estadísticas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'jugadores' && styles.selectorActivo,
          ]}
          onPress={() => setVista('jugadores')}
        >
          <Text
            style={[
              styles.selectorTexto,
              vista === 'jugadores' && styles.selectorTextoActivo,
            ]}
          >
            Jugadores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido según la vista seleccionada */}
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
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectorActivo: {
    borderBottomWidth: 3,
    borderBottomColor: '#05C484',
  },
  selectorTexto: {
    color: '#333',
    fontWeight: '500',
  },
  selectorTextoActivo: {
    color: '#05C484',
  },
  contenidoContainer: {
    flex: 1,
    marginTop: 12,
  },
});
