import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import UserList from '../../components/admin/UserList';
import { UserService } from '../../services/userService';
import {
  OtherUser,
  PlayerProfile,
  PlayerUser,
  Rol,
  User,
} from '../../types/User';
import { useToast } from '../../contexts/ToastContext';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import SelectableCardGroup, {
  Option,
} from '../../components/common/SelectableCardGroup';
import { useUser } from '../../contexts/UserContext';
import StyledTextInput from '../../components/common/StyledTextInput';
import { FilterIcon } from '../../components/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const rolOptions: Option<Rol | ''>[] = [
  {
    label: 'Espectador',
    description: 'Puede ver partidos',
    value: 'espectador',
  },
  { label: 'Árbitro', description: 'Dirige partidos', value: 'arbitro' },
  {
    label: 'Coorganizador',
    description: 'Ayuda a organizar',
    value: 'coorganizador',
  },
] as const;

const rolFilters: Option<Rol | ''>[] = [
  {
    label: 'Espectador',
    description: 'Puede ver partidos',
    value: 'espectador',
  },
  { label: 'Árbitro', description: 'Dirige partidos', value: 'arbitro' },
  {
    label: 'Coorganizador',
    description: 'Ayuda a organizar',
    value: 'coorganizador',
  },
  {
    label: 'Jugador',
    description: 'Juega en partidos',
    value: 'jugador',
  },
  {
    label: 'Capitán',
    description: 'Juega en partidos',
    value: 'capitan',
  },
] as const;

