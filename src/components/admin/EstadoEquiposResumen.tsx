import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';
import { CircleCheckIcon, CrossCricleIcon, WarningIcon } from '../Icons';

interface Props {
  equiposTotales: number;
  equiposIncompletos: number;
}

export default function EstadoEquiposResumen({
  equiposTotales,
  equiposIncompletos,
}: Props) {
  const MIN_EQUIPOS_LIGA = 7;
  const equiposCompletos = equiposTotales - equiposIncompletos;

  let color = '#DC2626'; // rojo
  let mensaje = 'No se puede iniciar la liga';
  let Icono = () => <CrossCricleIcon color={color} size={20} />;

  if (equiposCompletos >= MIN_EQUIPOS_LIGA) {
    color = '#16A34A'; // verde
    mensaje = 'Lista para iniciar la liga';
    Icono = () => <CircleCheckIcon color={color} size={20} />;
  } else if (equiposCompletos >= 5) {
    color = '#CA8A04'; // amarillo
    mensaje = 'Cerca de iniciar la liga';
    Icono = () => <WarningIcon color={color} size={20} />;
  }

  return (
    <View style={styles.container}>
      <StyledText size='medium'>
        {equiposCompletos + '/' + equiposTotales} Equipos Completos
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
    alignItems: 'center',
    justifyContent: 'center',
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
