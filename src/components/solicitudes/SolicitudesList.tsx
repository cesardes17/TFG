import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BaseSolicitudService } from '../../services/solicitudesService';
import { useTemporadaContext } from '../../contexts/TemporadaContext';
import { useUser } from '../../contexts/UserContext';
import type { WhereFilterOp } from 'firebase/firestore';
import { FlatList, StyleSheet, View } from 'react-native';
import StyledAlert from '../common/StyledAlert';
import { Solicitud } from '../../types/Solicitud';
import SolicitudCard from './SolicitudCard';
import BaseConfirmationModal, {
  ConfirmationType,
} from '../common/BaseConfirmationModal';
import StyledText from '../common/StyledText';
import StyledTextInput from '../common/StyledTextInput';

interface SolicitudesListProps {
  screenLoading: (isLoading: boolean) => void;
}

export default function SolicitudesList({
  screenLoading,
}: SolicitudesListProps) {
  const { temporada } = useTemporadaContext();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [inputModal, setInputModal] = useState('');
  const [inputError, setInputError] = useState('');
  const [mostrarInputModal, setMostrarInputModal] = useState(false);
  const [modalType, setModalType] = useState<ConfirmationType>('update');

  const isAdmin =
    user?.role === 'organizador' || user?.role === 'coorganizador';

  const fetchSolicitudes = useCallback(async () => {
    if (!temporada) return;

    // Construye tus filtros AND / OR
    const andFilters: [string, WhereFilterOp, any][] = [];
    const orFilters: [string, WhereFilterOp, any][] = !isAdmin
      ? [
          ['solicitante.id', '==', user!.uid],
          ['jugadorObjetivo.id', '==', user!.uid],
          ['capitanObjetivo.id', '==', user!.uid],
        ]
      : [];

    const res = await BaseSolicitudService.getSolicitudesWithFilters(
      temporada.id,
      andFilters,
      orFilters
    );

    if (res.success) {
      const filteredSolicitudes = res.data || [];
      setSolicitudes(filteredSolicitudes);
    }
  }, [temporada?.id, user?.uid, isAdmin]);

  useFocusEffect(
    useCallback(() => {
      screenLoading(true);
      fetchSolicitudes();
      screenLoading(false);
      // opcional: return () => { cancelar peticiones si usas abortController }
    }, [fetchSolicitudes])
  );

  const onAcept = (solicitud: Solicitud) => {
    console.log('aceptar Solicitud: ', solicitud);
  };
  const onRechazar = (solicitud: Solicitud) => {
    console.log('rechazar Solicitud: ', solicitud);
  };

  const handleConfirm = () => {};

  const renderInputModal = () => {
    return (
      <StyledTextInput
        multiline
        placeholder='Introduce el motivo de rechazo'
        value={inputModal}
        onChangeText={setInputModal}
        error={!!inputError}
      />
    );
  };

  const renderItem = ({ item }: { item: Solicitud }) => {
    return (
      <SolicitudCard
        solicitud={item}
        onAceptar={onAcept}
        onRechazar={onRechazar}
      />
    );
  };
  return (
    <>
      <FlatList
        data={solicitudes}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={{ marginTop: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center' }}>
            <StyledAlert variant='info' message='No hay solicitudes' />
          </View>
        }
      />
      <BaseConfirmationModal
        visible={modalVisible}
        type={modalType}
        title={
          modalType === 'update'
            ? '¿Confirmar aceptación?'
            : '¿Motivo de rechazo?'
        }
        confirmLabel={modalType === 'update' ? 'Aceptar' : 'Rechazar'}
        cancelLabel='Cancelar'
        onCancel={() => {
          setModalVisible(false);
          setInputModal('');
        }}
        onConfirm={handleConfirm}
      >
        {mostrarInputModal && renderInputModal()}
      </BaseConfirmationModal>
    </>
  );
}
const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
});
