import type React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import { CircleCheckIcon, SendIcon } from '../Icons';
import { BolsaJugador } from '../../types/BolsaJugador';
import { capitalizeFirst } from '../../utils/capitalizeString';

interface Jugador {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  dorsal: number;
  posicion: string;
  altura: number;
  peso: number;
  photoURL: string;
}

interface PlayerCardProps {
  jugador: Jugador;
  solicitudEnviada: boolean;
  onEnviarSolicitud: () => void;
  usuarioActualId?: string;
  isAdmin?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  jugador,
  solicitudEnviada,
  onEnviarSolicitud,
  usuarioActualId,
  isAdmin,
}) => {
  const { theme } = useTheme();
  if (usuarioActualId === jugador.id) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.cardDefault }]}>
      <Image source={{ uri: jugador.photoURL }} style={styles.photo} />

      <View style={styles.infoContainer}>
        <StyledText style={[styles.name, { color: theme.text.primary }]}>
          {jugador.nombre} {jugador.apellidos}
        </StyledText>
        <StyledText style={[styles.email, { color: theme.text.secondary }]}>
          {jugador.correo}
        </StyledText>

        <View style={styles.statsContainer}>
          <StyledText style={styles.stat}>
            <StyledText style={styles.statLabel}>Dorsal: </StyledText>
            {jugador.dorsal}
          </StyledText>
          <StyledText style={styles.stat}>
            <StyledText style={styles.statLabel}>Posición: </StyledText>
            {capitalizeFirst(jugador.posicion)}
          </StyledText>
          <StyledText style={styles.stat}>
            <StyledText style={styles.statLabel}>Altura: </StyledText>
            {jugador.altura} cm
          </StyledText>
          <StyledText style={styles.stat}>
            <StyledText style={styles.statLabel}>Peso: </StyledText>
            {jugador.peso} kg
          </StyledText>
        </View>

        {!isAdmin && (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: solicitudEnviada
                  ? theme.border.secondary
                  : theme.background.navigation,
              },
            ]}
            onPress={onEnviarSolicitud}
            disabled={solicitudEnviada}
          >
            {solicitudEnviada ? (
              <CircleCheckIcon size={20} color={theme.text.primary} />
            ) : (
              <SendIcon size={20} color={theme.text.light} />
            )}
            <StyledText
              style={{
                color: solicitudEnviada ? theme.text.primary : theme.text.light,
                fontWeight: '600',
              }}
            >
              {solicitudEnviada ? 'Solicitud enviada' : 'Enviar solicitud'}
            </StyledText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  statsContainer: {
    marginVertical: 6,
    gap: 2,
  },
  stat: {
    fontSize: 13,
  },
  statLabel: {
    fontWeight: '500',
    color: '#888',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
  },
});

export default PlayerCard;
