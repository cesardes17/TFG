import { ScrollView, View } from 'react-native';
import StyledAlert from '../../components/common/StyledAlert';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { temporadaService } from '../../services/temporadaService';
import { useState } from 'react';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';

import LoadingIndicator from '../../components/common/LoadingIndicator';
import TablaAdminEquipos from '../../components/admin/TablaEquiposAdmin';
import AdministracionCompeticiones from '../../components/admin/AdministracionCompeticiones';
import StyledButton from '../../components/common/StyledButton';

export default function PanelControlScreen() {
  const { temporada, refetchTemporada } = useTemporadaContext();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const handleCreateTemporada = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setShowLoading(true);
    setLoadingMessage('Creando Temporada...');

    const { success, data, errorMessage } =
      await temporadaService.createTemporada();

    if (!success || !data) {
      setError(errorMessage || 'Ocurrió un error al crear la temporada');
    } else {
      setError('');
      setShowModal(false);
    }
    await refetchTemporada();
    setShowLoading(false);
    setLoadingMessage('');
  };

  if (showLoading) {
    return <LoadingIndicator text={loadingMessage} />;
  }

  if (!temporada) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {error && <StyledAlert variant='error' message={error} />}
        <StyledAlert
          variant='info'
          message='No hay Temporada activa. Para poder operar crea una temporda nueva'
        />
        <StyledButton title='Crear Temporada' onPress={handleCreateTemporada} />
        <BaseConfirmationModal
          visible={showModal}
          title='Crear Nueva Temporada'
          description='¿Estás seguro de que deseas crear una nueva temporada?'
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          type='create'
        />
      </View>
    );
  }
  return (
    <View>
      <AdministracionCompeticiones
        setLoading={setShowLoading}
        setLoadingText={setLoadingMessage}
      />
      <TablaAdminEquipos />
    </View>
  );
}
