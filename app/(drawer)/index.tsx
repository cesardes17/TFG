// app/index.tsx
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
