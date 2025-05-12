import type React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import PlayerCard from './BolsaCard';
import { BolsaJugador } from '../../types/BolsaJugador';
import StyledAlert from '../common/StyledAlert';

interface Jugador {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  dorsal: number;
  posicion: string;
  altura: number;
  peso: number;
  photoURL: string;
}

interface PlayerListProps {
  jugadores: BolsaJugador[];
  title?: string;
  usuarioActualId?: string;
  estadosSolicitudes?: Record<string, 'ninguna' | 'pendiente'>;
  onEnviarSolicitud?: (jugadorId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  jugadores,
  usuarioActualId,
  estadosSolicitudes,
  onEnviarSolicitud,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginTop: 10 }}
        data={jugadores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlayerCard
            jugador={item.jugador}
            solicitudEnviada={
              estadosSolicitudes?.[item.jugador.id] === 'pendiente'
            }
            onEnviarSolicitud={() => onEnviarSolicitud?.(item.jugador.id)}
            usuarioActualId={usuarioActualId}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => {
          return (
            <StyledAlert message='No hay jugadores inscritos' variant='info' />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default PlayerList;
