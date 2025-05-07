import { Button, Text, View } from 'react-native';
import PageContainer from '../../components/layout/PageContainer';
import { router } from 'expo-router';

export default function LoginScreen() {
  return (
    <Button
      title='Crea una Cuenta'
      onPress={() => router.replace('/register')}
    />
  );
}
