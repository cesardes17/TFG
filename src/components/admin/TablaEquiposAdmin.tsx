import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CircleCheckIcon, RefreshIcon, WarningIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import ProgressiveImage from '../common/ProgressiveImage';
import StyledText from '../common/StyledText';
import LoadingIndicator from '../common/LoadingIndicator';
import { router } from 'expo-router';
import EstadoEquiposResumen from './EstadoEquiposResumen';
import { useEquiposConEstado } from '../../hooks/useEquiposConEstado';

const MINIMUM_PLAYERS = 8;

export default function TablaAdminEquipos() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const {
    equipos,
    equiposIncompletos,
    loading: isLoading,
    error,
    refetch,
  } = useEquiposConEstado();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const renderItem = ({ item }: { item: (typeof equipos)[0] }) => {
    const cumple = item.jugadores >= MINIMUM_PLAYERS;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.row, { borderColor: theme.table.rowBorder }]}
        onPress={() =>
          router.push({
            pathname: '/equipo/[id]',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.imageContainer}>
          <ProgressiveImage
            uri={item.escudoUrl}
            containerStyle={styles.image}
          />
        </View>
        <Text style={[styles.nombre, { color: theme.table.rowText }]}>
          {item.nombre}
        </Text>
        <Text
          style={[
            styles.jugadores,
            { color: cumple ? theme.text.success : theme.text.error },
          ]}
        >
          {item.jugadores}
        </Text>
        <View style={styles.estado}>
          {cumple ? (
            <CircleCheckIcon size={20} color={theme.text.success} />
          ) : (
            <WarningIcon size={20} color={theme.text.error} />
          )}
          <Text
            style={{
              color: cumple ? theme.text.success : theme.text.error,
              marginLeft: 6,
            }}
          >
            {cumple ? 'Completo' : 'Incompleto'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardDefault }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 4, justifyContent: 'center' }}>
          <StyledText style={[styles.title, { color: theme.text.primary }]}>
            Administración de Equipos
          </StyledText>
        </View>
        <TouchableOpacity
          style={{ alignItems: 'center', flex: 1 }}
          onPress={refetch}
        >
          <RefreshIcon color={theme.text.primary} size={24} />
          <StyledText size='small'>Actualizar</StyledText>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.header,
          {
            borderColor: theme.table.rowBorder,
            backgroundColor: theme.table.headerBackground,
          },
        ]}
      >
        <Text
          style={[styles.colHeader, { flex: 1, color: theme.table.headerText }]}
        >
          Escudo
        </Text>
        <Text
          style={[styles.colHeader, { flex: 3, color: theme.table.headerText }]}
        >
          Nombre
        </Text>
        <Text
          style={[styles.colHeader, { flex: 1, color: theme.table.headerText }]}
        >
          Jugadores
        </Text>
        <Text
          style={[styles.colHeader, { flex: 2, color: theme.table.headerText }]}
        >
          Estado
        </Text>
      </View>

      {isLoading ? (
        <LoadingIndicator text='Obteniendo información...' />
      ) : (
        equipos.map((item) => renderItem({ item }))
      )}

      {!isLoading && (
        <EstadoEquiposResumen
          equiposIncompletos={equiposIncompletos}
          equiposTotales={equipos}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
    padding: 12,
  },
  colHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nombre: {
    flex: 3,
    fontSize: 16,
    textAlign: 'center',
  },
  jugadores: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  estado: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
