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

  // Inicializar el cuarto cuando llega el partido o cambia el cuarto actual
  useEffect(() => {
    if (partido) {
      inicializarCuarto(partido, cuartoActual);
      setPartidoActual(partido);
    }
  }, [partido, cuartoActual]);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
        translucent
      />
      <View style={styles.superior}>
        <MesaSuperior
          equipoLocal={partidoActual.equipoLocal}
          equipoVisitante={partidoActual.equipoVisitante}
          estadisticasCuartoActual={
            partidoActual.estadisticasEquipos?.porCuarto[cuartoActual]
          }
          cuartoActual={cuartoActual}
          onSolicitarTiempoMuerto={() => {
            // Lógica que luego añadiremos para los tiempos muertos
          }}
        />
      </View>
      {/* La parte inferior la dejamos comentada por ahora */}
      {/* <View style={styles.inferior}>
        <MesaInferior ... />
      </View> */}
    </SafeAreaView>
  );
}
