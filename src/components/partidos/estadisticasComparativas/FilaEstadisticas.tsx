import React from 'react';
import { View, StyleSheet } from 'react-native';
import BarraProgreso from './BarraProgreso';
import StyledText from '../../common/StyledText';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  titulo: string;
  valorLocal: string;
  valorVisitante: string;
  porcentajeLocal: number;
  porcentajeVisitante: number;
  esTiro?: boolean;
}

const FilaEstadistica: React.FC<Props> = ({
  titulo,
  valorLocal,
  valorVisitante,
  porcentajeLocal,
  porcentajeVisitante,
  esTiro = false,
}) => {
  const { mode } = useTheme();

  return (
    <View
      style={
        (styles.filaEstadistica,
        { shadowColor: mode === 'dark' ? '#fff' : '#000' })
      }
    >
      <StyledText style={styles.tituloEstadistica}>{titulo}</StyledText>

      <View style={styles.valoresContainer}>
        <StyledText style={styles.valorLocal}>{valorLocal}</StyledText>
        <StyledText style={styles.valorVisitante}>{valorVisitante}</StyledText>
      </View>

      <BarraProgreso
        porcentajeLocal={porcentajeLocal}
        porcentajeVisitante={porcentajeVisitante}
        esTiro={esTiro}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filaEstadistica: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloEstadistica: {
    fontSize: 16,
    marginTop: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  valoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  valorLocal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
  },
  valorVisitante: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10920C',
  },
});

export default FilaEstadistica;
