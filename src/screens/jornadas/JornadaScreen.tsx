import { View, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Selectable, { SelectableItem } from '../../components/common/Selectable';
import StyledButton from '../../components/common/StyledButton';
import { useCompeticiones } from '../../hooks/useCompeticiones';
import BodyJornadas from '../../components/jornadas/BodyJornadas';
import { Competicion } from '../../types/Competicion';
import StyledAlert from '../../components/common/StyledAlert';

export default function JornadasScreen() {
  const { competiciones, competicionesEstado, error, loadingCompeticiones } =
    useCompeticiones();
  const [competicionSeleccionada, setcompeticionSeleccionada] =
    useState<Competicion>();

  const [showSelectable, setShowSelectable] = useState(false);

  useEffect(() => {
    if (!competiciones || !competicionesEstado) return;

    // Seleccionar la competición por prioridad:
    // 1️⃣ Si la copa está creada y no finalizada, selecciona la copa
    if (
      competicionesEstado.copa.created &&
      !competicionesEstado.copa.finalized
    ) {
      setcompeticionSeleccionada(competicionesEstado.copa.data);
      return;
    }

    // 2️⃣ Si no hay copa activa, selecciona la liga regular
    if (competicionesEstado.liga.created) {
      // ⚠️ Si la liga está finalizada, comprobar si existen playoffs creados
      if (
        competicionesEstado.liga.finalized &&
        competicionesEstado.playoffs.created
      ) {
        // 3️⃣ Liga finalizada y hay playoffs → selecciona playoffs
        setcompeticionSeleccionada(competicionesEstado.playoffs.data);
        return;
      }
      // Liga no finalizada o no hay playoffs → selecciona liga
      setcompeticionSeleccionada(competicionesEstado.liga.data);
      return;
    }

    // 4️⃣ Si no hay liga creada pero hay playoffs creados, selecciona playoffs
    if (competicionesEstado.playoffs.created) {
      setcompeticionSeleccionada(competicionesEstado.playoffs.data);
      return;
    }

    // 5️⃣ Si no hay ninguna activa, no selecciona nada
    setcompeticionSeleccionada(undefined);
  }, [competiciones, competicionesEstado]);
  if (loadingCompeticiones) {
    return <LoadingIndicator />;
  }

  if (!competicionSeleccionada) {
    return (
      <StyledAlert
        variant='error'
        message='No se hay ninguna competición activa'
      />
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <StyledButton
          title='Seleccionar Competición'
          onPress={() => {
            setShowSelectable((prev) => {
              return !prev;
            });
          }}
        />
      )}

      {(Platform.OS !== 'ios' || showSelectable) && (
        <Selectable
          items={competiciones}
          selectedId={competicionSeleccionada?.id || ''}
          onSelect={(id) => {
            const competicion = competiciones.find(
              (competicion) => competicion.id === id
            );
            setcompeticionSeleccionada(competicion);
          }}
        />
      )}

      <BodyJornadas competicion={competicionSeleccionada} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
});
