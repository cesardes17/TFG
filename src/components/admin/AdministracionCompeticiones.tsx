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
import { copaService } from '../../services/competicionService/copaService';

interface Props {
  setLoading: (loading: boolean) => void;
  setLoadingText: (text: string) => void;
}

export default function AdministracionCompeticiones({
  setLoading,
  setLoadingText,
}: Props) {
  const { competicionesEstado, loadingCompeticiones } = useCompeticiones();
  const { temporada } = useTemporadaContext();

  const {
    equipos,
    equiposIncompletos,
    loading: loadingEquipos,
    error,
  } = useEquiposConEstado();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  if (!temporada) {
    return null;
  }

  const ligaRegular = competicionesEstado.liga;
  const copa = competicionesEstado.copa;
  const playoffs = competicionesEstado.playoffs;

  // 🎯 Método para crear liga
  const handleCrearLiga = async () => {
    setModalConfig({ ...modalConfig, visible: false });
    setLoading(true);
    setLoadingText('Creando Liga...');

    const idsEquiposIncompletos = equiposIncompletos.map((e) => e.id);
    const equiposCompletos = equipos
      .filter((e) => e.cumple)
      .map((e) => ({
        id: e.id,
        nombre: e.nombre,
        escudoUrl: e.escudoUrl,
      }));

    await ligaService.crear(
      temporada.id,
      idsEquiposIncompletos,
      equiposCompletos,
      setLoadingText
    );

    setLoading(false);
    setLoadingText('');
  };

  const handleCrearCopa = async () => {
    setModalConfig({ ...modalConfig, visible: false });
    setLoading(true);
    setLoadingText('Creando Copa...');

    const resCopa = await copaService.crear(temporada.id, setLoadingText);

    if (!resCopa.success) {
      console.error('Error al crear la Copa:', resCopa.errorMessage);
    } else {
      console.log('Copa creada correctamente');
    }

    setLoading(false);
    setLoadingText('');
  };

  const handleCrearPlayOffs = async () => {
    console.log('Crear Playoffs...');
    setModalConfig({ ...modalConfig, visible: false });
  };

  // 🟢 Modal para Liga
  const abrirModalLiga = () => {
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

    setModalConfig({
      visible: true,
      title: 'Crear Liga',
      description: descripcion,
      onConfirm: handleCrearLiga,
    });
  };

  // 🟡 Modal para Copa
  const abrirModalCopa = () => {
    setModalConfig({
      visible: true,
      title: 'Crear Copa',
      description:
        '¿Estás seguro de que deseas crear la Copa? Se generará el cuadro automáticamente con los 8 primeros clasificados.',
      onConfirm: handleCrearCopa,
    });
  };

  // 🔴 Modal para PlayOffs
  const abrirModalPlayOffs = () => {
    setModalConfig({
      visible: true,
      title: 'Crear Playoffs',
      description:
        '¿Estás seguro de que deseas crear los Playoffs? Solo es posible una vez la Liga esté finalizada.',
      onConfirm: handleCrearPlayOffs,
    });
  };

  return (
    <View style={{ marginTop: 12 }}>
      {!ligaRegular.created && (
        <StyledButton
          title='Crear Liga'
          disabled={loadingEquipos || loadingCompeticiones}
          onPress={abrirModalLiga}
        />
      )}

      {ligaRegular.created && (
        <StyledButton
          title='Crear Copa'
          onPress={abrirModalCopa}
          disabled={copa.created || loadingCompeticiones}
        />
      )}

      {ligaRegular.finalized && (
        <StyledButton
          title='Crear PlayOffs'
          onPress={abrirModalPlayOffs}
          disabled={playoffs.created || loadingCompeticiones}
        />
      )}

      {/* ⚠️ Mensaje de error si hay problemas */}
      {error && <StyledAlert variant='error' message={error} />}

      {/* 🪧 Modal Único para todo */}
      <BaseConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig({ ...modalConfig, visible: false })}
        type='create'
        confirmLabel='Crear'
        cancelLabel='Cancelar'
      />
    </View>
  );
}
