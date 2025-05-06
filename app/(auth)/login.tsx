// app/login.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import { AuthService } from '../../src/services/authService';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    console.log('email: ', email);
    console.log('pass: ', pass);

    const user = await AuthService.login(email, pass);
    console.log(user);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Login</Text>

      <TextInput placeholder='email' value={email} onChangeText={setEmail} />
      <TextInput
        placeholder='password'
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      <Button title='Login' onPress={handleLogin} />
      <Button title='Ir a Registro' onPress={() => router.push('/register')} />
    </View>
  );
}
