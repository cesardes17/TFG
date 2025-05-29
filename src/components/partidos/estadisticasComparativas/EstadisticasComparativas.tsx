import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import SelectorPeriodo from './SelectorPeriodo';
import FilaEstadisticas from './FilaEstadisticas';
import { EstadisticasEquiposPartido } from '../../../types/estadisticas/equipo';
import { EstadisticasTiro } from '../../../types/estadisticas/tiro';

interface Props {
  estadisticas: EstadisticasEquiposPartido;
}

const EstadisticasComparativas: React.FC<Props> = ({ estadisticas }) => {
  const periodos = ['Totales', ...Object.keys(estadisticas.porCuarto).sort()];
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Totales');

  const obtenerEstadisticasPeriodo = () => {
    return periodoSeleccionado === 'Totales'
      ? estadisticas.totales
      : estadisticas.porCuarto[periodoSeleccionado];
  };

  const estadisticasPeriodo = obtenerEstadisticasPeriodo();

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
    oponente: number
  ): number => {
    const maximo = Math.max(valor, oponente);
    return maximo > 0 ? (valor / maximo) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      <SelectorPeriodo
        periodos={periodos}
        periodoSeleccionado={periodoSeleccionado}
        onSeleccionar={setPeriodoSeleccionado}
      />

      <View style={styles.estadisticasContainer}>
        <FilaEstadisticas
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

        <FilaEstadisticas
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
          esTiro
        />

        <FilaEstadisticas
          titulo='Tiros de 2'
          valorLocal={formatearTiro(estadisticasPeriodo.local.tirosDos)}
          valorVisitante={formatearTiro(estadisticasPeriodo.visitante.tirosDos)}
          porcentajeLocal={calcularPorcentajeTiro(
            estadisticasPeriodo.local.tirosDos
          )}
          porcentajeVisitante={calcularPorcentajeTiro(
            estadisticasPeriodo.visitante.tirosDos
          )}
          esTiro
        />

        <FilaEstadisticas
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
          esTiro
        />

        <FilaEstadisticas
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

        <FilaEstadisticas
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

        <FilaEstadisticas
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  estadisticasContainer: {
    flex: 1,
    padding: 16,
  },
});

export default EstadisticasComparativas;
