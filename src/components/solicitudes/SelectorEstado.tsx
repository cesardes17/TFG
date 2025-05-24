import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { estadoSolicitud } from '../../types/Solicitud';
import StyledText from '../common/StyledText';
import { useTheme } from '../../contexts/ThemeContext';

export type EstadoSolicitudConTodos = estadoSolicitud | 'todos';

interface EstadoSelectorProps {
  value: EstadoSolicitudConTodos;
  onSelect: (estado: EstadoSolicitudConTodos) => void;
}

const opciones: { label: string; value: EstadoSolicitudConTodos }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Aceptadas', value: 'aceptada' },
  { label: 'Rechazadas', value: 'rechazada' },
];

export default function SelectorEstado({
  value,
  onSelect,
}: EstadoSelectorProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {opciones.map((opcion) => {
        const seleccionado = value === opcion.value;
        return (
          <TouchableOpacity
            key={opcion.value}
            style={[
              styles.boton,
              { borderColor: theme.border.primary },
              seleccionado && styles.botonSeleccionado,
            ]}
            onPress={() => onSelect(opcion.value)}
          >
            <StyledText
              size={'small'}
              style={[styles.texto, seleccionado && styles.textoSeleccionado]}
            >
              {opcion.label}
            </StyledText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    gap: 8,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonSeleccionado: {
    backgroundColor: '#4CAF50', // color principal activo
    borderWidth: 0,
  },
  texto: {
    fontWeight: '500',
  },
  textoSeleccionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
