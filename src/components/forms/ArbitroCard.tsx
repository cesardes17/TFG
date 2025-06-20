// src/components/partido/ArbitroCard.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';
import { useTheme } from '../../contexts/ThemeContext';
import { CircleCheckIcon } from '../Icons';

interface Props {
  arbitro: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
  };
  selected: boolean;
  onPress: () => void;
}

export default function ArbitroCard({ arbitro, selected, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? theme.background.primary + '40'
            : theme.cardDefault,
          borderColor: selected ? theme.border.primary : theme.border.secondary,
        },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.texts}>
          <StyledText style={[styles.name, { color: theme.text.primary }]}>
            {arbitro.nombre} {arbitro.apellidos}
          </StyledText>
          <StyledText style={[styles.email, { color: theme.text.secondary }]}>
            {arbitro.correo}
          </StyledText>
        </View>
        {selected && <CircleCheckIcon size={20} color={theme.icon.primary} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  email: {
    fontSize: 12,
    opacity: 0.85,
  },
});
