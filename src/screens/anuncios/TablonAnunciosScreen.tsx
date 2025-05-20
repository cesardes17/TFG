import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { Platform, StyleSheet, View } from 'react-native';
import StyledAlert from '../../components/common/StyledAlert';
import HeaderTablon from '../../components/anuncios/HeaderTablon';
import AnunciosList from '../../components/anuncios/AnunciosList';

export default function TablonAnunciosScreen() {
  const { theme } = useTheme();
  const { temporada, loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (loadingTemporada || loadingUser || isLoading) {
    return <LoadingIndicator text='Cargando anuncios' />;
  }

  if (!temporada) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <StyledAlert variant='error' message='No hay temporada activa' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && <HeaderTablon />}
      <AnunciosList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
