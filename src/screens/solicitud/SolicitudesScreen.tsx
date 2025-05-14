// src/screens/solicitud/SolicitudesScreen.tsx:

import { useState } from 'react';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { ActivityIndicator, StyleSheet } from 'react-native';
import StyledAlert from '../../components/common/StyledAlert';
import SolicitudesList from '../../components/solicitudes/SolicitudesList';
import { View } from 'react-native';
import HeaderListSolicitudes from '../../components/solicitudes/HeaderListSolicitudes';

export default function SolicitudesScreen() {
  const { theme } = useTheme();
  const { temporada, loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (loadingTemporada || loadingUser || isLoading) {
    return <ActivityIndicator size='large' color={theme.text.primary} />;
  }

  if (!user || !temporada) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <StyledAlert variant='error' message='No hay temporada activa' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderListSolicitudes />
      <SolicitudesList screenLoading={setIsLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
