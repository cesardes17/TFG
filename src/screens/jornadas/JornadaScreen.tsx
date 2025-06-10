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
    useState<Competicion | null>(null);

  const [showSelectable, setShowSelectable] = useState(false);

  useEffect(() => {
    if (!competiciones || !competicionesEstado) return;

    // Seleccionar la competición por prioridad:
    // 1️⃣ Si la copa está creada y no finalizada, selecciona la copa
    if (
      competicionesEstado.copa.created &&
      !competicionesEstado.copa.finalized &&
      competicionesEstado.copa.data
    ) {
      setcompeticionSeleccionada(competicionesEstado.copa.data);
      return;
    }

    // 2️⃣ Si no hay copa activa, selecciona la liga regular
    if (competicionesEstado.liga.created && competicionesEstado.liga.data) {
      // ⚠️ Si la liga está finalizada, comprobar si existen playoffs creados
      if (
        competicionesEstado.liga.finalized &&
        competicionesEstado.playoffs.created &&
        competicionesEstado.playoffs.data
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
    if (
      competicionesEstado.playoffs.created &&
      competicionesEstado.playoffs.data
    ) {
      setcompeticionSeleccionada(competicionesEstado.playoffs.data);
      return;
    }

    // 5️⃣ Si no hay ninguna activa, no selecciona nada
    setcompeticionSeleccionada(null);
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
            setcompeticionSeleccionada(competicion || null);
          }}
        />
      )}
      {competiciones?.length > 0 && competicionSeleccionada && (
        <BodyJornadas competicion={competicionSeleccionada} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
});
