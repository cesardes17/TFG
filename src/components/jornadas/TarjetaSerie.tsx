import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Serie } from '../../types/Serie';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import { useTheme } from '../../contexts/ThemeContext';
import { capitalizeFirst } from '../../utils/capitalizeString';

interface TarjetaSerieProps {
  serie: Serie;
  refetchSerie: () => void;
}

export const TarjetaSerie = ({ serie, refetchSerie }: TarjetaSerieProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const handlePress = () => {
    router.push(`/serie/${serie.id}`);
  };

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return {
          backgroundColor: theme.background.info,
          color: theme.text.light,
          text: 'Pendiente',
        };
      case 'en-juego':
        return {
          backgroundColor: theme.background.error,
          color: theme.text.light,
          text: 'En Juego',
        };
      case 'finalizado':
        return {
          backgroundColor: theme.text.success,
          color: theme.text.light,
          text: 'Finalizado',
        };
      default:
        return {
          backgroundColor: theme.background.warning,
          color: theme.text.dark,
          text: 'Desconocido',
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.tarjetaContainer,
        {
          backgroundColor: theme.cardDefault,
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.contenidoContainer}>
        {/* Equipo Local */}
        <View style={styles.equipoContainer}>
          {serie.local.escudoUrl === '' ? (
            <View
              style={[
                styles.escudo,
                {
                  backgroundColor: theme.border.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <StyledText style={styles.nombreEquipo}>D</StyledText>
            </View>
          ) : (
            <ProgressiveImage
              uri={serie.local.escudoUrl}
              containerStyle={styles.escudo}
              resizeMode='contain'
            />
          )}
          <StyledText style={styles.nombreEquipo} numberOfLines={1}>
            {serie.local.nombre}
          </StyledText>
        </View>

        {/* Marcador */}
        <View style={styles.marcadorContainer}>
          <StyledText style={styles.marcador}>
            {serie.partidosGanadosLocal} - {serie.partidosGanadosVisitante}
          </StyledText>
        </View>

        {/* Equipo Visitante */}
        <View style={styles.equipoContainer}>
          {serie.visitante.escudoUrl === '' ? (
            <View
              style={[
                styles.escudo,
                {
                  backgroundColor: theme.border.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <StyledText style={styles.nombreEquipo}>D</StyledText>
            </View>
          ) : (
            <ProgressiveImage
              uri={serie.visitante.escudoUrl}
              containerStyle={styles.escudo}
              resizeMode='contain'
            />
          )}
          <StyledText style={styles.nombreEquipo} numberOfLines={1}>
            {serie.visitante.nombre}
          </StyledText>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badgesContainer}>
        <View
          style={[
            getEstadoStyle(serie.estado),
            { padding: 6, borderRadius: 100 },
          ]}
        >
          <StyledText style={styles.badgeText}>
            {capitalizeFirst(serie.estado)}
          </StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tarjetaContainer: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contenidoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipoContainer: {
    flex: 2,
    alignItems: 'center',
    padding: 8,
  },
  escudo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    borderRadius: 100,
  },
  nombreEquipo: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  marcadorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcador: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeEnVivo: {
    backgroundColor: '#FF3B30',
  },
  badgeFinalizado: {
    backgroundColor: '#8E8E93',
  },
  badgePendiente: {
    backgroundColor: '#34C759',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
