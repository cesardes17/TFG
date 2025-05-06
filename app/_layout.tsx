// app/_layout.tsx
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name={Platform.OS === 'web' ? '(drawer)' : '(tabs)'}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
