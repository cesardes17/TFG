import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';
import { CircleCheckIcon, CrossCricleIcon, WarningIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import type { EquipoEstado } from '../../hooks/useEquiposConEstado';

interface Props {
  equiposTotales: EquipoEstado[];
  equiposIncompletos: EquipoEstado[];
}

export default function EstadoEquiposResumen({
  equiposTotales,
  equiposIncompletos,
}: Props) {
  const { theme } = useTheme();
  const MIN_EQUIPOS_LIGA = 7;

  const total = equiposTotales.length;
  const completos = equiposTotales.length - equiposIncompletos.length;

  let color = '#DC2626'; // rojo
  let mensaje = 'No se puede iniciar la liga';
  let Icono = () => <CrossCricleIcon color={color} size={20} />;

  if (completos >= MIN_EQUIPOS_LIGA) {
    color = '#16A34A'; // verde
    mensaje = 'Lista para iniciar la liga';
    Icono = () => <CircleCheckIcon color={color} size={20} />;
  } else if (completos >= 5) {
    color = '#CA8A04'; // amarillo
    mensaje = 'Cerca de iniciar la liga';
    Icono = () => <WarningIcon color={color} size={20} />;
  }

  return (
    <View style={[styles.container, { borderColor: theme.border.primary }]}>
      <StyledText size='medium'>
        {completos}/{total} Equipos Completos
      </StyledText>

      <View style={styles.estadoContainer}>
        <Icono />
        <StyledText style={[styles.estadoTexto, { color }]}>
          {mensaje}
        </StyledText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: 12,
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
  },
  estadoContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estadoTexto: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
