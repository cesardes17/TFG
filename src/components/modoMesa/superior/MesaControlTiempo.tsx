// src/components/mesa/MesaControlTiempo.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';

interface MesaControlTiempoProps {
  cuartoActual: string;
  onFinCuarto: () => void;
  onFinTiempoMuerto: () => void;
  onInitTiempoMuerto: () => void;
  hayTiempoMuertoSolicitado: boolean;
  setCuartoIniciado: (iniciado: boolean) => void;
  quintetosListos: boolean;
  partidoIniciado: boolean;
  setPartidoIniciado: (iniciado: boolean) => void;
  setPararCronometro: (parar: boolean) => void;
  pararCronometro: boolean;
  jugadorExpulsadoPendiente: boolean;
  setCronometroActivo: (activo: boolean) => void;
}

export default function MesaControlTiempo({
  cuartoActual,
  hayTiempoMuertoSolicitado,
  quintetosListos,
  partidoIniciado,
  pararCronometro,
  jugadorExpulsadoPendiente,
  setPararCronometro,
  onFinCuarto,
  onFinTiempoMuerto,
  onInitTiempoMuerto,
  setCuartoIniciado,
  setPartidoIniciado,
  setCronometroActivo,
}: MesaControlTiempoProps) {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const [cronometroCuartoPausado, setCronometroCuartoPausado] = useState(true);
  const [hayTiempoMuertoActivo, setHayTiempoMuertoActivo] = useState(false);
  const [tiempoCuarto, setTiempoCuarto] = useState(0);
  const [tiempoMuerto, setTiempoMuerto] = useState(10);

  const esDescanso = cuartoActual === 'DESCANSO';

  const tiempoInicialRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const tiempoMuertoInicioRef = useRef<number | null>(null);

  const obtenerDuracionCuarto = (cuarto: string): number => {
    if (cuarto.startsWith('DES')) return 0.5 * 60;
    if (cuarto.startsWith('PR')) return 0.5 * 60;
    return 1 * 60;
  };

  useLayoutEffect(() => {
    if (pararCronometro) {
      setPararCronometro(false);
      setTimeout(() => {
        toggleCronometro();
      }, 0);
    }
  }, [pararCronometro]);

  useEffect(() => {
    const duracion = obtenerDuracionCuarto(cuartoActual);
    setTiempoCuarto(duracion);
    tiempoInicialRef.current = duracion;
    elapsedTimeRef.current = 0;
    startTimeRef.current = null;
    setCronometroCuartoPausado(true);
  }, [cuartoActual]);

  const tick = () => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsedSinceStart = Math.floor((now - startTimeRef.current) / 1000);
    const totalElapsed = elapsedTimeRef.current + elapsedSinceStart;
    const restante = Math.max(tiempoInicialRef.current - totalElapsed, 0);

    setTiempoCuarto(restante);

    if (restante === 0) {
      setCronometroCuartoPausado(true);
      onFinCuarto();
      return;
    }

    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!cronometroCuartoPausado && !hayTiempoMuertoActivo) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      animFrameRef.current = requestAnimationFrame(tick);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cronometroCuartoPausado, hayTiempoMuertoActivo]);

  useEffect(() => {
    if (hayTiempoMuertoActivo) {
      tiempoMuertoInicioRef.current = Date.now();
      setTiempoMuerto(10);
      onInitTiempoMuerto();

      const tmTick = () => {
        if (!tiempoMuertoInicioRef.current) return;
        const now = Date.now();
        const elapsed = Math.floor(
          (now - tiempoMuertoInicioRef.current) / 1000
        );
        const restante = Math.max(10 - elapsed, 0);
        setTiempoMuerto(restante);

        if (restante === 0) {
          setHayTiempoMuertoActivo(false);
          onFinTiempoMuerto();
          return;
        }
        animFrameRef.current = requestAnimationFrame(tmTick);
      };

      animFrameRef.current = requestAnimationFrame(tmTick);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hayTiempoMuertoActivo]);

  // 🟡 Nuevo efecto: gestiona setCuartoIniciado y setPartidoIniciado
  useEffect(() => {
    if (!cronometroCuartoPausado) {
      setCuartoIniciado?.(true);
      if (cuartoActual === 'C1' && !partidoIniciado) {
        setPartidoIniciado(true);
      }
    } else {
      setCuartoIniciado?.(false);
    }
  }, [cronometroCuartoPausado]);

  const formatearTiempo = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleCronometro = () => {
    setCronometroCuartoPausado((prev) => {
      if (prev) {
        startTimeRef.current = Date.now();
      } else {
        if (startTimeRef.current) {
          const elapsedThisSession = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          elapsedTimeRef.current += elapsedThisSession;
          startTimeRef.current = null;
        }
      }
      setHayTiempoMuertoActivo(hayTiempoMuertoSolicitado);
      setCronometroActivo(prev);
      return !prev;
    });
  };

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
            cronometroCuartoPausado
              ? { backgroundColor: '#dc3545' }
              : { backgroundColor: '#28a745' },
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
            {formatearTiempo(tiempoCuarto)}
          </StyledText>
        )}
      </View>

      <View style={styles.controlesContainer}>
        {!hayTiempoMuertoActivo && (
          <StyledButton
            title={cronometroCuartoPausado ? 'Reanudar' : 'Pausar'}
            onPress={toggleCronometro}
            disabled={
              tiempoCuarto === 0 ||
              (!partidoIniciado && !quintetosListos) ||
              jugadorExpulsadoPendiente
            }
          />
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
