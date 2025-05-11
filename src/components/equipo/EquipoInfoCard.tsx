import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';
import { useTheme } from '../../contexts/ThemeContext';

// Define the type for our component props
type TeamCardProps = {
  nombre: string;
  escudoUrl: string;
  capitan: {
    nombre: string;
    apellidos: string;
    correo: string;
  };
};

export default function EquipoInfoCard({
  nombre,
  escudoUrl,
  capitan,
}: TeamCardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { borderColor: theme.border.secondary }]}>
      <View style={styles.cardContent}>
        <ProgressiveImage
          uri={escudoUrl}
          containerStyle={styles.crest}
          resizeMode='contain'
        />
        <View style={styles.textContainer}>
          <StyledText style={styles.teamName}>{nombre}</StyledText>
          <StyledText style={styles.captainName}>
            {capitan.nombre} {capitan.apellidos}
          </StyledText>
          <StyledText style={styles.captainEmail}>{capitan.correo}</StyledText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crest: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '700',

    marginBottom: 8,
  },
  captainName: {
    fontSize: 16,
    fontWeight: '500',

    marginBottom: 4,
  },
  captainEmail: {
    fontSize: 14,
  },
});
