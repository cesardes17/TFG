// src/components/common/SelectableCard.tsx
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';
import { CircleCheckIcon } from '../Icons';

interface SelectableCardProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function SelectableCard({
  title,
  description,
  selected,
  onPress,
  containerStyle,
}: SelectableCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: selected ? theme.border.primary : theme.border.secondary,
          backgroundColor: selected
            ? theme.icon.active + '20'
            : theme.background.primary,
        },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <StyledText
            style={[styles.cardTitle, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            {title}
          </StyledText>
          <StyledText
            style={[styles.cardDesc, { color: theme.text.secondary }]}
            numberOfLines={2}
          >
            {description}
          </StyledText>
        </View>
        {selected && (
          <View style={styles.iconContainer}>
            <CircleCheckIcon size={24} color={theme.icon.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginVertical: 6,
    width: '100%', // full width of parent
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
});
