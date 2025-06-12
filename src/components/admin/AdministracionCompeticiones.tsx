// src/components/administracion/AdministracionCompeticiones.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import StyledButton from '../common/StyledButton';
import StyledAlert from '../common/StyledAlert';
import BaseConfirmationModal from '../common/BaseConfirmationModal';
import { useCompeticiones } from '../../hooks/useCompeticiones';
import { useEquiposConEstado } from '../../hooks/useEquiposConEstado';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { ligaService } from '../../services/competicionService/ligaService';
import { copaService } from '../../services/competicionService/copaService';
import { playoffService } from '../../services/competicionService/playoffService';

interface Props {
  setLoading: (loading: boolean) => void;
  setLoadingText: (text: string) => void;
}

export default function AdministracionCompeticiones({
  setLoading,
  setLoadingText,
}: Props) {
  const { competicionesEstado, loadingCompeticiones, error } =
    useCompeticiones();
  const { temporada } = useTemporadaContext();
  const {
    equipos,
    equiposIncompletos,
    loading: loadingEquipos,
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

  if (!temporada) return null;

  const { liga: ligaRegular, copa, playoffs } = competicionesEstado;

  const handleCrearLiga = async () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    setLoading(true);
    setLoadingText('Creando Liga...');

    const idsEquiposIncompletos = equiposIncompletos.map((e) => e.id);
    const equiposCompletos = equipos
      .filter((e) => e.cumple)
      .map((e) => ({ id: e.id, nombre: e.nombre, escudoUrl: e.escudoUrl }));

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
    setModalConfig((prev) => ({ ...prev, visible: false }));
    setLoading(true);
    setLoadingText('Creando Copa...');

    const res = await copaService.crear(temporada.id, setLoadingText);
    if (!res.success) console.error('Error al crear Copa:', res.errorMessage);

    setLoading(false);
    setLoadingText('');
  };

  const handleCrearPlayOffs = async () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    setLoading(true);
    setLoadingText('Creando Playoffs...');

    const res = await playoffService.crear(temporada.id, setLoadingText);
    if (!res.success)
      console.error('Error al crear Playoffs:', res.errorMessage);

    setLoading(false);
    setLoadingText('');
  };

  const abrirModal = (
    title: string,
    description: string,
    onConfirm: () => void
  ) => {
    setModalConfig({ visible: true, title, description, onConfirm });
  };

  return (
    <View style={{ marginTop: 12 }}>
      {!ligaRegular.created && (
        <View style={{ paddingVertical: 12 }}>
          <StyledButton
            title='Crear Liga'
            disabled={loadingEquipos || loadingCompeticiones}
            onPress={() =>
              abrirModal(
                'Crear Liga',
                equiposIncompletos.length > 0
                  ? `Los equipos ${equiposIncompletos
                      .map((e) => e.nombre)
                      .join(
                        ', '
                      )} están incompletos. Se disolverán. ¿Continuar?`
                  : '¿Estás seguro de crear una nueva liga?',
                handleCrearLiga
              )
            }
          />
        </View>
      )}

      {ligaRegular.created && !copa.created && (
        <View style={{ paddingVertical: 12 }}>
          <StyledButton
            title='Crear Copa'
            disabled={loadingCompeticiones}
            onPress={() =>
              abrirModal(
                'Crear Copa',
                '¿Deseas generar el cuadro de Copa con los 8 mejores?',
                handleCrearCopa
              )
            }
          />
        </View>
      )}

      {ligaRegular.finalized && !playoffs.created && (
        <View style={{ paddingVertical: 12 }}>
          <StyledButton
            title='Crear Playoffs'
            disabled={loadingCompeticiones}
            onPress={() =>
              abrirModal(
                'Crear Playoffs',
                '¿Estás seguro de que deseas crear los Playoffs?',
                handleCrearPlayOffs
              )
            }
          />
        </View>
      )}

      {(ligaRegular.created || copa.created || playoffs.created) && (
        <View style={{ flexDirection: 'row', gap: 12, paddingTop: 24 }}>
          {ligaRegular.created && (
            <StyledButton
              title={
                ligaRegular.data?.estado === 'en-curso'
                  ? 'Pausar Liga'
                  : 'Reanudar Liga'
              }
              onPress={async () => {
                setLoading(true);
                setLoadingText(
                  ligaRegular.data?.estado === 'en-curso'
                    ? 'Pausando Liga...'
                    : 'Reanudando Liga...'
                );
                if (ligaRegular.data?.estado === 'en-curso') {
                  await ligaService.pausar(temporada.id);
                } else {
                  await ligaService.reanudar(temporada.id);
                }
                setLoading(false);
                setLoadingText('');
              }}
            />
          )}

          {copa.created && (
            <StyledButton
              title={
                copa.data?.estado === 'en-curso'
                  ? 'Pausar Copa'
                  : 'Reanudar Copa'
              }
              onPress={async () => {
                setLoading(true);
                setLoadingText(
                  copa.data?.estado === 'en-curso'
                    ? 'Pausando Copa...'
                    : 'Reanudando Copa...'
                );
                if (copa.data?.estado === 'en-curso') {
                  await copaService.pausar(temporada.id);
                } else {
                  await copaService.reanudar(temporada.id);
                }
                setLoading(false);
                setLoadingText('');
              }}
            />
          )}

          {playoffs.created && (
            <StyledButton
              title={
                playoffs.data?.estado === 'en-curso'
                  ? 'Pausar Playoffs'
                  : 'Reanudar Playoffs'
              }
              onPress={async () => {
                setLoading(true);
                setLoadingText(
                  playoffs.data?.estado === 'en-curso'
                    ? 'Pausando Playoffs...'
                    : 'Reanudando Playoffs...'
                );
                if (playoffs.data?.estado === 'en-curso') {
                  await playoffService.pausar(temporada.id);
                } else {
                  await playoffService.reanudar(temporada.id);
                }
                setLoading(false);
                setLoadingText('');
              }}
            />
          )}
        </View>
      )}

      {error && <StyledAlert variant='error' message={error} />}

      <BaseConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        type='create'
        confirmLabel='Crear'
        cancelLabel='Cancelar'
      />
    </View>
  );
}
