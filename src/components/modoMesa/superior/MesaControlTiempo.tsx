// src/components/mesa/MesaControlTiempo.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';

interface MesaControlTiempoProps {
  tiempoActualCuarto: number;
  cuartoActual: string;
  onFinCuarto: () => void;
  onFinTiempoMuerto: () => void;
  onInitTiempoMuerto: () => void;
  hayTiempoMuertoActivo: boolean; // 🟢 NUEVO: viene de fuera
  setCuartoIniciado: (iniciado: boolean) => void;
  quintetosListos: boolean;
  partidoIniciado: boolean;
  setPartidoIniciado: (iniciado: boolean) => void;
  jugadorExpulsadoPendiente: boolean;
  setCronometroActivo: (activo: boolean) => void;
  cronometroActivo: boolean;
  iniciarCronometro: (tiempoInicial: number) => void;
  pausarCronometro: () => void;
}

export default function MesaControlTiempo({
  tiempoActualCuarto,
  cuartoActual,
  hayTiempoMuertoActivo, // 🟢 Prop inyectada
  quintetosListos,
  partidoIniciado,
  jugadorExpulsadoPendiente,
  cronometroActivo,
  onFinCuarto,
  onFinTiempoMuerto,
  onInitTiempoMuerto,
  setCuartoIniciado,
  setPartidoIniciado,
  setCronometroActivo,
  iniciarCronometro,
  pausarCronometro,
}: MesaControlTiempoProps) {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const [tiempoMuerto, setTiempoMuerto] = useState(10);
  const esDescanso = cuartoActual === 'DESCANSO';

  useEffect(() => {
    if (cronometroActivo) {
      setCuartoIniciado(true);
      if (cuartoActual === 'C1' && !partidoIniciado) {
        setPartidoIniciado(true);
      }
    } else {
      setCuartoIniciado(false);
    }
  }, [cronometroActivo]);

  const formatearTiempo = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const handleReanudar = () => {
    iniciarCronometro(tiempoActualCuarto);
    setCronometroActivo(true);
  };

  const handlePausar = () => {
    pausarCronometro();
    setCronometroActivo(false);
  };

  // 🔥 Lógica del tiempo muerto (controlada por prop externa)
  useEffect(() => {
    let animFrameRef: number | null = null;

    if (hayTiempoMuertoActivo) {
      const inicio = Date.now();
      setTiempoMuerto(10);
      onInitTiempoMuerto();

      const tmTick = () => {
        const elapsed = Math.floor((Date.now() - inicio) / 1000);
        const restante = Math.max(10 - elapsed, 0);
        setTiempoMuerto(restante);

        if (restante === 0) {
          onFinTiempoMuerto();
          return;
        }
        animFrameRef = requestAnimationFrame(tmTick);
      };

      animFrameRef = requestAnimationFrame(tmTick);
    }

    return () => {
      if (animFrameRef) {
        cancelAnimationFrame(animFrameRef);
      }
    };
  }, [hayTiempoMuertoActivo]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardDefault,
          borderColor: theme.border.secondary,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.header}>
        <StyledText
          variant='primary'
          size={isTablet ? 18 : 16}
          style={styles.cuartoText}
        >
          {cuartoActual}
        </StyledText>
        <View
          style={[
            styles.estadoIndicador,
            cronometroActivo
              ? { backgroundColor: '#28a745' }
              : { backgroundColor: '#dc3545' },
          ]}
        />
      </View>

      <View style={styles.cronometroContainer}>
        {hayTiempoMuertoActivo ? (
          <View>
            <StyledText
              variant='error'
              size={16}
              style={styles.tiempoMuertoLabel}
            >
              TIEMPO MUERTO
            </StyledText>
            <StyledText
              variant='error'
              size={isTablet ? 60 : 48}
              style={[styles.tiempoDisplay, styles.tiempoMuertoDisplay]}
            >
              {formatearTiempo(tiempoMuerto)}
            </StyledText>
          </View>
        ) : (
          <StyledText
            variant='primary'
            size={isTablet ? 72 : 56}
            style={styles.tiempoDisplay}
          >
            {formatearTiempo(tiempoActualCuarto)}
          </StyledText>
        )}
      </View>

      <View style={styles.controlesContainer}>
        {!hayTiempoMuertoActivo && (
          <>
            {cronometroActivo ? (
              <StyledButton title='Pausar' onPress={handlePausar} />
            ) : (
              <StyledButton
                title='Reanudar'
                onPress={handleReanudar}
                disabled={
                  tiempoActualCuarto === 0 ||
                  !quintetosListos ||
                  jugadorExpulsadoPendiente
                }
              />
            )}
          </>
        )}
        {esDescanso && (
          <StyledButton
            variant='outline'
            onPress={onFinCuarto}
            title='Finalizar Descanso'
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cuartoText: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  estadoIndicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cronometroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiempoDisplay: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  tiempoMuertoLabel: {
    marginBottom: 8,
  },
  tiempoMuertoDisplay: {},
  controlesContainer: {
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
});
