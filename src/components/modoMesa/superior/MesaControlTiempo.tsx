import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import StyledButton from '../../common/StyledButton';

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
}

const MesaControlTiempo: React.FC<MesaControlTiempoProps> = ({
  cuartoActual,
  hayTiempoMuertoSolicitado,
  quintetosListos,
  partidoIniciado,
  pararCronometro,
  setPararCronometro,

  onFinCuarto,
  onFinTiempoMuerto,
  onInitTiempoMuerto,
  setCuartoIniciado,
  setPartidoIniciado,
}) => {
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const [cronometroCuartoPausado, setCronometroCuartoPausado] = useState(true);
  const [hayTiempoMuertoActivo, setHayTiempoMuertoActivo] = useState(false);
  const [tiempoCuarto, setTiempoCuarto] = useState(0);
  const [tiempoMuerto, setTiempoMuerto] = useState(10);

  const esDescanso = cuartoActual === 'DESCANSO';

  // Refs para el cronómetro principal
  const tiempoInicialRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Refs para el cronómetro de tiempo muerto
  const tiempoMuertoInicioRef = useRef<number | null>(null);

  const obtenerDuracionCuarto = (cuarto: string): number => {
    if (cuarto.startsWith('DES')) return 0.5 * 60;
    if (cuarto.startsWith('PR')) return 0.5 * 60;
    return 1 * 60;
  };

  useEffect(() => {
    if (pararCronometro) {
      setPararCronometro(false);
      toggleCronometro();
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

  // Tiempo muerto
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
        // Reanudar ➜ reiniciar el startTime
        startTimeRef.current = Date.now();
        setCuartoIniciado?.(true);

        // Si es el primer cuarto (Q1) y el partido aún no estaba iniciado, márcalo
        if (cuartoActual === 'Q1' && !partidoIniciado) {
          setPartidoIniciado(true);
        }
      } else {
        // Pausar ➜ sumar lo que pasó en esta sesión
        if (startTimeRef.current) {
          const elapsedThisSession = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          elapsedTimeRef.current += elapsedThisSession;
          startTimeRef.current = null;
        }
        setCuartoIniciado?.(false);
      }
      setHayTiempoMuertoActivo(hayTiempoMuertoSolicitado);
      return !prev;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.cuartoText, { fontSize: isTablet ? 18 : 16 }]}>
          {cuartoActual}
        </Text>
        <View
          style={[
            styles.estadoIndicador,
            cronometroCuartoPausado
              ? styles.estadoPausado
              : styles.estadoActivo,
          ]}
        />
      </View>

      <View style={styles.cronometroContainer}>
        {hayTiempoMuertoActivo ? (
          <View>
            <Text style={styles.tiempoMuertoLabel}>TIEMPO MUERTO</Text>
            <Text
              style={[
                styles.tiempoDisplay,
                styles.tiempoMuertoDisplay,
                { fontSize: isTablet ? 60 : 48 },
              ]}
            >
              {formatearTiempo(tiempoMuerto)}
            </Text>
          </View>
        ) : (
          <Text
            style={[styles.tiempoDisplay, { fontSize: isTablet ? 72 : 56 }]}
          >
            {formatearTiempo(tiempoCuarto)}
          </Text>
        )}
      </View>

      <View style={styles.controlesContainer}>
        {!hayTiempoMuertoActivo && (
          <StyledButton
            title={cronometroCuartoPausado ? 'Reanudar' : 'Pausar'}
            onPress={toggleCronometro}
            disabled={
              tiempoCuarto === 0 || (!partidoIniciado && !quintetosListos)
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#1a1a1a',
    marginRight: 8,
  },
  estadoIndicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  estadoActivo: {
    backgroundColor: '#28a745',
  },
  estadoPausado: {
    backgroundColor: '#dc3545',
  },
  cronometroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiempoDisplay: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  tiempoMuertoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  tiempoMuertoDisplay: {
    color: '#FF6B35',
  },
  controlesContainer: {
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
});

export default MesaControlTiempo;
