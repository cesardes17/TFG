// app/login.tsx
import React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

export default function Login() {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return <Redirect href='/(drawer)/' />;
  }
  return <Redirect href='/(tabs)/' />;
}
