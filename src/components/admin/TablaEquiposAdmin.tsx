import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CircleCheckIcon, RefreshIcon, WarningIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { equipoService } from '../../services/equipoService';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useToast } from '../../contexts/ToastContext';
import { inscripcionesService } from '../../services/inscripcionesService';
import ProgressiveImage from '../common/ProgressiveImage';
import StyledText from '../common/StyledText';
import LoadingIndicator from '../common/LoadingIndicator';
import { router } from 'expo-router';
import EstadoEquiposResumen from './EstadoEquiposResumen';

interface Equipo {
  id: string;
  nombre: string;
  escudoUrl: string;
  jugadores: number;
}

const MINIMUM_PLAYERS = 8;

export default function TablaAdminEquipos() {
  const { theme } = useTheme();
  const { temporada } = useTemporadaContext();
  const { showToast } = useToast();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equiposIncompletos, setEquiposIncompletos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const fetchEquipos = async () => {
    if (!temporada) return;
    setIsLoading(true);
    try {
      const resEquipos = await equipoService.getEquipos(temporada.id);
      if (!resEquipos.success || !resEquipos.data) {
        throw new Error(resEquipos.errorMessage);
      }
      const equiposData = resEquipos.data;
      const equiposConJugadores = await Promise.all(
        equiposData.map(async (equipo) => {
          const resJugadores =
            await inscripcionesService.getInscripcionesByTeam(
              temporada.id,
              equipo.id
            );
          if (!resJugadores.success || !resJugadores.data) {
            throw new Error(resJugadores.errorMessage);
          }
          const jugadores = resJugadores.data.length;
          return {
            id: equipo.id,
            nombre: equipo.nombre,
            escudoUrl: equipo.escudoUrl,
            jugadores,
          };
        })
      );
      setEquipos(equiposConJugadores);
      const eIncompletos = equiposConJugadores.filter(
        (equipo) => equipo.jugadores < MINIMUM_PLAYERS
      );
      setEquiposIncompletos(eIncompletos.length);
    } catch (error) {
      console.error(error);
      showToast('Error al cargar los equipos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const renderItem = ({ item }: { item: Equipo }) => {
    const cumple = item.jugadores >= MINIMUM_PLAYERS;

    return (
      <TouchableOpacity
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
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 4 }}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Administración de Equipos
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Se requiere un mínimo de {MINIMUM_PLAYERS} jugadores por equipo.
          </Text>
        </View>
        {!isLoading && (
          <EstadoEquiposResumen
            equiposIncompletos={equiposIncompletos}
            equiposTotales={equipos.length}
          />
        )}
        <TouchableOpacity
          style={{ padding: 12, alignItems: 'center', flex: 1 }}
          onPress={() => fetchEquipos()}
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
          style={[
            styles.colHeader,
            {
              flex: 3,
              color: theme.table.headerText,
            },
          ]}
        >
          Nombre
        </Text>
        <Text
          style={[
            styles.colHeader,
            {
              flex: 1,
              color: theme.table.headerText,
            },
          ]}
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
        <FlatList
          data={equipos}
          keyExtractor={(item) => item.nombre}
          renderItem={renderItem}
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
    maxHeight: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
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
    fontSize: 14,
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
