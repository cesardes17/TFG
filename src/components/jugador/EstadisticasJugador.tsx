import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { EstadisticasSimpleJugador } from '../../types/estadisticas/jugador';

interface Props {
  estadisticasLiga?: EstadisticasSimpleJugador | null;
  estadisticasCopa?: EstadisticasSimpleJugador | null;
  estadisticasPlayoff?: EstadisticasSimpleJugador | null;
}

type CompeticionTipo = 'Liga' | 'Copa' | 'Playoff' | 'Totales';

export default function EstadisticasJugador({
  estadisticasLiga,
  estadisticasCopa,
  estadisticasPlayoff,
}: Props) {
  const { theme } = useTheme();

  const competicionesDisponibles = useMemo(() => {
    const competiciones: {
      tipo: CompeticionTipo;
      disponible: boolean;
      datos: EstadisticasSimpleJugador | null | undefined;
    }[] = [
      { tipo: 'Liga', disponible: !!estadisticasLiga, datos: estadisticasLiga },
      { tipo: 'Copa', disponible: !!estadisticasCopa, datos: estadisticasCopa },
      {
        tipo: 'Playoff',
        disponible: !!estadisticasPlayoff,
        datos: estadisticasPlayoff,
      },
    ];
    return competiciones.filter((comp) => comp.disponible);
  }, [estadisticasLiga, estadisticasCopa, estadisticasPlayoff]);

  const [competicionSeleccionada, setCompeticionSeleccionada] =
    useState<CompeticionTipo>(
      competicionesDisponibles.length > 0
        ? competicionesDisponibles[0].tipo
        : 'Liga'
    );

  const mostrarTotales = competicionesDisponibles.length > 1;

  const estadisticasTotales = useMemo(() => {
    if (competicionesDisponibles.length <= 1) return null;
    const totales: EstadisticasSimpleJugador = {
      puntos: 0,
      asistencias: 0,
      rebotes: 0,
      faltasCometidas: 0,
      partidosJugados: 0,
      tirosLibres: { anotados: 0, fallados: 0 },
      tirosDos: { anotados: 0, fallados: 0 },
      tirosTres: { anotados: 0, fallados: 0 },
    };
    competicionesDisponibles.forEach((comp) => {
      if (!comp.datos) return;
      totales.puntos += comp.datos.puntos;
      totales.asistencias += comp.datos.asistencias;
      totales.rebotes += comp.datos.rebotes;
      totales.faltasCometidas += comp.datos.faltasCometidas;
      totales.partidosJugados += comp.datos.partidosJugados;
      totales.tirosLibres.anotados += comp.datos.tirosLibres.anotados;
      totales.tirosLibres.fallados += comp.datos.tirosLibres.fallados;
      totales.tirosDos.anotados += comp.datos.tirosDos.anotados;
      totales.tirosDos.fallados += comp.datos.tirosDos.fallados;
      totales.tirosTres.anotados += comp.datos.tirosTres.anotados;
      totales.tirosTres.fallados += comp.datos.tirosTres.fallados;
    });
    return totales;
  }, [competicionesDisponibles]);

  const estadisticasAMostrar = useMemo(() => {
    if (competicionSeleccionada === 'Totales') return estadisticasTotales;
    if (competicionSeleccionada === 'Liga') return estadisticasLiga;
    if (competicionSeleccionada === 'Copa') return estadisticasCopa;
    if (competicionSeleccionada === 'Playoff') return estadisticasPlayoff;
    return null;
  }, [
    competicionSeleccionada,
    estadisticasLiga,
    estadisticasCopa,
    estadisticasPlayoff,
    estadisticasTotales,
  ]);

  const renderBotones = () => {
    const botones = competicionesDisponibles.map((comp) => (
      <TouchableOpacity
        key={comp.tipo}
        style={[
          styles.botonCompeticion,
          { backgroundColor: theme.background.primary },
          competicionSeleccionada === comp.tipo && {
            backgroundColor: theme.button.primary.background,
          },
        ]}
        onPress={() => setCompeticionSeleccionada(comp.tipo)}
      >
        <StyledText
          style={[
            styles.textoBoton,
            competicionSeleccionada === comp.tipo && {
              color: theme.button.primary.text,
            },
          ]}
          variant='primary'
        >
          {comp.tipo}
        </StyledText>
      </TouchableOpacity>
    ));

    if (mostrarTotales) {
      botones.push(
        <TouchableOpacity
          key='Totales'
          style={[
            styles.botonCompeticion,
            { backgroundColor: theme.background.primary },
            competicionSeleccionada === 'Totales' && {
              backgroundColor: theme.button.primary.background,
            },
          ]}
          onPress={() => setCompeticionSeleccionada('Totales')}
        >
          <StyledText
            style={[
              styles.textoBoton,
              competicionSeleccionada === 'Totales' && {
                color: theme.button.primary.text,
              },
            ]}
            variant='primary'
          >
            Totales
          </StyledText>
        </TouchableOpacity>
      );
    }

    return botones;
  };

  const renderEstadisticaItem = (titulo: string, valor: number | string) => (
    <View style={[styles.estadisticaItem, { backgroundColor: '#F8F9FA0E' }]}>
      <StyledText style={styles.tituloEstadistica} variant='secondary'>
        {titulo}
      </StyledText>
      <StyledText style={styles.valorEstadistica} variant='primary'>
        {valor}
      </StyledText>
    </View>
  );

  const renderEstadisticaTiros = (
    titulo: string,
    anotados: number,
    fallados: number
  ) => {
    const total = anotados + fallados;
    const porcentaje = total > 0 ? Math.round((anotados / total) * 100) : 0;

    return (
      <View style={styles.estadisticaGrupo}>
        <StyledText style={styles.tituloGrupo} variant='primary'>
          {titulo}
        </StyledText>

        <View style={styles.estadisticaRow}>
          {renderEstadisticaItem('Anotados', anotados)}
          {renderEstadisticaItem('Fallados', fallados)}
          {renderEstadisticaItem('Total', total)}
          {renderEstadisticaItem('Porcentaje', `${porcentaje}%`)}
        </View>
      </View>
    );
  };

  const renderContenidoEstadisticas = () => {
    if (!estadisticasAMostrar) {
      return (
        <StyledText style={styles.noData} variant='secondary'>
          No hay estadísticas disponibles
        </StyledText>
      );
    }

    return (
      <View style={styles.contenidoEstadisticas}>
        <View style={styles.estadisticasSimples}>
          {renderEstadisticaItem('Puntos', estadisticasAMostrar.puntos)}
          {renderEstadisticaItem(
            'Asistencias',
            estadisticasAMostrar.asistencias
          )}
          {renderEstadisticaItem('Rebotes', estadisticasAMostrar.rebotes)}
          {renderEstadisticaItem(
            'Faltas cometidas',
            estadisticasAMostrar.faltasCometidas
          )}
          {renderEstadisticaItem(
            'Partidos jugados',
            estadisticasAMostrar.partidosJugados
          )}
        </View>

        {renderEstadisticaTiros(
          'Tiros libres',
          estadisticasAMostrar.tirosLibres.anotados,
          estadisticasAMostrar.tirosLibres.fallados
        )}
        {renderEstadisticaTiros(
          'Tiros de 2',
          estadisticasAMostrar.tirosDos.anotados,
          estadisticasAMostrar.tirosDos.fallados
        )}
        {renderEstadisticaTiros(
          'Tiros de 3',
          estadisticasAMostrar.tirosTres.anotados,
          estadisticasAMostrar.tirosTres.fallados
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardDefault,
          borderColor: theme.border.secondary,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.botonesContainer}>{renderBotones()}</View>
      {renderContenidoEstadisticas()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  botonesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  botonCompeticion: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    marginRight: 8,
  },
  textoBoton: { fontWeight: '500' },
  contenidoEstadisticas: { paddingHorizontal: 16 },
  estadisticasSimples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  estadisticaItem: {
    width: '48%',
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
  },
  tituloEstadistica: { fontSize: 12, marginBottom: 4 },
  valorEstadistica: { fontSize: 16, fontWeight: 'bold' },
  estadisticaGrupo: { marginBottom: 16 },
  tituloGrupo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  estadisticaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noData: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});
