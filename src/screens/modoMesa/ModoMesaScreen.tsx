// src/screens/modoMesa/ModoMesaScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function ModoMesaScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  // Fuerza la orientación landscape (horizontal) al entrar
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.error('Error al bloquear orientación:', error);
      }
    };

    lockOrientation();

    // Cuando el componente se desmonta, libera la orientación (opcional)
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Validación de tamaño mínimo (ejemplo: 768 px)
  if (width < 768) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          La pantalla es demasiado pequeña. Usa una tablet o dispositivo más
          grande.
        </Text>
      </View>
    );
  }

  // Aquí la UI normal del modo mesa
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo Mesa</Text>
      <Text style={styles.subtitle}>
        Esta es la vista básica forzada en modo landscape.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
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
