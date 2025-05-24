// src/screens/solicitud/SolicitudesScreen.tsx:

import { useState } from 'react';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import StyledAlert from '../../components/common/StyledAlert';
import SolicitudesList from '../../components/solicitudes/SolicitudesList';
import { View } from 'react-native';
import HeaderListSolicitudes from '../../components/solicitudes/HeaderListSolicitudes';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import StyledTextInput from '../../components/common/StyledTextInput';
import { FilterIcon } from '../../components/Icons';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import { estadoSolicitud, tipoSolicitud } from '../../types/Solicitud';
import SelectableCardGroup from '../../components/common/SelectableCardGroup';
import SelectorEstado, {
  EstadoSolicitudConTodos,
} from '../../components/solicitudes/SelectorEstado';

export default function SolicitudesScreen() {
  const { theme } = useTheme();
  const { temporada, loadingTemporada } = useTemporadaContext();
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTipoSolicitud, setSelectedTipoSolicitud] = useState<
    tipoSolicitud | ''
  >('');
  const [selectedTipo, setSelectedTipo] = useState<tipoSolicitud | null>(null);
  const [selectedEstado, setSelectedEstado] =
    useState<EstadoSolicitudConTodos>('pendiente');
  if (loadingTemporada || loadingUser) {
    console.log('loadingtemporada: ', loadingTemporada);
    console.log('loadinguser: ', loadingUser);
    console.log('isloading: ', isLoading);

    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <LoadingIndicator text='Cargando información' />
      </View>
    );
  }

  if (!user || !temporada) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <StyledAlert variant='error' message='No hay temporada activa' />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <LoadingIndicator text={loadingText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? <HeaderListSolicitudes /> : null}
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
            setModalVisible(true);
          }}
        >
          <FilterIcon color={theme.text.primary} />
        </TouchableOpacity>
      </View>
      <SelectorEstado value={selectedEstado} onSelect={setSelectedEstado} />

      <SolicitudesList
        screenLoading={setIsLoading}
        setLoadingText={setLoadingText}
        searchQuery={query}
        tipoSolicitud={selectedTipo}
        estadoSolicitud={selectedEstado}
      />

      <BaseConfirmationModal
        title='Selecciona un tipo de Solicitud'
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (selectedTipoSolicitud === '') {
            setSelectedTipo(null);
          } else {
            setSelectedTipo(selectedTipoSolicitud);
          }
        }}
      >
        <SelectableCardGroup
          options={[
            {
              label: 'Crear Equipo',
              description: 'Solicitud para crear un nuevo equipo',
              value: 'Crear Equipo',
            },
            {
              label: 'Unirse a Equipo',
              description: 'Solicitud para unirse a un equipo existente',
              value: 'Unirse a Equipo',
            },
            {
              label: 'Salir de Equipo',
              description: 'Solicitud para abandonar tu equipo actual',
              value: 'Salir de Equipo',
            },
            {
              label: 'Disolver Equipo',
              description: 'Solicitud para disolver un equipo existente',
              value: 'Disolver Equipo',
            },
          ]}
          value={selectedTipoSolicitud}
          onChange={(value) => {
            if (value === '') {
              setSelectedTipoSolicitud(value);
            }
            setSelectedTipoSolicitud(value as tipoSolicitud);
          }}
        />
      </BaseConfirmationModal>
    </View>
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
