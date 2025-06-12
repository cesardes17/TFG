import type React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { CalendarIcon, TrophyIcon } from '../Icons';
import { titleCase } from '../../utils/capitalizeString';
import StyledText from '../common/StyledText';
import { useTheme } from '../../contexts/ThemeContext';
import { useCompeticiones } from '../../hooks/useCompeticiones';
import LoadingIndicator from '../common/LoadingIndicator';
import { Theme } from '../../theme/theme';

// Tipos para las competiciones
interface Competicion {
  id: string;
  nombre: string;
  fechaInicio: string;
  estado: 'pendiente' | 'en-curso' | 'finalizada';
}

// Función para formatear fecha
function formatearFecha(fecha: Date): string {
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para obtener el estilo del tipo de competición
function obtenerEstiloTipo(tipo: string) {
  switch (tipo) {
    case 'liga':
      return styles.tipoLiga;
    case 'copa':
      return styles.tipoCopa;
    case 'playoffs':
      return styles.tipoPlayoffs;
    default:
      return styles.tipoDefault;
  }
}

// Función para obtener el estilo del estado
function obtenerEstiloEstado(estado: string) {
  switch (estado) {
    case 'pendiente':
      return styles.estadoPendiente;
    case 'en-curso':
      return styles.estadoEnCurso;
    case 'finalizada':
      return styles.estadoFinalizada;
    default:
      return styles.estadoDefault;
  }
}

// Función para obtener el nombre del tipo
function obtenerNombreTipo(tipo: string): string {
  switch (tipo) {
    case 'liga':
      return 'Liga Regular';
    case 'copa':
      return 'Copa';
    case 'playoffs':
      return 'Playoffs';
    default:
      return tipo;
  }
}

// Componente Badge personalizado
function Badge({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.badge, style]}>
      <StyledText variant='dark' style={styles.badgeText}>
        {children}
      </StyledText>
    </View>
  );
}

// Componente Card personalizado
function Card({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardDefault }]}>
      {children}
    </View>
  );
}

export default function CompeticionesCards() {
  const { competicionesEstado, loadingCompeticiones } = useCompeticiones();
  const { theme } = useTheme();
  const competicionesCreadas = Object.entries(competicionesEstado)
    .filter(([_, competicion]) => competicion.created)
    .map(([tipo, competicion]) => ({
      tipo,
      ...competicion,
    }));

  if (loadingCompeticiones) {
    return (
      <View style={styles.emptyContainer}>
        <LoadingIndicator text='Cargando competiciones...' />
      </View>
    );
  }

  if (competicionesCreadas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TrophyIcon size={64} color='#9CA3AF' />
        <StyledText style={styles.emptyTitle}>
          No hay competiciones creadas
        </StyledText>
        <StyledText style={styles.emptyDescription}>
          Aún no se han creado competiciones deportivas. Las tarjetas aparecerán
          aquí una vez que se creen.
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Competiciones Activas</StyledText>
      </View>

      <View style={styles.cardsContainer}>
        {competicionesCreadas.map(({ tipo, data }) => (
          <Card key={data!.id} theme={theme}>
            <View style={styles.cardHeader}>
              <StyledText style={styles.cardTitle} numberOfLines={2}>
                {data!.nombre}
              </StyledText>
              <TrophyIcon size={20} color={theme.text.primary} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.row}>
                <StyledText variant='secondary' style={styles.label}>
                  Tipo:
                </StyledText>
                <Badge style={obtenerEstiloTipo(tipo)}>
                  {obtenerNombreTipo(tipo)}
                </Badge>
              </View>

              <View style={styles.row}>
                <StyledText variant='secondary' style={styles.label}>
                  Estado:
                </StyledText>
                <Badge style={obtenerEstiloEstado(data!.estado)}>
                  {titleCase(data!.estado.replace('-', ' '))}
                </Badge>
              </View>

              <View style={styles.row}>
                <CalendarIcon size={16} color={theme.text.secondary} />
                <StyledText variant='secondary' style={styles.label}>
                  Inicio:
                </StyledText>
                <StyledText variant='secondary' style={styles.dateText}>
                  {formatearFecha(data!.fechaInicio)}
                </StyledText>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  cardContent: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipoLiga: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
  },
  tipoCopa: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  tipoPlayoffs: {
    backgroundColor: '#FED7AA',
    borderColor: '#FDBA74',
  },
  tipoDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  estadoPendiente: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  estadoEnCurso: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
  },
  estadoFinalizada: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  estadoDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',

    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
});
