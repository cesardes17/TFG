// src/components/solicitudes/SolicitudesList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import type {
  Solicitud,
  solicitudCrearEquipo,
  solicitudUnirseEquipo,
} from '../../types/Solicitud';
import SolicitudCrearEquipoCard from './SolicitudCrearEquipoCard';

import StyledAlert from '../common/StyledAlert';
import SolicitudEquipo from './SolicitudUnirseEquipoCard';
import { useUser } from '../../contexts/UserContext';

type Props = {
  solicitudes: Solicitud[];
  esAdmin: boolean;
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
};

export default function SolicitudesList({
  solicitudes,
  esAdmin,
  onAceptar,
  onRechazar,
}: Props) {
  const { user } = useUser();
  const userActual = {
    id: user!.uid,
    esAdmin: esAdmin,
  };

  const renderItem = ({ item }: { item: Solicitud }) => {
    switch (item.tipo) {
      case 'Crear Equipo':
        return (
          <SolicitudCrearEquipoCard
            solicitud={item as solicitudCrearEquipo}
            esAdmin={esAdmin}
            onAceptar={onAceptar}
            onRechazar={onRechazar}
          />
        );
      case 'Unirse a Equipo':
        return (
          <SolicitudEquipo
            solicitud={item as solicitudUnirseEquipo}
            usuarioActual={userActual}
            onAceptar={onAceptar}
            onRechazar={onRechazar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={solicitudes}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      style={{ marginTop: 16 }}
      ListEmptyComponent={
        <View style={{ alignItems: 'center' }}>
          <StyledAlert variant='info' message='No hay solicitudes' />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
});
