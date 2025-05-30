import { router, Stack } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import { ArrowBackIcon, ArrowBackIosIcon } from '../../../src/components/Icons';
import StyledText from '../../../src/components/common/StyledText';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useUser } from '../../../src/contexts/UserContext';

export default function AuthLayout() {
  const { theme } = useTheme();
  const { user, loadingUser } = useUser();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.background.navigation,
        },
        headerTitleStyle: {
          color: theme.text.light,
        },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                gap: 5,
              }}
            >
              {Platform.OS === 'ios' ? (
                <ArrowBackIosIcon color={theme.text.light} />
              ) : (
                <ArrowBackIcon color={theme.text.light} />
              )}
              <StyledText style={{ color: theme.text.light }}>
                Volver
              </StyledText>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name='[id]' options={{ title: 'Editar Partido' }} />
    </Stack>
  );
}
