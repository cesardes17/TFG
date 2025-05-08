import { ActivityIndicator, Button, View } from 'react-native';
import StyledAlert from '../../components/common/StyledAlert';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { temporadaService } from '../../services/temporadaService';
import { useState } from 'react';
import BaseConfirmationModal from '../../components/common/BaseConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';

export default function PanelControlScreen() {
  const { temporada, refetchTemporada } = useTemporadaContext();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState('');
  const handleCreateTemporada = () => {
    setShowModal(true);
  };

  const { theme } = useTheme();

  const handleConfirm = async () => {
    setShowModal(false);
    setShowLoading(true);

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
  };

  if (showLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' color={theme.icon.active} />
      </View>
    );
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
        <Button
          color={'#00dd00'}
          title='Crear Temporada'
          onPress={handleCreateTemporada}
        />
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
  return null;
}