export default function AdministrarUsuariosScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [modalFiltros, setModalFiltros] = useState(false);
  const [selectedRolFilter, setSelectedRolFilter] = useState<Rol | ''>('');
  const { user, loadingUser } = useUser();
  const { showToast } = useToast();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuariosFiltered, setUsuariosFiltered] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRolModalVisible, setRolModalVisible] = useState(false);
  const [isSancionModalVisible, setSancionModalVisible] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch inicial
  useEffect(() => {
    const fecthUsuarios = async () => {
      setIsLoading(true);
      const res = await UserService.getUsers();
      if (res.success && res.data) {
        if (user?.rol === 'coorganizador') {
          const usersFilered = res.data.filter(
            (u) => u.rol !== 'coorganizador' && u.rol !== 'organizador'
          );
          setUsuarios(usersFilered);
          setUsuariosFiltered(usersFilered);
        } else {
          const usersFilered = res.data.filter((u) => u.rol !== 'organizador');
          setUsuarios(usersFilered);
          setUsuariosFiltered(usersFilered);
        }
      } else setUsuarios([]);
      setIsLoading(false);
    };
    fecthUsuarios();
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    const filterUsuarios = () => {
      let result = usuarios;
      if (query) {
        result = result.filter((u) => {
          const fullName = `${u.nombre} ${u.apellidos}`;
          return (
            fullName.toLowerCase().includes(query.toLowerCase()) ||
            u.correo.toLowerCase().includes(query.toLowerCase())
          );
        });
      }
      if (selectedRolFilter) {
        result = result.filter((u) => u.rol === selectedRolFilter);
      }
      setUsuariosFiltered(result);
    };
    filterUsuarios();
  }, [query, selectedRolFilter]);

  // Abrir modal de sanción
  const handleSancionModal = (id: string) => {
    const usuario = usuarios.find((u) => u.uid === id);
    if (!usuario) {
      showToast('Usuario no encontrado', 'error');
      return;
    }
    setSelectedUser(usuario);
    setSancionModalVisible(true);
  };

  // Abrir modal de cambio de rol
  const handleRolModal = (id: string) => {
    const usuario = usuarios.find((u) => u.uid === id);
    if (!usuario) {
      showToast('Usuario no encontrado', 'error');
      return;
    }

    setSelectedUser(usuario);
    setSelectedRol(usuario.rol as Rol);
    setRolModalVisible(true);
  };

  // Confirmar sanción
  const handleSanction = async () => {
    if (!selectedUser) return;
    const jugador = selectedUser as PlayerUser;
    const nuevoEstado = !jugador.sancionado;

    try {
      const res = await UserService.UpdatePlayerProfile(jugador.uid, {
        ...jugador,
        sancionado: nuevoEstado,
      });
      if (!res.success) throw new Error();

      setUsuarios((prev) =>
        prev.map((u) =>
          u.uid === jugador.uid ? { ...u, sancionado: nuevoEstado } : u
        )
      );
      showToast(
        nuevoEstado
          ? 'Jugador sancionado correctamente'
          : 'Sanción levantada correctamente',
        'success'
      );
    } catch {
      showToast('Error al sancionar el jugador', 'error');
    }
  };

  // Confirmar cambio de rol
  const handleChangeRol = async () => {
    if (!selectedUser || !selectedRol) {
      showToast('Selecciona primero un rol', 'error');
      return;
    }
    try {
      const res = await UserService.updateUserRol(
        selectedUser.uid,
        selectedRol,
        selectedUser.rol
      );
      if (!res.success) throw new Error(res.errorMessage);

      // **Aquí** actualizas la propiedad correcta:
      setUsuarios((prev) =>
        prev.map((u) => {
          if (u.uid !== selectedUser.uid) return u;

          // Si el nuevo rol es 'jugador' o 'capitán', hacemos el cast a PlayerUser
          if (selectedRol === 'jugador' || selectedRol === 'capitan') {
            // Asumimos que 'u' ya tenía fotoURL, dorsal, etc. (o les ponemos defaults)
            const jugador: PlayerUser = {
              ...(u as PlayerUser),
              rol: selectedRol,
            };
            return jugador;
          }

          // Si el nuevo rol es uno “normal”, devolvemos un OtherUser
          const {
            fotoUrl,
            dorsal,
            posicion,
            peso,
            altura,
            sancionado,
            ...rest
          } = u as PlayerUser;
          const normal: OtherUser = {
            ...rest,
            rol: selectedRol, // ahora es uno de los 4 válidos
          };
          return normal;
        })
      );
      showToast('Rol actualizado correctamente', 'success');
    } catch {
      showToast('Error al cambiar rol', 'error');
    }
  };

  if (loadingUser) return null;
  if (!user || (user.rol !== 'coorganizador' && user.rol !== 'organizador'))
    return;

  if (isLoading) return <LoadingIndicator text='Cargando usuarios' />;
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          padding: 16,
        }}
      >
        <StyledTextInput
          placeholder='Buscar por nombre, apellidos o correo'
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchInput}
        />
        <TouchableOpacity
          style={[styles.filterButton, { borderColor: theme.border.primary }]}
          onPress={() => {
            console.log('Filter button pressed');
            setModalFiltros(true);
          }}
        >
          <FilterIcon color={theme.text.primary} />
        </TouchableOpacity>
      </View>
      <UserList
        usuarios={usuariosFiltered}
        onToggleSancion={handleSancionModal}
        onChangeRol={handleRolModal}
        queryActive={query !== '' || selectedRolFilter !== ''}
      />

      {/* Modal de Sanción */}
      <BaseConfirmationModal
        visible={isSancionModalVisible}
        title='Confirmar Sanción'
        onCancel={() => setSancionModalVisible(false)}
        onConfirm={async () => {
          await handleSanction();
          setSancionModalVisible(false);
        }}
      />

      {/* Modal de Cambio de Rol */}
      <BaseConfirmationModal
        visible={isRolModalVisible}
        title='Seleccione el nuevo Rol'
        onCancel={() => setRolModalVisible(false)}
        onConfirm={async () => {
          await handleChangeRol();
          setRolModalVisible(false);
        }}
      >
        <SelectableCardGroup
          options={rolOptions}
          value={selectedRol}
          onChange={setSelectedRol}
          style={{ marginTop: 16 }}
          cardStyle={{ marginBottom: 12 }}
        />
      </BaseConfirmationModal>
      {/* Modal de Filtros */}
      <BaseConfirmationModal
        visible={modalFiltros}
        title='Filtros'
        onCancel={() => setModalFiltros(false)}
        onConfirm={() => setModalFiltros(false)}
      >
        <SelectableCardGroup
          options={rolFilters}
          value={selectedRolFilter}
          onChange={setSelectedRolFilter}
          style={{ marginTop: 16 }}
          cardStyle={{ marginBottom: 12 }}
        />
      </BaseConfirmationModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    flex: 4,
  },
  filterButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
