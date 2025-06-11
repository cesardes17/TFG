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

  if (!temporada) return null;

  const { liga: ligaRegular, copa, playoffs } = competicionesEstado;

  // Crear Liga
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

  // Crear Copa
  const handleCrearCopa = async () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    setLoading(true);
    setLoadingText('Creando Copa...');

    const res = await copaService.crear(temporada.id, setLoadingText);
    if (!res.success) console.error('Error al crear Copa:', res.errorMessage);

    setLoading(false);
    setLoadingText('');
  };

  // Crear Playoffs
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
