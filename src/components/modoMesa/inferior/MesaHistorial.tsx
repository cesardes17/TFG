import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { HistorialAccion } from '../../../screens/modoMesa/ModoMesaLayout';
import StyledText from '../../common/StyledText';

interface MesaHistorialProps {
  acciones: HistorialAccion[];
  onEliminarAccion: (id: string) => void;
}

export default function MesaHistorial({
  acciones,
  onEliminarAccion,
}: MesaHistorialProps) {
  const renderItem = ({ item }: { item: HistorialAccion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <StyledText
          variant='primary'
          style={[
            styles.equipo,
            item.equipo === 'local'
              ? styles.equipoLocal
              : styles.equipoVisitante,
          ]}
        >
          {item.equipo === 'local' ? 'LOCAL' : 'VISITANTE'}
        </StyledText>
        <StyledText variant='primary' style={styles.dorsal}>
          #{item.dorsal}
        </StyledText>
      </View>

      <StyledText variant='primary' style={styles.nombre}>
        {item.nombre} {item.apellidos}
      </StyledText>

      <View style={styles.accionContainer}>
        <StyledText variant='secondary' style={styles.accion}>
          {item.accion.charAt(0).toUpperCase() + item.accion.slice(1)}
          {item.tipoTiro ? ` - ${item.tipoTiro.toUpperCase()}` : ''}
        </StyledText>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onEliminarAccion(item.id)}
      >
        <StyledText variant='light' style={styles.deleteButtonText}>
          Eliminar
        </StyledText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={acciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Modo mesa: negro
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#121212', // Más oscuro para modo mesa
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333', // Bordes oscuros
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipo: {
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  equipoLocal: {
    backgroundColor: '#1E88E5',
    color: '#ffffff',
  },
  equipoVisitante: {
    backgroundColor: '#C62828',
    color: '#ffffff',
  },
  dorsal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  accionContainer: {
    marginBottom: 12,
  },
  accion: {
    fontSize: 14,
    color: '#cccccc',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: '500',
  },
});
