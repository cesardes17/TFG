import { StyleSheet, View, Button, Platform } from 'react-native';
import { useState } from 'react';
import StyledAlert from '../../components/common/StyledAlert';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import CarruselJornadas, {
  JornadaSelectable,
} from '../../components/jornadas/CarruselJornadas';
import TarjetaPartido from '../../components/jornadas/TarjetaPartido';
import Selectable, { SelectableItem } from '../../components/common/Selectable';
import useCompeticionConJornadasYPartidos from '../../hooks/useCompeticionConJornadasYPartidos';
import StyledButton from '../../components/common/StyledButton';

export default function JornadasScreen() {
  const {
    competiciones,
    loadingCompeticiones,
    competicionSeleccionada,
    jornadas,
    loadingJornadas,
    jornadaSeleccionada,
    partidos,
    loadingPartidos,
    handleSeleccionarCompeticion,
    handleSeleccionarJornada,
  } = useCompeticionConJornadasYPartidos();

  const [showSelectable, setShowSelectable] = useState(false);

  const toggleSelectable = () => setShowSelectable(!showSelectable);

  if (loadingCompeticiones) {
    return (
      <View style={styles.container}>
        <LoadingIndicator text='Obteniendo Competiciones' />
      </View>
    );
  }
  console.log('competiciones', competiciones);
  if (!competiciones || competiciones.length === 0) {
    return (
      <View style={styles.container}>
        <StyledAlert
          variant='error'
          message='No se pudieron obtener las competiciones'
        />
      </View>
    );
  }

  const competicionesSelectable: SelectableItem[] = competiciones.map(
    (competicion) => ({
      id: competicion.id,
      nombre: competicion.nombre,
    })
  );

  const jornadasSelectable: JornadaSelectable[] = jornadas?.map((jornada) => ({
    id: jornada.id,
    label: jornada.nombre,
  }));

  return (
    <View>
      {/* Solo mostrar el botón en iOS */}
      {Platform.OS === 'ios' && (
        <View style={{ margin: 8 }}>
          <StyledButton
            title={
              showSelectable ? 'Ocultar Selector' : 'Seleccionar Competición'
            }
            onPress={toggleSelectable}
          />
        </View>
      )}

      {/* Mostrar Selectable: 
        - En iOS solo si showSelectable está activado
        - En Android/Web siempre visible
      */}
      {(Platform.OS !== 'ios' || showSelectable) && (
        <Selectable
          items={competicionesSelectable}
          onSelect={handleSeleccionarCompeticion}
          selectedId={competicionSeleccionada?.id || ''}
        />
      )}

      {loadingJornadas && <LoadingIndicator text='Obteniendo Jornadas' />}
      {!loadingJornadas && jornadas && (
        <>
          <CarruselJornadas
            jornadas={jornadasSelectable}
            onSeleccionarJornada={handleSeleccionarJornada}
            jornadaSeleccionada={jornadaSeleccionada?.id || ''}
          />
          {loadingPartidos && <LoadingIndicator text='Obteniendo Partidos' />}
          {!loadingPartidos && partidos && (
            <>
              {partidos.length > 0 ? (
                partidos.map((partido) => (
                  <TarjetaPartido key={partido.id} partido={partido} />
                ))
              ) : (
                <StyledAlert
                  message='No hay partidos para esta jornada'
                  variant='info'
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
