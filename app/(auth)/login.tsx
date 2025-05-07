// app/login.tsx
import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';

import PageContainer from '../../src/components/layout/PageContainer';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useUser } from '../../src/contexts/UserContext';

export default function Login() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (user) return router.push('/');
  }, []);

  if (loading) return null;

  return (
    <PageContainer>
      <LoginScreen />
    </PageContainer>
  );
}
