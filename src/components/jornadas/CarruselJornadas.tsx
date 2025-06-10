import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from '../common/StyledText';

// Tipos
export interface JornadaSelectable {
  id: string;
  label: string;
}

interface CarruselJornadasProps {
  jornadas: JornadaSelectable[];
  jornadaSeleccionada: string;
  onSeleccionarJornada: (id: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 120; // Ancho aproximado de cada item
const ITEM_MARGIN = 8; // Margen entre items

const CarruselJornadas: React.FC<CarruselJornadasProps> = ({
  jornadas,
  jornadaSeleccionada,
  onSeleccionarJornada,
}) => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList<JornadaSelectable>>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);

  // Función para obtener el layout de cada item
  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_WIDTH + ITEM_MARGIN * 2,
    offset: (ITEM_WIDTH + ITEM_MARGIN * 2) * index,
    index,
  });

  // Scroll inicial a la jornada seleccionada
  useEffect(() => {
    if (!hasScrolledInitially && jornadas.length > 0 && jornadaSeleccionada) {
      const selectedIndex = jornadas.findIndex(
        (jornada) => jornada.id === jornadaSeleccionada
      );

      if (selectedIndex !== -1 && flatListRef.current) {
        // Pequeño delay para asegurar que el FlatList esté completamente montado
        setTimeout(() => {
          try {
            flatListRef.current?.scrollToIndex({
              index: selectedIndex,
              animated: true,
              viewPosition: 0.5, // Centrar el item
            });
            setHasScrolledInitially(true);
          } catch (error) {
            console.warn('Error al hacer scroll inicial:', error);
            // Fallback: scroll por offset
            const offset = selectedIndex * (ITEM_WIDTH + ITEM_MARGIN * 2);
            flatListRef.current?.scrollToOffset({
              offset: Math.max(0, offset - screenWidth / 2),
              animated: true,
            });
            setHasScrolledInitially(true);
          }
        }, 100);
      }
    }
  }, [jornadas, jornadaSeleccionada, hasScrolledInitially]);

  // Renderizar cada item del carrusel
  const renderJornada: ListRenderItem<JornadaSelectable> = ({ item }) => {
    const isSelected = item.id === jornadaSeleccionada;

    return (
      <TouchableOpacity
        style={[
          styles.jornadaButton,
          {
            backgroundColor: isSelected
              ? theme.button.primary.background
              : 'transparent',
            borderColor: isSelected
              ? theme.border.primary
              : theme.border.secondary,
          },
        ]}
        onPress={() => onSeleccionarJornada(item.id)}
        activeOpacity={0.7}
      >
        <StyledText
          variant={isSelected ? 'light' : 'primary'}
          style={[styles.jornadaText]}
          numberOfLines={2}
        >
          {item.label}
        </StyledText>
      </TouchableOpacity>
    );
  };

  // Manejar errores de scroll
  const handleScrollToIndexFailed = (info: any) => {
    console.warn('ScrollToIndex failed:', info);
    // Fallback: scroll por offset
    const offset = info.index * (ITEM_WIDTH + ITEM_MARGIN * 2);
    flatListRef.current?.scrollToOffset({
      offset: Math.max(0, offset - screenWidth / 2),
      animated: true,
    });
  };

  // Validación de props
  if (!jornadas || jornadas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay jornadas disponibles</Text>
      </View>
    );
  }

  // Calcular si necesita scroll horizontal
  const totalWidth = jornadas.length * (ITEM_WIDTH + ITEM_MARGIN * 2);
  const needsScroll = totalWidth > screenWidth;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={jornadas}
        renderItem={renderJornada}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        contentContainerStyle={[
          styles.flatListContent,
          !needsScroll && styles.flatListContentNoScroll,
        ]}
        // Optimizaciones de rendimiento
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        // Configuración de scroll
        decelerationRate='fast'
        snapToInterval={needsScroll ? ITEM_WIDTH + ITEM_MARGIN * 2 : undefined}
        snapToAlignment='start'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
  flatListContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  flatListContentNoScroll: {
    justifyContent: 'flex-start',
    flexGrow: 0,
  },
  jornadaButton: {
    width: ITEM_WIDTH,
    height: 44,
    marginHorizontal: ITEM_MARGIN,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jornadaText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});

export default CarruselJornadas;
