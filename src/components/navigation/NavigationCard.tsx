import { Pressable, StyleSheet } from 'react-native';
import { NavigationItem } from '../../constants/navigationsItems';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';

interface NavigationCardProps {
  item: NavigationItem;
  onPress: () => void;
}

export default function NavigationCard({ item, onPress }: NavigationCardProps) {
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
      <StyledText style={[styles.title, { color: theme.text.primary }]}>
        {item.title}
      </StyledText>
      <StyledText style={[styles.description, { color: theme.text.secondary }]}>
        {item.description}
      </StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});
