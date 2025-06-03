// MesaHistorial.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { HistorialAccion } from '../../../screens/modoMesa/ModoMesaLayout';

// Definición de tipos

interface MesaHistorialProps {
  acciones: HistorialAccion[];
  onEliminarAccion: (id: string) => void;
}

const MesaHistorial: React.FC<MesaHistorialProps> = ({
  acciones,
  onEliminarAccion,
}) => {
  const renderItem = ({ item }: { item: HistorialAccion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.equipo,
            item.equipo === 'local'
              ? styles.equipoLocal
              : styles.equipoVisitante,
          ]}
        >
          {item.equipo === 'local' ? 'LOCAL' : 'VISITANTE'}
        </Text>
        <Text style={styles.dorsal}>#{item.dorsal}</Text>
      </View>

      <Text style={styles.nombre}>
        {item.nombre} {item.apellidos}
      </Text>

      <View style={styles.accionContainer}>
        <Text style={styles.accion}>
          {item.accion.charAt(0).toUpperCase() + item.accion.slice(1)}
          {item.tipoTiro ? ` - ${item.tipoTiro.toUpperCase()}` : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onEliminarAccion(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  },
  equipoVisitante: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  dorsal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  accionContainer: {
    marginBottom: 12,
  },
  accion: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default MesaHistorial;
