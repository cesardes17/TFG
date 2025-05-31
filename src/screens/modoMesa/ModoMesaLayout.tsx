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

  // Estado local para manipular el partido durante el modo mesa
  const [partidoActual, setPartidoActual] = useState<typeof partido | null>(
    null
  );

  // Estado para controlar el cuarto actual
  const [cuartoActual, setCuartoActual] = useState('Q1');
  const [tiempoMuertoSolicitado, setTiempoMuertoSolicitado] = useState<{
    local: boolean;
    visitante: boolean;
  }>({ local: false, visitante: false });

  // Inicializar el cuarto cuando llega el partido o cambia el cuarto actual
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
      setTiempoMuertoSolicitado({ local: false, visitante: false }); // Reinicia el estado de tiempo muerto al cambiar de cuarto
    }
  }, [cuartoActual]);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    superior: {
      flex: 1,
    },
    inferior: {
      flex: 2,
    },
  });

  const handleSolicitarTiempoMuerto = (equipo: 'local' | 'visitante') => {
    setPartidoActual((prev) => {
      if (!prev || !prev.estadisticasEquipos) return prev;
      console.log('handleSolicitarTiempoMuerto', equipo);
      const cuartoStats = prev.estadisticasEquipos.porCuarto[cuartoActual];
      if (!cuartoStats) return prev; // Asegura que existe el cuarto actual

      const actualizado = { ...prev };
      if (!actualizado.estadisticasEquipos) {
        return prev;
      }

      if (equipo === 'local') {
        if (tiempoMuertoSolicitado.local) {
          actualizado.estadisticasEquipos.porCuarto[cuartoActual].local = {
            ...cuartoStats.local,
            tiemposMuertos: cuartoStats.local.tiemposMuertos - 1,
          };
          setTiempoMuertoSolicitado({
            local: false,
            visitante: false,
          });
        } else {
          actualizado.estadisticasEquipos.porCuarto[cuartoActual].local = {
            ...cuartoStats.local,
            tiemposMuertos: cuartoStats.local.tiemposMuertos + 1,
          };
          setTiempoMuertoSolicitado({
            local: true,
            visitante: false,
          });
        }
      } else {
        if (tiempoMuertoSolicitado.visitante) {
          actualizado.estadisticasEquipos.porCuarto[cuartoActual].visitante = {
            ...cuartoStats.visitante,
            tiemposMuertos: cuartoStats.visitante.tiemposMuertos - 1,
          };
          setTiempoMuertoSolicitado({
            local: false,
            visitante: false,
          });
        } else {
          actualizado.estadisticasEquipos.porCuarto[cuartoActual].visitante = {
            ...cuartoStats.visitante,
            tiemposMuertos: cuartoStats.visitante.tiemposMuertos + 1,
          };
          setTiempoMuertoSolicitado({
            local: false,
            visitante: true,
          });
        }
      }
      return actualizado;
    });
  };

  const handleFinCuarto = () => {
    if (
      partidoActual.estadisticasEquipos!.totales.local.puntos ===
      partidoActual.estadisticasEquipos!.totales.visitante.puntos
    ) {
      setCuartoActual((prevCuarto) => {
        // Si es Q1 pasa a Q2, Q2 a DESCANSO,DESCANSO a Q3, Q3 a Q4
        if (prevCuarto === 'Q1') return 'Q2';
        if (prevCuarto === 'Q2') return 'DESCANSO';
        if (prevCuarto === 'DESCANSO') return 'Q3';
        if (prevCuarto === 'Q3') return 'Q4';

        // Si es Q4, decide si hay empate y debe haber prórroga

        // (Idealmente aquí podrías hacer una comprobación de empate)
        if (prevCuarto === 'Q4') return 'PR1';

        // Si es una prórroga, por ejemplo PR1, PR2, etc.
        if (prevCuarto.startsWith('PR')) {
          const numeroProrroga =
            parseInt(prevCuarto.replace('PR', ''), 10) || 1;
          return `PR${numeroProrroga + 1}`;
        }

        // Si no se reconoce el cuarto, queda en Q1 por defecto
        return 'Q1';
      });
    }

    console.log('Fin de cuarto detectado. Avanzando al siguiente cuarto.');
  };

  if (!partidoActual.estadisticasEquipos) return;

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
            setTiempoMuertoSolicitado({ local: false, visitante: false });
          }}
          tiempoMuertoSolicitado={tiempoMuertoSolicitado}
        />
      </View>
      {/* La parte inferior la dejamos comentada por ahora */}
      <View style={styles.inferior}>
        <MesaInferior />
      </View>
    </SafeAreaView>
  );
}
