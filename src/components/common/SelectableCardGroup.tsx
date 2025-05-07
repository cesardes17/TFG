import React from 'react';
import { View } from 'react-native';
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
}

export default function SelectableCardGroup({
  options,
  value,
  onChange,
}: SelectableCardGroupProps) {
  return (
    <View>
      {options.map((option) => (
        <SelectableCard
          key={option.value}
          title={option.label}
          description={option.description}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
