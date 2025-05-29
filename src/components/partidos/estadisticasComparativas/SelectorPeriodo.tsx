import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import StyledText from '../../common/StyledText';

interface Props {
  periodos: string[];
  periodoSeleccionado: string;
  onSeleccionar: (periodo: string) => void;
}

export default function SelectorPeriodo({
  periodos,
  periodoSeleccionado,
  onSeleccionar,
}: Props) {
  const { theme, mode } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {periodos.map((periodo) => {
        const isActive = periodoSeleccionado === periodo;

        return (
          <TouchableOpacity
            key={periodo}
            style={[
              styles.button,
              {
                borderColor:
                  mode === 'dark' ? theme.text.light : theme.text.dark,
                backgroundColor: isActive
                  ? theme.icon.active
                  : theme.transparent,
              },
              isActive && {
                borderColor: theme.button.primary.border,
              },
            ]}
            onPress={() => onSeleccionar(periodo)}
          >
            <StyledText
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: isActive ? theme.text.dark : theme.text.primary,
              }}
            >
              {periodo}
            </StyledText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    maxHeight: 52,
    paddingVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 8 : 6,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
  },
});
