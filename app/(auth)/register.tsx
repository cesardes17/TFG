// app/register.tsx
import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useUser } from '../../src/contexts/UserContext';

export default function Register() {
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
      <RegisterScreen />
    </PageContainer>
  );
}
