import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import EstadisticasComparativas from './estadisticasComparativas/EstadisticasComparativas';
import StyledText from '../common/StyledText';
import EstadisticasJugadoresTabla from './estadisticasJugador/EstadisticasJugadores';
import { EstadisticasEquiposPartido } from '../../types/estadisticas/equipo';
import { EstadisticasJugadores } from '../../types/estadisticas/jugador';
import { EstadoPartido } from '../../types/Partido';
import StyledAlert from '../common/StyledAlert';
// import EstadisticasJugadores from './estadisticasComparativas/EstadisticasJugadores';

interface Props {
  estadisticasEquipos: EstadisticasEquiposPartido | null;
  estadisticasJugadores: EstadisticasJugadores | null;
  estado: EstadoPartido;
}

export default function BodyPartido({
  estadisticasEquipos,
  estadisticasJugadores,
  estado,
}: Props) {
  const [vista, setVista] = useState<'equipos' | 'jugadores'>('equipos');

  if (
    estado === 'pendiente' ||
    !estadisticasEquipos ||
    !estadisticasJugadores
  ) {
    return (
      <View style={{ padding: 8 }}>
        <StyledAlert
          variant='info'
          message='El partido no ha comenzado, por lo que no se pueden mostrar las estadísticas.'
        />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'equipos' && styles.selectorActivo,
          ]}
          onPress={() => setVista('equipos')}
        >
          <StyledText
            style={[vista === 'equipos' && styles.selectorTextoActivo]}
          >
            Equipos
          </StyledText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorButton,
            vista === 'jugadores' && styles.selectorActivo,
          ]}
          onPress={() => setVista('jugadores')}
        >
          <StyledText
            style={[vista === 'jugadores' && styles.selectorTextoActivo]}
          >
            Jugadores
          </StyledText>
        </TouchableOpacity>
      </View>

      <View>
        {vista === 'equipos' ? (
          <EstadisticasComparativas estadisticas={estadisticasEquipos} />
        ) : (
          <EstadisticasJugadoresTabla
            local={estadisticasJugadores.local}
            visitante={estadisticasJugadores.visitante}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
  },

  selectorButton: {
    justifyContent: 'center',
    minWidth: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },

  selectorActivo: {
    borderBottomWidth: 3,
    borderBottomColor: '#05C484',
  },

  selectorTextoActivo: {
    color: '#05C484',
  },
});
