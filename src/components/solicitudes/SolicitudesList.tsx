// src/components/solicitudes/SolicitudesList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import type { Solicitud } from '../../types/Solicitud';
import SolicitudCrearEquipoCard from './SolicitudCrearEquipoCard';
// en el futuro importarás otras tarjetas:
// import SolicitudUnirseEquipoCard from './SolicitudUnirseEquipoCard';
// import SolicitudSalirEquipoCard    from './SolicitudSalirEquipoCard';
// import SolicitudDisolverEquipoCard from './SolicitudDisolverEquipoCard';
import StyledButton from '../common/StyledButton';

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
  const renderItem = ({ item }: { item: Solicitud }) => {
    switch (item.tipo) {
      case 'Crear Equipo':
        return (
          <SolicitudCrearEquipoCard
            solicitud={item}
            esAdmin={esAdmin}
            onAceptar={onAceptar}
            onRechazar={onRechazar}
          />
        );
      // case 'Unirse a Equipo':
      //   return <SolicitudUnirseEquipoCard ... />;
      // case 'Salir de Equipo':
      //   return <SolicitudSalirEquipoCard ... />;
      // case 'Disolver Equipo':
      //   return <SolicitudDisolverEquipoCard ... />;
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
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
});
