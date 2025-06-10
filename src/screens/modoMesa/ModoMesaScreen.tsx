// src/screens/modoMesa/ModoMesaScreen.tsx
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import ModoMesaLayout from './ModoMesaLayout';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';
import { TipoCompeticion } from '../../types/Competicion';
import { useTheme } from '../../contexts/ThemeContext';

interface ModoMesaScreenProps {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}

export default function ModoMesaScreen({
  idPartido,
  tipoCompeticion,
}: ModoMesaScreenProps) {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const { theme } = useTheme();

  // Bloquear/desbloquear orientación al enfocar/desenfocar pantalla
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      ).catch((error) => console.error('Error locking orientation:', error));

      return () => {
        ScreenOrientation.unlockAsync().catch((error) =>
          console.error('Error unlocking orientation:', error)
        );
      };
    }, [])
  );

  // Validación de altura mínima para la UI de mesa
  if (height < 768) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background.primary },
        ]}
      >
        <StyledText variant='error' style={styles.errorText}>
          La pantalla es demasiado pequeña. Usa una tablet o dispositivo más
          grande.
        </StyledText>
        <View style={styles.buttonWrapper}>
          <StyledButton
            title='Volver atrás'
            onPress={async () => {
              try {
                await ScreenOrientation.unlockAsync();
              } catch (error) {
                console.error('Error unlocking orientation on back:', error);
              }
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/');
              }
            }}
          />
        </View>
      </View>
    );
  }

  // UI principal de Modo Mesa
  return (
    <ModoMesaLayout idPartido={idPartido} tipoCompeticion={tipoCompeticion} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
