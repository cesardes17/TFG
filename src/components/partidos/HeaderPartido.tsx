import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProgressiveImage from '../common/ProgressiveImage';
import StyledText from '../common/StyledText';
import { EstadisticasEquiposPartido } from '../../types/estadisticas/equipo';
import { useTheme } from '../../contexts/ThemeContext';
import { CalendarIcon, LocationIcon } from '../Icons';

interface Equipo {
  id: string;
  nombre: string;
  escudoUrl: string;
}

interface Resultado {
  puntosLocal: number;
  puntosVisitante: number;
}

interface HeaderPartidoProps {
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  estado: 'pendiente' | 'en-juego' | 'finalizado';
  resultado: Resultado | null;
  fecha: Date | null;
  cancha?: string;
  cuartoActual?: string | null;
  minutoActual?: number | null;
  estadisticasEquipo: EstadisticasEquiposPartido | null;
}

const HeaderPartido: React.FC<HeaderPartidoProps> = ({
  equipoLocal,
  equipoVisitante,
  estado,
  resultado,
  fecha,
  cancha,
  cuartoActual,
  minutoActual,
  estadisticasEquipo,
}) => {
  const { theme } = useTheme();

  const puntosLocal =
    estado === 'en-juego'
      ? estadisticasEquipo?.totales.local.puntos
      : resultado?.puntosLocal ?? '';
  const puntosVisitante =
    estado === 'en-juego'
      ? estadisticasEquipo?.totales.visitante.puntos
      : resultado?.puntosVisitante ?? '';

  const getEstadoBadgeStyle = () => {
    switch (estado) {
      case 'pendiente':
        return {
          backgroundColor: theme.background.info,
          color: theme.text.light,
        };
      case 'en-juego':
        return {
          backgroundColor: theme.background.error,
          color: theme.text.light,
        };
      case 'finalizado':
        return {
          backgroundColor: theme.background.success,
          color: theme.text.light,
        };
      default:
        return {
          backgroundColor: theme.background.warning,
          color: theme.text.light,
        };
    }
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const badgeStyle = getEstadoBadgeStyle();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardDefault, shadowColor: theme.text.primary },
      ]}
    >
      {/* Zona Superior */}
      <View style={styles.zonaEstado}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: badgeStyle.backgroundColor },
          ]}
        >
          <StyledText style={[styles.estadoTexto, { color: badgeStyle.color }]}>
            {estado.toUpperCase()}
          </StyledText>
        </View>

        {estado === 'en-juego' && cuartoActual && minutoActual !== null && (
          <View style={styles.tiempoInfo}>
            <StyledText
              style={[styles.cuartoTexto, { color: theme.text.primary }]}
            >
              {cuartoActual}
            </StyledText>
            <StyledText
              style={[styles.minutoTexto, { color: theme.text.secondary }]}
            >
              {minutoActual}'
            </StyledText>
          </View>
        )}
      </View>

      {/* Zona Media */}
      <View style={styles.zonaMarcador}>
        {/* Equipo Local */}
        <View style={styles.equipoContainer}>
          <ProgressiveImage
            uri={equipoLocal.escudoUrl}
            containerStyle={styles.escudo}
          />
          <StyledText
            style={[styles.nombreEquipo, { color: theme.text.primary }]}
            numberOfLines={2}
          >
            {equipoLocal.nombre}
          </StyledText>
        </View>

        {/* Marcador */}
        <View style={styles.marcadorContainer}>
          <View
            style={[
              styles.marcador,
              { backgroundColor: theme.background.primary },
            ]}
          >
            <StyledText style={[styles.puntos, { color: theme.text.primary }]}>
              {puntosLocal}
            </StyledText>
            <StyledText
              style={[
                styles.separadorMarcador,
                { color: theme.text.secondary },
              ]}
            >
              -
            </StyledText>
            <StyledText style={[styles.puntos, { color: theme.text.primary }]}>
              {puntosVisitante}
            </StyledText>
          </View>
        </View>

        {/* Equipo Visitante */}
        <View style={styles.equipoContainer}>
          <ProgressiveImage
            uri={equipoVisitante.escudoUrl}
            containerStyle={styles.escudo}
            resizeMode='contain'
          />
          <StyledText
            style={[styles.nombreEquipo, { color: theme.text.primary }]}
            numberOfLines={2}
          >
            {equipoVisitante.nombre}
          </StyledText>
        </View>
      </View>

      {/* Zona Inferior */}
      <View style={[styles.zonaInfo, { borderTopColor: theme.border.primary }]}>
        <View style={styles.infoItem}>
          <CalendarIcon color={theme.text.primary} />
          <StyledText
            style={[styles.infoTexto, { color: theme.text.secondary }]}
          >
            {fecha && formatearFecha(fecha)}
          </StyledText>
        </View>

        <View style={styles.infoItem}>
          <LocationIcon color={theme.text.primary} />
          <StyledText
            style={[styles.infoTexto, { color: theme.text.secondary }]}
          >
            {cancha || '-'}
          </StyledText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Zona Superior
  zonaEstado: {
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
  estadoTexto: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tiempoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cuartoTexto: {
    fontSize: 14,
    fontWeight: '600',
  },
  minutoTexto: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Zona Media
  zonaMarcador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    minHeight: 80,
  },
  equipoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  escudo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  nombreEquipo: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  marcadorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: '100%',
  },
  puntos: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  separadorMarcador: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },

  // Zona Inferior
  zonaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconoTexto: {
    fontSize: 16,
    marginRight: 8,
  },
  infoTexto: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
});

export default HeaderPartido;
