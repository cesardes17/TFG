// app/login.tsx
import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';

import PageContainer from '../../src/components/layout/PageContainer';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useUser } from '../../src/contexts/UserContext';

export default function Login() {
  const router = useRouter();
  const { user, loadingUser } = useUser();

  useEffect(() => {
    if (loadingUser) return;
    if (user) router.replace('/');
    console.log(user, loadingUser);
  }, [loadingUser, user]);

  if (loadingUser) return null;

  return (
    <PageContainer>
      <LoginScreen />
    </PageContainer>
  );
}
