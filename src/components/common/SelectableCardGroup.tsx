// src/components/common/SelectableCardGroup.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import SelectableCard from './SelectableCard';

/**
 * Card group that allows selecting one option of type T.
 */
export interface Option<T> {
  label: string;
  description: string;
  value: T;
}

interface SelectableCardGroupProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
}

export default function SelectableCardGroup<T>({
  options,
  value,
  onChange,
  style,
  cardStyle,
}: SelectableCardGroupProps<T>) {
  return (
    <View style={style}>
      {options.map((option) => (
        <SelectableCard
          key={String(option.value)}
          title={option.label}
          description={option.description}
          selected={option.value === value}
          onPress={() => {
            // Toggle: if already selected, deselect (you can pass a sentinel null or '' as T),
            const newValue =
              option.value === value ? (null as any as T) : option.value;
            onChange(newValue);
          }}
          containerStyle={cardStyle}
        />
      ))}
    </View>
  );
}
