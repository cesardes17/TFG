// TarjetaPartido.tsx
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { CalendarIcon, LocationIcon } from '../Icons';
import ProgressiveImage from '../common/ProgressiveImage';
import { router } from 'expo-router';
import { Partido } from '../../types/Partido';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

interface Props {
  partido: Partido;
}

export default function TarjetaPartido({ partido }: Props) {
  const { theme } = useTheme();

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return {
          backgroundColor: theme.background.primary,
          color: theme.text.dark,
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
          backgroundColor: theme.background.info,
          color: theme.text.light,
          text: 'Finalizado',
        };
      default:
        return {
          backgroundColor: theme.background.primary,
          color: theme.text.dark,
          text: 'Desconocido',
        };
    }
  };

  const formatearFecha = (fecha?: Date) => {
    if (!fecha) return null;
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const estadoStyle = getEstadoStyle(partido.estado);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/partido/[id]',
          params: {
            id: partido.id,
            tipoCompeticion: partido.tipoCompeticion,
          },
        });
      }}
      style={[styles.tarjetaContainer, { backgroundColor: theme.cardDefault }]}
    >
      <View style={styles.tarjetaHeader}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: estadoStyle.backgroundColor },
          ]}
        >
          <StyledText style={[styles.estadoText, { color: estadoStyle.color }]}>
            {estadoStyle.text}
          </StyledText>
        </View>
        {partido.fecha && (
          <StyledText variant='secondary' style={styles.fechaText}>
            <CalendarIcon color={theme.text.secondary} size={12} />{' '}
            {formatearFecha(partido.fecha)}
          </StyledText>
        )}
      </View>

      <View style={styles.partidoContent}>
        <View style={styles.equipoContainer}>
          {partido.equipoLocal.nombre === 'Descansa' ? (
            <View
              style={[
                styles.escudoDescansa,
                { backgroundColor: theme.border.secondary },
              ]}
            >
              <StyledText style={styles.letraDescansa}>D</StyledText>
            </View>
          ) : (
            <ProgressiveImage
              uri={partido.equipoLocal.escudoUrl}
              containerStyle={[
                styles.escudoImage,
                { backgroundColor: theme.background.primary },
              ]}
            />
          )}
          <StyledText
            variant='primary'
            style={styles.equipoNombre}
            numberOfLines={2}
          >
            {partido.equipoLocal.nombre}
          </StyledText>
        </View>
        <View style={styles.resultadoContainer}>
          {partido.resultado ? (
            <StyledText variant='primary' style={styles.marcadorText}>
              {partido.resultado.puntosLocal} -{' '}
              {partido.resultado.puntosVisitante}
            </StyledText>
          ) : (
            <StyledText variant='secondary' style={styles.vsText}>
              VS
            </StyledText>
          )}
        </View>
        <View style={[styles.equipoContainer, styles.equipoVisitante]}>
          <StyledText
            variant='primary'
            style={[styles.equipoNombre, styles.equipoNombreVisitante]}
            numberOfLines={2}
          >
            {partido.equipoVisitante.nombre}
          </StyledText>
          {partido.equipoVisitante.nombre === 'Descansa' ? (
            <View
              style={[
                styles.escudoDescansa,
                { backgroundColor: theme.border.secondary },
              ]}
            >
              <StyledText style={styles.letraDescansa}>D</StyledText>
            </View>
          ) : (
            <ProgressiveImage
              uri={partido.equipoVisitante.escudoUrl}
              containerStyle={[
                styles.escudoImage,
                { backgroundColor: theme.background.primary },
              ]}
            />
          )}
        </View>
      </View>

      {partido.cancha && (
        <View style={styles.canchaContainer}>
          <StyledText variant='secondary' style={styles.canchaText}>
            <LocationIcon color={theme.text.secondary} size={16} />{' '}
            {partido.cancha}
          </StyledText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjetaContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fechaText: {
    fontSize: 12,
  },
  partidoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipoVisitante: {
    justifyContent: 'flex-end',
  },
  escudoImage: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
  },
  equipoNombre: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    flex: 1,
  },
  equipoNombreVisitante: {
    textAlign: 'right',
  },
  resultadoContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcadorText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
  },
  canchaContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  canchaText: {
    fontSize: 12,
  },
  escudoDescansa: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letraDescansa: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#6b7280',
  },
});
