// MesaLayout.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { TipoCompeticion } from '../../types/Competicion';
import usePartido from '../../hooks/usePartido';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import StyledAlert from '../../components/common/StyledAlert';
import { useTheme } from '../../contexts/ThemeContext';
import MesaSuperior from '../../components/modoMesa/superior/MesaSuperior';
import { inicializarCuarto } from '../../utils/modoMesa/inicializarCuarto';
import MesaInferior from '../../components/modoMesa/inferior/MesaInferior';

interface Props {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}

export default function MesaLayout({ idPartido, tipoCompeticion }: Props) {
  const { theme, mode } = useTheme();
  const { partido, isLoading, error } = usePartido(idPartido, tipoCompeticion);

  const [partidoActual, setPartidoActual] = useState<typeof partido | null>(
    null
  );
  const [cuartoActual, setCuartoActual] = useState('Q1');
  const [tiemposMuertosUsados, setTiemposMuertosUsados] = useState({
    local: { primeraMitad: false, segundaMitad: false, prorroga: false },
    visitante: { primeraMitad: false, segundaMitad: false, prorroga: false },
  });
  const [equipoSolicitandoTM, setEquipoSolicitandoTM] = useState<
    'local' | 'visitante' | null
  >(null);

  useEffect(() => {
    if (partido) {
      const partidoInicializado = inicializarCuarto(partido, cuartoActual);
      setPartidoActual(partidoInicializado);
    }
  }, [partido]);

  useEffect(() => {
    if (partidoActual) {
      const partidoActualizado = inicializarCuarto(partidoActual, cuartoActual);
      setPartidoActual(partidoActualizado);
      setEquipoSolicitandoTM(null);
    }
  }, [cuartoActual]);

  const obtenerMitadActual = (cuarto: string) => {
    if (cuarto === 'Q1' || cuarto === 'Q2') return 'primeraMitad';
    if (cuarto === 'Q3' || cuarto === 'Q4') return 'segundaMitad';
    return 'prorroga';
  };

  const puedeSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    const mitad = obtenerMitadActual(cuartoActual);
    return !tiemposMuertosUsados[equipo][mitad];
  };

  const handleSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    const mitad = obtenerMitadActual(cuartoActual);

    // Si ya está solicitado por este equipo, se cancela (no se marca como usado aún)
    if (equipoSolicitandoTM === equipo) {
      setEquipoSolicitandoTM(null); // lo cancela
      console.log(`Tiempo muerto cancelado por ${equipo} en la ${mitad}.`);
      return;
    }

    // Si no está solicitado, pero ya lo usó antes => no se puede volver a pedir
    if (tiemposMuertosUsados[equipo][mitad]) {
      console.log(
        `El equipo ${equipo} ya usó su tiempo muerto en la ${mitad}.`
      );
      return;
    }

    // Solicitar nuevo tiempo muerto
    setEquipoSolicitandoTM(equipo);
    console.log(`Tiempo muerto solicitado por ${equipo} en la ${mitad}.`);
  };
  const handleFinCuarto = () => {
    setCuartoActual((prevCuarto) => {
      if (prevCuarto === 'Q1') return 'Q2';
      if (prevCuarto === 'Q2') return 'DESCANSO';
      if (prevCuarto === 'DESCANSO') return 'Q3';
      if (prevCuarto === 'Q3') return 'Q4';
      if (prevCuarto === 'Q4') return 'PR1';
      if (prevCuarto.startsWith('PR')) {
        const num = parseInt(prevCuarto.replace('PR', ''), 10) || 1;
        return `PR${num + 1}`;
      }
      return 'Q1';
    });
  };

  if (isLoading) {
    return <LoadingIndicator text='Cargando partido...' />;
  }

  if (error || !partidoActual) {
    return (
      <StyledAlert
        variant='error'
        message='Error al cargar el partido o datos no disponibles'
      />
    );
  }

  if (!partidoActual.estadisticasEquipos) return;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    superior: { flex: 1 },
    inferior: { flex: 2 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
        translucent
      />
      <View style={styles.superior}>
        <MesaSuperior
          puntos={{
            local: partidoActual.estadisticasEquipos.totales.local.puntos,
            visitante:
              partidoActual.estadisticasEquipos.totales.visitante.puntos,
          }}
          equipoLocal={partidoActual.equipoLocal}
          equipoVisitante={partidoActual.equipoVisitante}
          estadisticasCuartoActual={
            partidoActual.estadisticasEquipos.porCuarto[cuartoActual]
          }
          cuartoActual={cuartoActual}
          onSolicitarTiempoMuerto={handleSolicitarTiempoMuerto}
          onFinCuarto={handleFinCuarto}
          onFinTiempoMuerto={() => {
            setTiemposMuertosUsados((prev) => ({
              ...prev,
              [equipoSolicitandoTM!]: {
                ...prev[equipoSolicitandoTM!],
                [obtenerMitadActual(cuartoActual)]: true,
              },
            }));
            setEquipoSolicitandoTM(null);
          }}
          tiempoMuertoSolicitado={
            equipoSolicitandoTM
              ? {
                  local: equipoSolicitandoTM === 'local',
                  visitante: equipoSolicitandoTM === 'visitante',
                }
              : { local: false, visitante: false }
          }
          puedeSolicitarTiempoMuerto={puedeSolicitarTiempoMuerto}
        />
      </View>
      <View style={styles.inferior}>
        <MesaInferior />
      </View>
    </SafeAreaView>
  );
}
