import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Tipos
type EstadisticasTiro = {
  anotados: number;
  fallados: number;
};

type EstadisticasEquipo = {
  puntos: number;
  tirosLibres: EstadisticasTiro;
  tirosDos: EstadisticasTiro;
  tirosTres: EstadisticasTiro;
  asistencias: number;
  rebotes: number;
  faltasCometidas: number;
};

type EstadisticasEquiposPorPeriodo = {
  [periodo: string]: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
};

type EstadisticasEquiposPartido = {
  porCuarto: EstadisticasEquiposPorPeriodo;
  totales: {
    local: EstadisticasEquipo;
    visitante: EstadisticasEquipo;
  };
};

interface Props {
  estadisticas: EstadisticasEquiposPartido;
}

// Componente para el selector de periodo
const SelectorPeriodo: React.FC<{
  periodos: string[];
  periodoSeleccionado: string;
  onSeleccionar: (periodo: string) => void;
}> = ({ periodos, periodoSeleccionado, onSeleccionar }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.selectorContainer}
      contentContainerStyle={styles.selectorContent}
    >
      {periodos.map((periodo) => (
        <TouchableOpacity
          key={periodo}
          style={[
            styles.botonPeriodo,
            periodoSeleccionado === periodo && styles.botonPeriodoActivo,
          ]}
          onPress={() => onSeleccionar(periodo)}
        >
          <Text
            style={[
              styles.textoPeriodo,
              periodoSeleccionado === periodo && styles.textoPeriodoActivo,
            ]}
          >
            {periodo}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Componente para la barra de progreso
const BarraProgreso: React.FC<{
  porcentajeLocal: number;
  porcentajeVisitante: number;
  esTiro?: boolean;
}> = ({ porcentajeLocal, porcentajeVisitante, esTiro = false }) => {
  return (
    <View style={styles.barraComparativa}>
      {/* Local - izquierda */}
      <View style={styles.barraMitad}>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraLocal,
              {
                width: `${porcentajeLocal}%`,
                alignSelf: 'flex-end', // 🔹 barra azul va hacia la izquierda
              },
            ]}
          />
        </View>
      </View>

      {/* Visitante - derecha */}
      <View style={styles.barraMitad}>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraVisitante,
              {
                width: `${porcentajeVisitante}%`,
                alignSelf: 'flex-start', // 🔸 barra naranja va hacia la derecha
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

// Componente para una fila de estadística
const FilaEstadistica: React.FC<{
  titulo: string;
  valorLocal: string;
  valorVisitante: string;
  porcentajeLocal: number;
  porcentajeVisitante: number;
  esTiro?: boolean;
}> = ({
  titulo,
  valorLocal,
  valorVisitante,
  porcentajeLocal,
  porcentajeVisitante,
  esTiro = false,
}) => {
  return (
    <View style={styles.filaEstadistica}>
      <Text style={styles.tituloEstadistica}>{titulo}</Text>

      {/* Valores */}
      <View style={styles.valoresContainer}>
        <Text style={styles.valorLocal}>{valorLocal}</Text>
        <Text style={styles.valorVisitante}>{valorVisitante}</Text>
      </View>

      {/* Barra de progreso */}
      <BarraProgreso
        porcentajeLocal={porcentajeLocal}
        porcentajeVisitante={porcentajeVisitante}
        esTiro={esTiro}
      />
    </View>
  );
};

// Componente principal
const EstadisticasComparativas: React.FC<Props> = ({ estadisticas }) => {
  // Generar lista de periodos
  const periodos = ['Totales', ...Object.keys(estadisticas.porCuarto).sort()];
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Totales');

  // Obtener estadísticas del periodo seleccionado
  const obtenerEstadisticasPeriodo = () => {
    if (periodoSeleccionado === 'Totales') {
      return estadisticas.totales;
    }
    return estadisticas.porCuarto[periodoSeleccionado];
  };

  const estadisticasPeriodo = obtenerEstadisticasPeriodo();

  // Funciones auxiliares
  const calcularPorcentajeTiro = (tiro: EstadisticasTiro): number => {
    const total = tiro.anotados + tiro.fallados;
    return total > 0 ? (tiro.anotados / total) * 100 : 0;
  };

  const formatearTiro = (tiro: EstadisticasTiro): string => {
    const total = tiro.anotados + tiro.fallados;
    const porcentaje = calcularPorcentajeTiro(tiro);
    return `${porcentaje.toFixed(1)}% (${tiro.anotados}/${total})`;
  };

  const calcularPorcentajeRelativo = (
    valor: number,
    valorOponente: number
  ): number => {
    const maximo = Math.max(valor, valorOponente);
    return maximo > 0 ? (valor / maximo) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      {/* Selector de periodo */}
      <SelectorPeriodo
        periodos={periodos}
        periodoSeleccionado={periodoSeleccionado}
        onSeleccionar={setPeriodoSeleccionado}
      />

      {/* Estadísticas */}
      <ScrollView style={styles.estadisticasContainer}>
        {/* Puntos */}
        <FilaEstadistica
          titulo='Puntos'
          valorLocal={estadisticasPeriodo.local.puntos.toString()}
          valorVisitante={estadisticasPeriodo.visitante.puntos.toString()}
          porcentajeLocal={calcularPorcentajeRelativo(
            estadisticasPeriodo.local.puntos,
            estadisticasPeriodo.visitante.puntos
          )}
          porcentajeVisitante={calcularPorcentajeRelativo(
            estadisticasPeriodo.visitante.puntos,
            estadisticasPeriodo.local.puntos
          )}
        />

        {/* Tiros libres */}
        <FilaEstadistica
          titulo='Tiros Libres'
          valorLocal={formatearTiro(estadisticasPeriodo.local.tirosLibres)}
          valorVisitante={formatearTiro(
            estadisticasPeriodo.visitante.tirosLibres
          )}
          porcentajeLocal={calcularPorcentajeTiro(
            estadisticasPeriodo.local.tirosLibres
          )}
          porcentajeVisitante={calcularPorcentajeTiro(
            estadisticasPeriodo.visitante.tirosLibres
          )}
          esTiro={true}
        />

        {/* Tiros de 2 */}
        <FilaEstadistica
          titulo='Tiros de 2'
          valorLocal={formatearTiro(estadisticasPeriodo.local.tirosDos)}
          valorVisitante={formatearTiro(estadisticasPeriodo.visitante.tirosDos)}
          porcentajeLocal={calcularPorcentajeTiro(
            estadisticasPeriodo.local.tirosDos
          )}
          porcentajeVisitante={calcularPorcentajeTiro(
            estadisticasPeriodo.visitante.tirosDos
          )}
          esTiro={true}
        />

        {/* Tiros de 3 */}
        <FilaEstadistica
          titulo='Tiros de 3'
          valorLocal={formatearTiro(estadisticasPeriodo.local.tirosTres)}
          valorVisitante={formatearTiro(
            estadisticasPeriodo.visitante.tirosTres
          )}
          porcentajeLocal={calcularPorcentajeTiro(
            estadisticasPeriodo.local.tirosTres
          )}
          porcentajeVisitante={calcularPorcentajeTiro(
            estadisticasPeriodo.visitante.tirosTres
          )}
          esTiro={true}
        />

        {/* Asistencias */}
        <FilaEstadistica
          titulo='Asistencias'
          valorLocal={estadisticasPeriodo.local.asistencias.toString()}
          valorVisitante={estadisticasPeriodo.visitante.asistencias.toString()}
          porcentajeLocal={calcularPorcentajeRelativo(
            estadisticasPeriodo.local.asistencias,
            estadisticasPeriodo.visitante.asistencias
          )}
          porcentajeVisitante={calcularPorcentajeRelativo(
            estadisticasPeriodo.visitante.asistencias,
            estadisticasPeriodo.local.asistencias
          )}
        />

        {/* Rebotes */}
        <FilaEstadistica
          titulo='Rebotes'
          valorLocal={estadisticasPeriodo.local.rebotes.toString()}
          valorVisitante={estadisticasPeriodo.visitante.rebotes.toString()}
          porcentajeLocal={calcularPorcentajeRelativo(
            estadisticasPeriodo.local.rebotes,
            estadisticasPeriodo.visitante.rebotes
          )}
          porcentajeVisitante={calcularPorcentajeRelativo(
            estadisticasPeriodo.visitante.rebotes,
            estadisticasPeriodo.local.rebotes
          )}
        />

        {/* Faltas cometidas */}
        <FilaEstadistica
          titulo='Faltas Cometidas'
          valorLocal={estadisticasPeriodo.local.faltasCometidas.toString()}
          valorVisitante={estadisticasPeriodo.visitante.faltasCometidas.toString()}
          porcentajeLocal={calcularPorcentajeRelativo(
            estadisticasPeriodo.local.faltasCometidas,
            estadisticasPeriodo.visitante.faltasCometidas
          )}
          porcentajeVisitante={calcularPorcentajeRelativo(
            estadisticasPeriodo.visitante.faltasCometidas,
            estadisticasPeriodo.local.faltasCometidas
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  selectorContainer: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  selectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botonPeriodo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  botonPeriodoActivo: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  textoPeriodo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  textoPeriodoActivo: {
    color: '#ffffff',
  },
  estadisticasContainer: {
    flex: 1,
    padding: 16,
  },
  filaEstadistica: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloEstadistica: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
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
    color: '#fd7e14',
  },
  barraContainer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  mitadBarra: {
    flex: 1,
  },
  fondoBarra: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  barraPorcentaje: {
    height: '100%',
  },
  barraComparativa: {
    flexDirection: 'row',
    height: 8,
    marginTop: 4,
  },

  barraMitad: {
    flex: 1,
    paddingHorizontal: 2,
  },

  barraFondo: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },

  barraLocal: {
    height: '100%',
    backgroundColor: '#007bff',
  },

  barraVisitante: {
    height: '100%',
    backgroundColor: '#fd7e14',
  },
});

export default EstadisticasComparativas;
