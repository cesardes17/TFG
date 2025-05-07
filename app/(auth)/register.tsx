// app/register.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';

export default function Register() {
  return (
    <PageContainer>
      <RegisterScreen />
    </PageContainer>
  );
}
