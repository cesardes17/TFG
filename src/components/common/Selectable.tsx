// src/components/common/Selectable.tsx
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../contexts/ThemeContext';

// Tipo genérico para las opciones
export type SelectableItem = {
  id: string; // valor único
  nombre: string; // texto a mostrar
};

interface SelectableProps {
  items: SelectableItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function Selectable({
  items,
  selectedId,
  onSelect,
}: SelectableProps) {
  const { theme } = useTheme();
  // Web: usar <select>
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          style={{
            ...styles.selectWeb,
            backgroundColor: theme.background.primary,
            color: theme.text.primary,
          }}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </View>
    );
  }

  // Nativo: usar Picker
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedId}
        onValueChange={(itemValue) => onSelect(itemValue)}
        style={styles.pickerNative}
        itemStyle={{ color: theme.text.primary }}
      >
        {items.map((item) => (
          <Picker.Item key={item.id} label={item.nombre} value={item.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  selectWeb: {
    padding: 8,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    minWidth: 160,
  },
  pickerNative: {
    minWidth: 160,
  },
});
