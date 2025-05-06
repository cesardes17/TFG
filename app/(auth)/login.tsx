// app/login.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Login</Text>
      <Button title='Ir a Registro' onPress={() => router.push('/register')} />
    </View>
  );
}
