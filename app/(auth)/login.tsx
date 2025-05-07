// app/login.tsx
import React, { useState } from 'react';

import { useRouter } from 'expo-router';

import PageContainer from '../../src/components/layout/PageContainer';
import LoginScreen from '../../src/screens/auth/LoginScreen';

export default function Login() {
  const router = useRouter();

  return (
    <PageContainer>
      <LoginScreen />
    </PageContainer>
  );
}
