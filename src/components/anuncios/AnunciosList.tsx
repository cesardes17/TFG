import { useCallback, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import StyledText from '../common/StyledText';
import StyledAlert from '../common/StyledAlert';
import { Anuncio } from '../../types/Anuncio';
import { useUser } from '../../contexts/UserContext';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useFocusEffect } from 'expo-router';
import { anunciosCrudService } from '../../services/anunciosService/crudService';
import AnuncioCard from './AnuncioCard';
import AnuncioCompactoCard from './AnuncioCompactoCard';

export default function AnunciosList() {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  const fetchAnuncios = useCallback(async () => {
    if (!temporada) return;
    const res = await anunciosCrudService.getAllAnuncios(temporada.id);
    if (res.success) {
      setAnuncios(res.data!);
    } else {
      console.log(res.errorMessage);
      setAnuncios([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnuncios();
    }, [fetchAnuncios])
  );

  const renderItem = (item: Anuncio) => {
    return <AnuncioCompactoCard anuncio={item} />;
  };

  return (
    <View style={styles.listContent}>
      <FlatList
        data={anuncios}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => {
          return <StyledAlert variant='info' message='No hay Anuncios' />;
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
});
