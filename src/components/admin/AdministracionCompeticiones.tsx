import { View } from 'react-native';
import { useCompeticiones } from '../../hooks/useCompeticiones';
import StyledButton from '../common/StyledButton';
import { useState } from 'react';
import { Competicion } from '../../types/Competicion';
import { getRandomUID } from '../../utils/getRandomUID';
import BaseConfirmationModal from '../common/BaseConfirmationModal';
import { useEquiposConEstado } from '../../hooks/useEquiposConEstado';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { ligaService } from '../../services/competicionService/ligaService';
import StyledAlert from '../common/StyledAlert';

interface Props {
  setLoading: (loading: boolean) => void;
  setLoadingText: (text: string) => void;
}

export default function AdministracionCompeticiones({
  setLoading,
  setLoadingText,
}: Props) {
  const { competiciones, loadingCompetciones } = useCompeticiones();
  const { temporada } = useTemporadaContext();
  const [showModal, setShowModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState('');

  const {
    equipos,
    equiposIncompletos,
    loading: loadingEquipos,
    error,
  } = useEquiposConEstado();

  if (!temporada) {
    return null;
  }

  console.log('competiciones', competiciones);
  // 🔍 Buscar la liga regular en las competiciones
  const ligaRegular = competiciones.find((c) => c.tipo === 'liga-regular');

  const handleCrearLiga = async () => {
    setShowModal(false);
    setLoading(true);
    setLoadingText('Creando Liga...');

    const liga: Competicion = {
      id: getRandomUID(),
      nombre: 'Liga',
      tipo: 'liga-regular',
      estado: 'en-curso',
      fechaInicio: new Date(),
    };

    const idsEquiposIncompletos = equiposIncompletos.map((equipo) => equipo.id);
    const equiposCompletos = equipos
      .filter((e) => e.cumple)
      .map((e) => ({
        id: e.id,
        nombre: e.nombre,
        escudoUrl: e.escudoUrl,
      }));

    await ligaService.crear(
      temporada.id,
      liga,
      idsEquiposIncompletos,
      equiposCompletos,
      setLoadingText
    );

    setLoading(false);
    setLoadingText('');
  };

  const handleModalCrearLiga = () => {
    let descripcion = '';
    if (equiposIncompletos.length > 0) {
      const nombres = equiposIncompletos.map((e) => e.nombre);
      const listado =
        nombres.length === 1
          ? nombres[0]
          : nombres.length === 2
          ? `${nombres[0]} y ${nombres[1]}`
          : `${nombres.slice(0, -1).join(', ')} y ${
              nombres[nombres.length - 1]
            }`;
      descripcion = `Los equipos ${listado} están incompletos. Si continúas, serán disueltos y sus jugadores pasarán a la agencia libre. ¿Deseas continuar?`;
    } else {
      descripcion = '¿Estás seguro de que deseas crear una liga?';
    }
    setDescriptionModal(descripcion);
    setShowModal(true);
  };

  const handleCrearCopa = async () => {
    console.log('Crear Copa');
  };

  const handleCrearPlayOffs = async () => {
    console.log('Crear Playoffs');
  };

  return (
    <View style={{ marginTop: 12 }}>
      {competiciones.length === 0 && (
        <>
          <StyledButton
            title='Crear Liga'
            disabled={loadingEquipos || loadingCompetciones}
            onPress={handleModalCrearLiga}
          />
          <BaseConfirmationModal
            visible={showModal}
            title='Crear Liga'
            description={descriptionModal}
            onConfirm={handleCrearLiga}
            onCancel={() => setShowModal(false)}
            type='create'
            confirmLabel='Crear'
            cancelLabel='Cancelar'
          />
        </>
      )}

      {/* 🏆 Botón de Crear Copa si la liga regular existe y está finalizada */}
      {ligaRegular && (
        <StyledButton
          title='Crear Copa'
          onPress={handleCrearCopa}
          disabled={loadingCompetciones}
        />
      )}

      {/* 📊  */}
      {ligaRegular && ligaRegular.estado === 'finalizada' && (
        <StyledButton
          title='Crear PlayOffs'
          onPress={handleCrearPlayOffs}
          disabled={loadingCompetciones}
        />
      )}
      {/* ⚠️ Mensaje de error si hay problemas */}
      {error && <StyledAlert variant='error' message={error} />}
    </View>
  );
}
