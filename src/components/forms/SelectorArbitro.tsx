// src/components/partido/SelectorArbitro.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ArbitroCard from './ArbitroCard';
import StyledText from '../common/StyledText';

interface Props {
  arbitros: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  }[];
  selected: {
    arbitro1: any | null;
    arbitro2: any | null;
    arbitro3: any | null;
  };
  onChange: (nuevo: {
    arbitro1: any | null;
    arbitro2: any | null;
    arbitro3: any | null;
  }) => void;
}

export default function SelectorArbitro({
  arbitros,
  selected,
  onChange,
}: Props) {
  const handleSelect = (arbitro: any) => {
    const ids = [
      selected.arbitro1?.id,
      selected.arbitro2?.id,
      selected.arbitro3?.id,
    ];
    const yaSeleccionado = ids.includes(arbitro.id);

    if (yaSeleccionado) {
      const nuevo = {
        arbitro1:
          selected.arbitro1?.id === arbitro.id ? null : selected.arbitro1,
        arbitro2:
          selected.arbitro2?.id === arbitro.id ? null : selected.arbitro2,
        arbitro3:
          selected.arbitro3?.id === arbitro.id ? null : selected.arbitro3,
      };
      onChange(nuevo);
    } else {
      const slotLibre = !selected.arbitro1
        ? 'arbitro1'
        : !selected.arbitro2
        ? 'arbitro2'
        : !selected.arbitro3
        ? 'arbitro3'
        : null;
      if (slotLibre) {
        onChange({ ...selected, [slotLibre]: arbitro });
      }
    }
  };

  return (
    <View>
      <StyledText style={styles.label}>Selecciona hasta 3 árbitros</StyledText>
      <View style={styles.grid}>
        {arbitros.map((arb) => {
          const isSelected =
            selected.arbitro1?.id === arb.id ||
            selected.arbitro2?.id === arb.id ||
            selected.arbitro3?.id === arb.id;

          return (
            <ArbitroCard
              key={arb.id}
              arbitro={arb}
              selected={isSelected}
              onPress={() => handleSelect(arb)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
