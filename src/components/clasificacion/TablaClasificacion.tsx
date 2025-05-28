import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Clasificacion } from '../../types/Clasificacion';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';
import ProgressiveImage from '../common/ProgressiveImage';

interface Props {
  data: Clasificacion[];
}

export default function TablaClasificacion({ data }: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    scrollContainer: {
      width: '100%',
    },
    tableWrapper: {
      minWidth: 740, // tabla ocupa scroll si pantalla < 740
      width: width >= 740 ? '100%' : 740,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: theme.table.headerBackground,
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    dataRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.table.rowBorder,
      alignItems: 'center',
    },
    evenRow: {
      backgroundColor: theme.table.rowEvenBackground,
    },
    oddRow: {
      backgroundColor: theme.table.rowOddBackground,
    },
    posicionColumn: {
      width: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    escudoColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nombreColumn: {
      width: 150,
      paddingHorizontal: 8,
      justifyContent: 'center',
    },
    statColumn: {
      width: 40,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    escudoImage: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.background.primary,
    },
    headerText: {
      color: theme.table.headerText,
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    nombreText: {
      fontSize: 13,
      color: theme.table.rowText,
      fontWeight: '500',
      flexWrap: 'wrap',
      textAlign: 'center',
    },
    statText: {
      fontSize: 13,
      color: theme.table.rowText,
      textAlign: 'center',
      fontWeight: '400',
    },
    positiveDiff: {
      color: theme.text.success,
      fontWeight: '600',
    },
    negativeDiff: {
      color: theme.text.error,
      fontWeight: '600',
    },
  });

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.posicionColumn}>
        <StyledText style={styles.headerText}>Pos</StyledText>
      </View>
      <View style={styles.escudoColumn}>
        <StyledText style={styles.headerText}>Escudo</StyledText>
      </View>
      <View style={styles.nombreColumn}>
        <StyledText style={styles.headerText}>Nombre</StyledText>
      </View>
      {['PTS', 'PJ', 'V', 'D', 'PF', 'PC', 'DIF'].map((label) => (
        <View style={styles.statColumn} key={label}>
          <StyledText style={styles.headerText}>{label}</StyledText>
        </View>
      ))}
    </View>
  );

  const renderRow = (item: Clasificacion, index: number) => (
    <View
      key={item.id}
      style={[styles.dataRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
    >
      <View style={styles.posicionColumn}>
        <StyledText style={styles.statText}>{index + 1}</StyledText>
      </View>
      <View style={styles.escudoColumn}>
        <ProgressiveImage
          uri={item.equipo.escudoUrl}
          containerStyle={styles.escudoImage}
        />
      </View>
      <View style={styles.nombreColumn}>
        <StyledText style={styles.nombreText}>{item.equipo.nombre}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.puntos}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.partidosJugados}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.victorias}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.derrotas}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.puntosFavor}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText style={styles.statText}>{item.puntosContra}</StyledText>
      </View>
      <View style={styles.statColumn}>
        <StyledText
          style={[
            styles.statText,
            item.diferencia >= 0 ? styles.positiveDiff : styles.negativeDiff,
          ]}
        >
          {item.diferencia >= 0 ? '+' : ''}
          {item.diferencia}
        </StyledText>
      </View>
    </View>
  );

  return (
    <ScrollView
      horizontal={width < 740}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <View style={styles.tableWrapper}>
        {renderHeader()}
        {data.map((item, index) => renderRow(item, index))}
      </View>
    </ScrollView>
  );
}
