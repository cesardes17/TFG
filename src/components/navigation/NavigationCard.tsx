// src/components/navigation/NavigationCard.tsx
import { Pressable, StyleSheet, View } from 'react-native';
import { NavigationItem } from '../../constants/navigationsItems';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';

interface NavigationCardProps {
  item: NavigationItem;
  onPress: () => void;
  badgeCount?: number;
}

export default function NavigationCard({
  item,
  onPress,
  badgeCount = 0,
}: NavigationCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.background.primary,
          borderColor: theme.border.primary,
        },
      ]}
    >
      <View>
        <StyledText style={[styles.title, { color: theme.text.primary }]}>
          {item.title}
        </StyledText>

        <StyledText
          style={[styles.description, { color: theme.text.secondary }]}
        >
          {item.description}
        </StyledText>
      </View>
      {badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <StyledText style={styles.badgeText}>{badgeCount}</StyledText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeContainer: {
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});
