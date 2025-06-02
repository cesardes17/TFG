import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { EstadisticasJugador } from '../../../types/estadisticas/jugador';

interface SeleccionarJugadoresModalProps {
  jugadores: EstadisticasJugador[];
  jugadoresEnPistaIds: string[];
  onCerrar: () => void;
  onConfirmar: (jugadoresSeleccionadosIds: string[]) => void;
}

const SeleccionarJugadoresModal: React.FC<SeleccionarJugadoresModalProps> = ({
  jugadores,
  jugadoresEnPistaIds,
  onCerrar,
  onConfirmar,
}) => {
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState<
    string[]
  >([]);
  const { width } = Dimensions.get('window');

  // Calculate card width for grid layout (3 columns with margins)
  const cardWidth = (width - 60) / 3; // 60 = margins and gaps

  // Initialize selected players when modal opens
  useEffect(() => {
    setJugadoresSeleccionados([...jugadoresEnPistaIds]);
  }, [jugadoresEnPistaIds]);

  const handleJugadorPress = (jugadorId: string) => {
    const estaSeleccionado = jugadoresSeleccionados.includes(jugadorId);

    if (estaSeleccionado) {
      // Deseleccionar jugador
      setJugadoresSeleccionados((prev) =>
        prev.filter((id) => id !== jugadorId)
      );
    } else {
      // Intentar seleccionar jugador
      if (jugadoresSeleccionados.length >= 5) {
        Alert.alert(
          'Límite alcanzado',
          'Solo puedes tener 5 jugadores seleccionados en pista.',
          [{ text: 'OK' }]
        );
        return;
      }
      setJugadoresSeleccionados((prev) => [...prev, jugadorId]);
    }
  };

  const handleConfirmar = () => {
    if (jugadoresSeleccionados.length !== 5) {
      Alert.alert(
        'Selección incompleta',
        'Debes seleccionar exactamente 5 jugadores para continuar.',
        [{ text: 'OK' }]
      );
      return;
    }
    onConfirmar(jugadoresSeleccionados);
  };

  const renderJugador = (jugador: EstadisticasJugador) => {
    const estaSeleccionado = jugadoresSeleccionados.includes(jugador.jugadorId);

    return (
      <TouchableOpacity
        key={jugador.jugadorId}
        style={[
          styles.tarjetaJugador,
          { width: cardWidth },
          estaSeleccionado && styles.tarjetaSeleccionada,
        ]}
        onPress={() => handleJugadorPress(jugador.jugadorId)}
        activeOpacity={0.7}
      >
        {/* Indicador de selección */}
        {estaSeleccionado && (
          <View style={styles.indicadorSeleccion}>
            <Text style={styles.textoSeleccion}>✓</Text>
          </View>
        )}

        {/* Foto del jugador */}
        <View style={styles.contenedorFoto}>
          {jugador.fotoUrl ? (
            <Image source={{ uri: jugador.fotoUrl }} style={styles.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.textoPlaceholder}>
                {jugador.nombre.charAt(0)}
                {jugador.apellidos.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Información del jugador */}
        <View style={styles.infoJugador}>
          <Text style={styles.dorsal}>#{jugador.dorsal}</Text>
          <Text style={styles.nombre} numberOfLines={1}>
            {jugador.nombre}
          </Text>
          <Text style={styles.apellidos} numberOfLines={1}>
            {jugador.apellidos}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={true}
      animationType='slide'
      transparent={true}
      onRequestClose={onCerrar}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Seleccionar Jugadores</Text>
            <Text style={styles.contador}>
              {jugadoresSeleccionados.length}/5 seleccionados
            </Text>
          </View>

          {/* Grid de jugadores */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {jugadores.map(renderJugador)}
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity
              style={[styles.boton, styles.botonCancelar]}
              onPress={onCerrar}
            >
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.boton,
                styles.botonConfirmar,
                jugadoresSeleccionados.length !== 5 &&
                  styles.botonDeshabilitado,
              ]}
              onPress={handleConfirmar}
            >
              <Text
                style={[
                  styles.textoBotonConfirmar,
                  jugadoresSeleccionados.length !== 5 &&
                    styles.textoDeshabilitado,
                ]}
              >
                Confirmar selección
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  contador: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
    paddingBottom: 20,
  },
  tarjetaJugador: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tarjetaSeleccionada: {
    backgroundColor: '#e8f5e8',
    borderColor: '#28a745',
  },
  indicadorSeleccion: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28a745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textoSeleccion: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contenedorFoto: {
    marginBottom: 8,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  infoJugador: {
    alignItems: 'center',
    width: '100%',
  },
  dorsal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 4,
  },
  nombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  apellidos: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 2,
  },
  botonesContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: '#6c757d',
  },
  botonConfirmar: {
    backgroundColor: '#28a745',
  },
  botonDeshabilitado: {
    backgroundColor: '#dee2e6',
  },
  textoBotonCancelar: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textoBotonConfirmar: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textoDeshabilitado: {
    color: '#6c757d',
  },
});

export default SeleccionarJugadoresModal;
