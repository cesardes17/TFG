// app/login.tsx
import React from 'react';
import { View, Text, Button, Platform, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from '../src/components/common/ImagePicker';
import { UserService } from '../src/services/userService';
import { StorageService } from '../src/services/core/storageService';

import { AuthService } from '../src/services/core/authService';
import { jugadores } from '../src/constants/jugadores';

export default function Index() {
  // return <Script />;

  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return <Redirect href='/(drawer)/' />;
  }
  return <Redirect href='/(tabs)/' />;
}

function Script() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');
  const iniciarScriptDeCreacion = async () => {
    console.log('Iniciando creación de jugadores...');
    setIsLoading(true);
    for (const jugador of jugadores) {
      try {
        // 1. Crear en Auth
        setLoadingText(`Creando usuario ${jugador.correo}...`);
        const res = await AuthService.register(
          jugador.correo,
          jugador.contraseña
        );

        if (!res.success || !res.data) {
          console.error(`❌ Error al registrar a ${jugador.correo}`);
          continue;
        }

        const uid = res.data.uid;
        console.log(`✅ Usuario creado en Auth: ${jugador.correo}`);

        // 2. Subir foto
        setLoadingText(`Subiendo imagen para ${jugador.correo}...`);
        const upload = await StorageService.uploadFile(
          'fotos_jugadores',
          jugador.fotoUrl
        );

        if (!upload.success || !upload.data) {
          console.error(`❌ Error al subir imagen para ${jugador.correo}`);
          continue;
        }

        console.log(`✅ Imagen subida para ${jugador.correo}`);

        // 3. Crear en Firestore
        setLoadingText(
          `Creando usuario en Firestore para ${jugador.correo}...`
        );
        const resUser = await UserService.createUser(uid, {
          correo: jugador.correo,
          nombre: jugador.nombre,
          apellidos: jugador.apellidos,
          rol: jugador.rol,
          altura: jugador.altura,
          peso: jugador.peso,
          dorsal: jugador.dorsal,
          posicion: jugador.posicion,
          fotoUrl: upload.data.url,
          fotoPath: upload.data.fileName,
          sancionado: jugador.sancionado,
        });
        if (!resUser.success) {
          console.error(
            `❌ Error al crear usuario en Firestore para ${jugador.correo}`
          );
          continue;
        }
        console.log(`✅ Usuario completado: ${jugador.correo}`);
      } catch (err) {
        console.error(`❌ Error inesperado con ${jugador.correo}`, err);
      }
    }
    console.log('🎉 Script finalizado');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>{loadingText}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        title='Iniciar Script'
        onPress={() => {
          console.log('Iniciando script');
          iniciarScriptDeCreacion();
        }}
      ></Button>
    </SafeAreaView>
  );
}
