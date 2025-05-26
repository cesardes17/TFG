import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import StyledText from '../common/StyledText';
import StyledAlert from '../common/StyledAlert';
import { Anuncio } from '../../types/Anuncio';
import { useUser } from '../../contexts/UserContext';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useFocusEffect } from 'expo-router';
import { anunciosService } from '../../services/anunciosService';
import AnuncioCompactoCard from './AnuncioCompactoCard';
import StyledTextInput from '../common/StyledTextInput';

export default function AnunciosList() {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();

  const [query, setQuery] = useState('');
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [filteredAnuncios, setFilteredAnuncios] = useState<Anuncio[]>([]); //anuncios filtrados por busqueda

  const fetchAnuncios = useCallback(async () => {
    if (!temporada) return;
    const res = await anunciosService.getAllAnuncios(temporada.id);
    if (res.success && res.data) {
      setAnuncios(res.data);
      setFilteredAnuncios(res.data);
    } else {
      console.log(res.errorMessage);
      setAnuncios([]);
    }
  }, []);

  useEffect(() => {
    const filtered = anuncios.filter((anuncio) => {
      const titleMatch = anuncio.titulo
        .toLowerCase()
        .includes(query.toLowerCase());
      const descriptionMatch = anuncio.contenido
        .toLowerCase()
        .includes(query.toLowerCase());
      return titleMatch || descriptionMatch;
    });

    setFilteredAnuncios(filtered);
  }, [query]);

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
      <StyledTextInput
        placeholder='Buscar Anuncios'
        value={query}
        onChangeText={setQuery}
      />

      {filteredAnuncios.length === 0 ? (
        <StyledAlert variant='info' message='No hay Anuncios' />
      ) : (
        filteredAnuncios.map((anuncio) => (
          <AnuncioCompactoCard key={anuncio.id} anuncio={anuncio} />
        ))
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
});
