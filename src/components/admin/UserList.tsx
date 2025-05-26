import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { UserAvatar } from './UserAvatar';
import { PlayerProfile, User } from '../../types/User';
import ProgressiveImage from '../common/ProgressiveImage';
import StyledAlert from '../common/StyledAlert';
import { useTheme } from '../../contexts/ThemeContext';

// Props del componente
interface UserListProps {
  usuarios: User[];
  onToggleSancion: (id: string) => void;
  onChangeRol: (id: string) => void;
  queryActive: boolean;
}

const UserList: React.FC<UserListProps> = ({
  usuarios,
  onToggleSancion,
  onChangeRol,
  queryActive,
}) => {
  const { theme } = useTheme();
  const isPlayerOrCaptain = (rol: string) =>
    rol === 'jugador' || rol === 'capitán';

  if (usuarios.length === 0) {
    return (
      <View style={styles.listContainer}>
        <StyledAlert
          variant='info'
          message={
            queryActive
              ? 'No hay usuarios que coincidan con los filtros.'
              : 'No hay usuarios'
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {usuarios.map((item) => {
        const isPlayer = isPlayerOrCaptain(item.rol);

        return (
          <View
            key={item.uid}
            style={[styles.card, { backgroundColor: theme.cardDefault }]}
          >
            <View style={styles.userInfoContainer}>
              {isPlayer ? (
                <ProgressiveImage
                  uri={(item as PlayerProfile).fotoUrl || ''}
                  containerStyle={styles.playerPhoto}
                />
              ) : (
                <UserAvatar style={styles.genericAvatar} />
              )}

              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: theme.text.primary }]}>
                  {item.nombre} {item.apellidos}
                </Text>
                <Text style={[styles.userrol, { color: theme.text.secondary }]}>
                  {item.rol}
                </Text>
                <Text
                  style={[styles.userEmail, { color: theme.text.secondary }]}
                >
                  {item.correo}
                </Text>

                {(item as PlayerProfile).sancionado && (
                  <View
                    style={[
                      styles.sanctionBadge,
                      { backgroundColor: theme.background.error },
                    ]}
                  >
                    <Text
                      style={[styles.sanctionText, { color: theme.text.light }]}
                    >
                      Sancionado
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.actionsContainer}>
              {isPlayer && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: (item as PlayerProfile).sancionado
                        ? theme.button.primary.background
                        : theme.button.error.background,
                    },
                  ]}
                  onPress={() => onToggleSancion(item.uid)}
                >
                  <Text
                    style={[styles.buttonText, { color: theme.text.light }]}
                  >
                    {(item as PlayerProfile).sancionado
                      ? 'Levantar sanción'
                      : 'Sancionar'}
                  </Text>
                </TouchableOpacity>
              )}

              {!isPlayer && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.button.primary.background },
                  ]}
                  onPress={() => onChangeRol(item.uid)}
                >
                  <Text
                    style={[styles.buttonText, { color: theme.text.light }]}
                  >
                    Cambiar rol
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
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
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userrol: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 14,
  },
  sanctionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sanctionText: {
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
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default UserList;
