// app/index.tsx
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import PageContainer from '../../src/components/layout/PageContainer';
import IndexScreen from '../../src/screens/IndexScreen';

export default function Home() {
  const router = useRouter();
  return (
    <PageContainer>
      <IndexScreen />
    </PageContainer>
  );
}
