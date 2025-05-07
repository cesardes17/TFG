import React from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';
import { CircleCheckIcon } from '../Icons';

interface SelectableCardProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectableCard({
  title,
  description,
  selected,
  onPress,
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
            : theme.backgroundPrimary,
        },
      ]}
      onPress={onPress}
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
            <CircleCheckIcon size={24} color={theme.icon.active} />
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
    width: Dimensions.get('window').width - 32,
    alignSelf: 'center',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
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
