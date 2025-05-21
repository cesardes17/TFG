import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { UserAvatar } from './UserAvatar';
import { PlayerProfile, User } from '../../types/User';
import ProgressiveImage from '../common/ProgressiveImage';
import StyledAlert from '../common/StyledAlert';

// Props del componente
interface UserListProps {
  usuarios: User[];
  onToggleSancion: (id: string) => void;
  onChangeRol: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  usuarios,
  onToggleSancion,
  onChangeRol,
}) => {
  // Función para determinar si el usuario `es jugador o capitán
  const isPlayerOrCaptain = (rol: string) =>
    rol === 'jugador' || rol === 'capitán';

  // Renderizar cada elemento de la lista
  const renderItem = ({ item }: { item: User }) => {
    const isPlayer = isPlayerOrCaptain(item.role);

    return (
      <View style={styles.card}>
        <View style={styles.userInfoContainer}>
          {isPlayer ? (
            // Avatar para jugador o capitán
            <ProgressiveImage
              uri={(item as PlayerProfile).photoURL || ''}
              containerStyle={styles.playerPhoto}
            />
          ) : (
            // Avatar genérico para otros roles
            <UserAvatar style={styles.genericAvatar} />
          )}

          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {item.nombre} {item.apellidos}
            </Text>
            <Text style={styles.userRole}>{item.role}</Text>

            <Text style={styles.userEmail}>{item.correo}</Text>

            {(item as PlayerProfile).sancionado && (
              <View style={styles.sanctionBadge}>
                <Text style={styles.sanctionText}>Sancionado</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {isPlayer && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                (item as PlayerProfile).sancionado
                  ? styles.liftSanctionButton
                  : styles.sanctionButton,
              ]}
              onPress={() => onToggleSancion(item.uid)}
            >
              <Text style={styles.buttonText}>
                {(item as PlayerProfile).sancionado
                  ? 'Levantar sanción'
                  : 'Sancionar'}
              </Text>
            </TouchableOpacity>
          )}

          {!isPlayer && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onChangeRol(item.uid)}
            >
              <Text style={styles.buttonText}>Cambiar rol</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={usuarios}
      renderItem={renderItem}
      keyExtractor={(item) => item.uid}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={() => {
        return (
          <StyledAlert variant='info' message='No hay usuarios registrados' />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  genericAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sanctionBadge: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sanctionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1890ff',
  },
  sanctionButton: {
    backgroundColor: '#ff4d4f',
  },
  liftSanctionButton: {
    backgroundColor: '#52c41a',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserList;
