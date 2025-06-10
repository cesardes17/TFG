import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { CalendarIcon, LocationIcon } from '../Icons';
import ProgressiveImage from '../common/ProgressiveImage';
import { router } from 'expo-router';
import { Partido } from '../../types/Partido';
import usePartidoEnVivo from '../../hooks/usePartidoEnVivo';

import { useTemporadaContext } from '../../contexts/TemporadaContext';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

interface Props {
  partido: Partido;
  reftechPartidos: () => void;
}

export default function TarjetaPartido({ partido, reftechPartidos }: Props) {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();

  if (!temporada) {
    return;
  }

  // 👉 Usamos el hook con callback
  const partidoEnVivo = usePartidoEnVivo(
    partido.id,
    partido.estado === 'en-juego',
    reftechPartidos // 🔥 callback para recargar
  );

  const partidoAMostrar = partidoEnVivo || partido;
  const esDescansa =
    partidoAMostrar.equipoLocal.nombre === 'Descansa' ||
    partidoAMostrar.equipoVisitante.nombre === 'Descansa';

  const getEstadoStyle = (estado: string) => {
    if (esDescansa) {
      return {
        backgroundColor: '#e0e0e0',
        color: '#333',
        text: 'Descansa',
      };
    }

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

  const estadoStyle = getEstadoStyle(partidoAMostrar.estado);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/partido/[id]',
          params: {
            id: partidoAMostrar.id,
            tipoCompeticion: partidoAMostrar.tipoCompeticion,
          },
        });
      }}
      style={[styles.tarjetaContainer, { backgroundColor: theme.cardDefault }]}
    >
      <View style={styles.tarjetaHeader}>
        {!esDescansa && (
          <>
            <View
              style={[
                styles.estadoBadge,
                { backgroundColor: estadoStyle.backgroundColor },
              ]}
            >
              <StyledText
                style={[styles.estadoText, { color: estadoStyle.color }]}
              >
                {estadoStyle.text}
              </StyledText>
            </View>
            <View>
              {partidoAMostrar.estado === 'en-juego' && partidoEnVivo && (
                <StyledText
                  variant='secondary'
                  style={{ fontSize: 10, marginTop: 4 }}
                >
                  {partidoEnVivo.cuartoActual
                    ? `${partidoEnVivo.cuartoActual}`
                    : ''}{' '}
                  {partidoEnVivo.minutoActual !== null
                    ? `${partidoEnVivo.minutoActual}'`
                    : ''}
                </StyledText>
              )}
            </View>
          </>
        )}
        {partidoAMostrar.fecha && (
          <StyledText variant='secondary' style={styles.fechaText}>
            <CalendarIcon color={theme.text.secondary} size={12} />{' '}
            {formatearFecha(partidoAMostrar.fecha)}
          </StyledText>
        )}
      </View>

      <View style={styles.partidoContent}>
        <View style={styles.equipoContainer}>
          {partidoAMostrar.equipoLocal.nombre.toLowerCase() === 'descansa' ||
          partidoAMostrar.equipoLocal.nombre.toLowerCase() === 'bye' ||
          partidoAMostrar.equipoLocal.nombre.toLowerCase() === '' ? (
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
              uri={partidoAMostrar.equipoLocal.escudoUrl}
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
            {partidoAMostrar.equipoLocal.nombre}
          </StyledText>
        </View>

        <View style={styles.resultadoContainer}>
          {esDescansa ? (
            <StyledText variant='secondary' style={styles.vsText}>
              DESCANSA
            </StyledText>
          ) : partidoAMostrar.estado === 'en-juego' &&
            partidoAMostrar.estadisticasEquipos?.totales ? (
            <StyledText variant='primary' style={styles.marcadorText}>
              {partidoAMostrar.estadisticasEquipos.totales.local.puntos} -{' '}
              {partidoAMostrar.estadisticasEquipos.totales.visitante.puntos}
            </StyledText>
          ) : partidoAMostrar.resultado ? (
            <StyledText variant='primary' style={styles.marcadorText}>
              {partidoAMostrar.resultado.puntosLocal} -{' '}
              {partidoAMostrar.resultado.puntosVisitante}
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
            {partidoAMostrar.equipoVisitante.nombre}
          </StyledText>
          {partidoAMostrar.equipoVisitante.nombre.toLowerCase() ===
            'descansa' ||
          partidoAMostrar.equipoVisitante.nombre.toLowerCase() === 'bye' ||
          partidoAMostrar.equipoVisitante.nombre.toLowerCase() === '' ? (
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
              uri={partidoAMostrar.equipoVisitante.escudoUrl}
              containerStyle={[
                styles.escudoImage,
                { backgroundColor: theme.background.primary },
              ]}
            />
          )}
        </View>
      </View>

      {partidoAMostrar.cancha && !esDescansa && (
        <View style={styles.canchaContainer}>
          <StyledText variant='secondary' style={styles.canchaText}>
            <LocationIcon color={theme.text.secondary} size={16} />{' '}
            {partidoAMostrar.cancha}
          </StyledText>
        </View>
      )}
    </TouchableOpacity>
  );
}

// 👇 Estilos iguales que tenías
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
