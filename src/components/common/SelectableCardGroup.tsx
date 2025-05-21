// src/components/common/SelectableCardGroup.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import SelectableCard from './SelectableCard';

interface Option {
  label: string;
  description: string;
  value: string;
}

interface SelectableCardGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
}

export default function SelectableCardGroup({
  options,
  value,
  onChange,
  style,
  cardStyle,
}: SelectableCardGroupProps) {
  return (
    <View style={style}>
      {options.map((option) => (
        <SelectableCard
          key={option.value}
          title={option.label}
          description={option.description}
          selected={value === option.value}
          onPress={() => {
            // Si ya estaba seleccionado, deselecciona; si no, selecciona
            if (option.value === value) {
              onChange('');
            } else {
              onChange(option.value);
            }
          }}
          containerStyle={cardStyle}
        />
      ))}
    </View>
  );
}
