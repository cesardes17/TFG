import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Serie } from '../../types/Serie';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { capitalizeFirst } from '../../utils/capitalizeString';
import ProgressiveImage from '../common/ProgressiveImage';

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

  let resultado;

  if (serie.estado === 'finalizada' && serie.visitante.id === 'bye') {
    resultado = '2 - 0';
  } else if (
    serie.visitante.id === 'por-definir' ||
    serie.local.id === 'por-definir'
  ) {
    resultado = 'vs';
  } else {
    resultado = `${serie.partidosGanadosLocal} - ${serie.partidosGanadosVisitante}`;
  }

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
      style={[styles.tarjetaContainer, { backgroundColor: theme.cardDefault }]}
      onPress={handlePress}
    >
      {/* Badge EN VIVO (posición absoluta) */}
      {/* <View style={styles.badgeEnVivo}>
        <StyledText style={styles.badgeText}>EN VIVO</StyledText>
      </View> */}

      <View style={styles.contenidoContainer}>
        {/* Equipo Local */}
        <View style={styles.equipoContainer}>
          {serie.local.escudoUrl === '' ? (
            <View
              style={[
                styles.escudo,
                {
                  backgroundColor: '#FFFFFF4A',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <StyledText>D</StyledText>
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
          <StyledText style={styles.marcador}>{resultado}</StyledText>
        </View>

        {/* Equipo Visitante */}
        <View style={styles.equipoContainer}>
          {serie.visitante.escudoUrl === '' ? (
            <View
              style={[
                styles.escudo,
                {
                  backgroundColor: '#FFFFFF4A',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <StyledText>D</StyledText>
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

      {/* Badges de estado */}
      <View style={styles.estadoBadgesContainer}>
        <View style={[styles.badge, getEstadoStyle(serie.estado)]}>
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
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative', // Para posicionar el badge absoluto
  },
  contenidoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrar todo el contenido
    width: '100%',
  },
  equipoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  escudo: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  nombreEquipo: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '100%', // Asegurar que el texto no se desborde
  },
  marcadorContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcador: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  estadoBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeEnVivo: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 8,
    zIndex: 10,
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
