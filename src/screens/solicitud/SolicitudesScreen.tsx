import { ActivityIndicator, StyleSheet, View } from 'react-native';
import StyledText from '../../components/common/StyledText';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BaseSolicitudService } from '../../services/solicitudesService/baseSolicitud';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import StyledAlert from '../../components/common/StyledAlert';
import { Solicitud } from '../../types/Solicitud';
import SolicitudCard from '../../components/solicitudes/SolicitudCard';
import { FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import StyledButton from '../../components/common/StyledButton';

export default function SolicitudesScreen() {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!temporada) return;
    const fetchSolicitudes = async () => {
      setIsLoading(true);
      try {
        const res = await BaseSolicitudService.getSolicitudes(temporada.id);
        if (!res.success || !res.data) {
          throw new Error(res.errorMessage);
        }
        setSolicitudes(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={theme.text.primary} />
      </View>
    );
  }

  if (!temporada) {
    <View style={styles.container}>
      <StyledAlert
        variant='warning'
        message='No hay ninguna temporada activa. Espera a que los organizadores activen la temporada nueva'
      />
    </View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <StyledButton
        title='Nueva solicitud'
        variant='outline'
        onPress={() => router.push('/nuevaSolicitud')}
      />

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SolicitudCard solicitud={item} />}
        ListEmptyComponent={() => (
          <View style={styles.container}>
            <StyledAlert variant='info' message='No hay solicitudes' />
          </View>
        )}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
