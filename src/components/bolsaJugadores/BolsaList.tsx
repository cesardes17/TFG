import type React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import PlayerCard from './BolsaCard';
import { BolsaJugador } from '../../types/BolsaJugador';
import StyledAlert from '../common/StyledAlert';
import { useState } from 'react';
import BaseConfirmationModal from '../common/BaseConfirmationModal';

interface Jugador {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  dorsal: number;
  posicion: string;
  altura: number;
  peso: number;
  fotoUrl: string;
}

interface PlayerListProps {
  jugadores: BolsaJugador[];
  title?: string;
  usuarioActualId?: string;
  estadosSolicitudes?: Record<string, 'ninguna' | 'pendiente'>;
  onEnviarSolicitud?: (jugadorId: string) => void;
  isAdmin: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({
  jugadores,
  usuarioActualId,
  estadosSolicitudes,
  onEnviarSolicitud,
  isAdmin,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] =
    useState<Jugador | null>(null);
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
            onEnviarSolicitud={() => {
              setJugadorSeleccionado(item.jugador);
              setModalVisible(true);
            }}
            usuarioActualId={usuarioActualId}
            isAdmin={isAdmin}
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
      {jugadorSeleccionado && (
        <BaseConfirmationModal
          visible={modalVisible}
          title='Confirmar solicitud'
          description={`¿Deseas enviar una solicitud a ${jugadorSeleccionado.nombre} ${jugadorSeleccionado.apellidos}?`}
          type='create'
          onCancel={() => setModalVisible(false)}
          onConfirm={async () => {
            if (jugadorSeleccionado) {
              onEnviarSolicitud?.(jugadorSeleccionado.id);
              setModalVisible(false);
            }
          }}
        />
      )}
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
