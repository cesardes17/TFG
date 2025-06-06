import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

export type Jornada = {
  id: string;
  label: string;
};

interface CarruselJornadasProps {
  jornadas: Jornada[];
  jornadaSeleccionada: string;
  onSeleccionarJornada: (id: string) => void;
}

export default function CarruselJornadas({
  jornadas,
  jornadaSeleccionada,
  onSeleccionarJornada,
}: CarruselJornadasProps) {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  // Centrar la jornada seleccionada
  useEffect(() => {
    const index = jornadas.findIndex((j) => j.id === jornadaSeleccionada);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // centra el elemento
      });
    }
  }, [jornadaSeleccionada, jornadas]);

  const renderJornada = ({ item }: { item: Jornada }) => {
    const isSelected = jornadaSeleccionada === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.jornadaButton,
          {
            backgroundColor: isSelected
              ? theme.button.primary.background
              : 'transparent',
            borderColor: isSelected
              ? theme.button.primary.border
              : theme.border.secondary,
          },
        ]}
        onPress={() => onSeleccionarJornada(item.id)}
      >
        <Text
          style={[
            styles.jornadaButtonText,
            {
              color: isSelected
                ? theme.button.primary.text
                : theme.text.secondary,
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.carruselContainer, { borderColor: theme.border.primary }]}
    >
      <FlatList
        ref={flatListRef}
        data={jornadas}
        renderItem={renderJornada}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carruselContent}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        getItemLayout={(_, index) => ({
          length: isTablet ? 70 : 60, // ajusta según tamaño real
          offset: (isTablet ? 70 : 60 + 8) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carruselContainer: {
    margin: 16,
  },
  carruselContent: {
    paddingHorizontal: 16,
  },
  jornadaButton: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  jornadaButtonText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
  },
});
