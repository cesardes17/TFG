// app/index.tsx
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';

export default function Home() {
  const router = useRouter();
  return (
    <PageContainer>
      <Button title='Ir a Login' onPress={() => router.push('/login')} />
    </PageContainer>
  );
}
