import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useTheme } from '../../contexts/ThemeContext';

import ProgressiveImage from '../common/ProgressiveImage';
import StyledText from '../common/StyledText';
import { CalendarIcon, LocationIcon } from '../Icons';

type Equipo = {
  nombre: string;
  escudoUrl: string;
};

type Resultado = {
  puntosLocal: number;
  puntosVisitante: number;
} | null;

type Props = {
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  resultado?: Resultado;
  estado: 'pendiente' | 'en-juego' | 'finalizado';
  fecha?: Date;
  cancha?: string;
};

const HeaderPartido: React.FC<Props> = ({
  equipoLocal,
  equipoVisitante,
  resultado,
  estado,
  fecha,
  cancha,
}) => {
  const { layoutType, isDesktop } = useResponsiveLayout();
  const { theme } = useTheme();

  const formatearFecha = (fecha: Date): string => {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  };

  const getBadgeColor = () => {
    switch (estado) {
      case 'pendiente':
        return theme.background.info;
      case 'en-juego':
        return theme.background.error;
      case 'finalizado':
        return theme.text.success;
      default:
        return theme.background.warning;
    }
  };

  const getEstadoTexto = () => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en-juego':
        return 'En Juego';
      case 'finalizado':
        return 'Finalizado';
      default:
        return 'Pendiente';
    }
  };

  const styles = createStyles(layoutType, theme);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badgeContainer,
          { backgroundColor: getBadgeColor() }, // ✅ Uso correcto del color dinámico
        ]}
      >
        <StyledText style={styles.badgeText}>{getEstadoTexto()}</StyledText>
      </View>

      <View style={styles.contenidoPrincipal}>
        {/* Equipo Local */}
        <View style={styles.equipoContainer}>
          <ProgressiveImage
            uri={equipoLocal.escudoUrl}
            containerStyle={styles.escudo}
          />
          <StyledText
            style={styles.nombreEquipo}
            numberOfLines={isDesktop ? 1 : 2}
          >
            {equipoLocal.nombre}
          </StyledText>
        </View>

        {/* Resultado */}
        <View style={styles.resultadoContainer}>
          <StyledText style={styles.resultadoTexto}>
            {resultado
              ? `${resultado.puntosLocal} - ${resultado.puntosVisitante}`
              : 'VS'}
          </StyledText>

          {fecha && (
            <>
              <CalendarIcon color={theme.text.secondary} size={16} />
              <StyledText style={styles.fechaTexto}>
                {formatearFecha(fecha)}
              </StyledText>
            </>
          )}

          {cancha && (
            <>
              <LocationIcon color={theme.text.secondary} size={16} />
              <StyledText style={styles.canchaTexto}>{cancha}</StyledText>
            </>
          )}
        </View>

        {/* Equipo Visitante */}
        <View style={styles.equipoContainer}>
          <ProgressiveImage
            uri={equipoVisitante.escudoUrl}
            containerStyle={styles.escudo}
          />
          <StyledText
            style={styles.nombreEquipo}
            numberOfLines={isDesktop ? 1 : 2}
          >
            {equipoVisitante.nombre}
          </StyledText>
        </View>
      </View>
    </View>
  );
};

// 🎯 Solo diseño, no colores (los colores van con ThemeContext y getBadgeColor)
const createStyles = (
  layoutType: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop',
  theme: any
) => {
  const config = {
    mobile: { padding: 12, escudo: 50, font: 12, result: 20 },
    tablet: { padding: 16, escudo: 70, font: 14, result: 28 },
    desktop: { padding: 20, escudo: 80, font: 16, result: 32 },
    largeDesktop: { padding: 24, escudo: 90, font: 18, result: 36 },
  }[layoutType];

  return StyleSheet.create({
    container: {
      backgroundColor: theme.cardDefault,
      borderRadius: 12,
      padding: config.padding,
      margin: config.padding / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    badgeContainer: {
      alignSelf: 'center',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginBottom: 10,
    },
    badgeText: {
      color: theme.text.light,
      fontWeight: 'bold',
      fontSize: config.font,
    },
    contenidoPrincipal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    equipoContainer: {
      flex: 2,
      alignItems: 'center',
      padding: 6,
    },
    escudo: {
      width: config.escudo,
      height: config.escudo,
      marginBottom: 8,
    },
    nombreEquipo: {
      fontSize: config.font,
      color: theme.text.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    resultadoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      gap: 4,
    },
    resultadoTexto: {
      fontSize: config.result,
      fontWeight: 'bold',
      color: theme.text.primary,
    },
    fechaTexto: {
      fontSize: config.font,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    canchaTexto: {
      fontSize: config.font,
      color: theme.text.secondary,
      fontStyle: 'italic',
      textAlign: 'center',
    },
  });
};

export default HeaderPartido;
