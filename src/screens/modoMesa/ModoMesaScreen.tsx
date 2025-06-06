// src/screens/modoMesa/ModoMesaScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import ModoMesaLayout from './ModoMesaLayout';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';
import { TipoCompeticion } from '../../types/Competicion';
import { useTheme } from '../../contexts/ThemeContext';

export default function ModoMesaScreen({
  idPartido,
  tipoCompeticion,
}: {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}) {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const lockOrientation = async () => {
      console.log('Forzando landscape...');
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.error('Error al bloquear orientación:', error);
      }
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Validación de tamaño mínimo (ejemplo: 768 px)
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
        <View style={{ marginTop: 20 }}>
          <StyledButton
            title='Voler a Atrás'
            onPress={async () => {
              await ScreenOrientation.unlockAsync();
              if (router.canGoBack()) {
                return router.back();
              }
              return router.push('/');
            }}
          />
        </View>
      </View>
    );
  }

  // Aquí la UI normal del modo mesa
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
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
});
