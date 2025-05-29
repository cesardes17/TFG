import { View } from 'react-native';
import EditarPartidoForm from '../../components/forms/partido/EditarPartidoForm';
import usePartido from '../../hooks/usePartido';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import StyledAlert from '../../components/common/StyledAlert';
import { TipoCompeticion } from '../../types/Competicion';

export default function EditarPartidoScreen({
  idPartido,
  tipoCompeticion,
}: {
  idPartido: string;
  tipoCompeticion: TipoCompeticion;
}) {
  const { partido, isLoading, error } = usePartido(idPartido, tipoCompeticion);

  if (isLoading) {
    return <LoadingIndicator text='Cargando partido...' />;
  }

  if (error || !partido) {
    return (
      <View style={{ padding: 8 }}>
        <StyledAlert
          variant='error'
          message={error || 'Error al obtener el partido...'}
        />
      </View>
    );
  }
  return (
    <View>
      <EditarPartidoForm partido={partido} />
    </View>
  );
}
