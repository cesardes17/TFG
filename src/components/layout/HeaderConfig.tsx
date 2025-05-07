import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderConfigProps {
  title: string;
  backLabel?: string;
  backRoute?: string;
  animation?:
    | 'default'
    | 'fade'
    | 'fade_from_bottom'
    | 'flip'
    | 'simple_push'
    | 'slide_from_bottom'
    | 'slide_from_right'
    | 'slide_from_left'
    | 'ios_from_right'
    | 'ios_from_left'
    | 'none';
}

export default function HeaderConfig({
  title,
  backLabel = 'Inicio',
}: HeaderConfigProps) {
  const { theme } = useTheme();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: title,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text.primary,
        },
        headerBackTitle: backLabel,
      }}
    />
  );
}
