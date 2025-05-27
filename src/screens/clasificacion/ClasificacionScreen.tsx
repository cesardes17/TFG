import TablaClasificacion from '../../components/clasificacion/TablaClasificacion';
import { useClasificacion } from '../../hooks/useClasificacion';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import StyledAlert from '../../components/common/StyledAlert';
import { useTemporadaContext } from '../../contexts/TemporadaContext';

export default function ClasificacionScreen() {
  const { temporada } = useTemporadaContext();

  const { clasificacion, loading, error } = useClasificacion();

  if (loading) {
    return <LoadingIndicator text='Obteniendo Clasificación...' />;
  }

  if (error) {
    return <StyledAlert message={error} variant='error' />;
  }

  if (clasificacion.length === 0) {
    return (
      <StyledAlert
        message='No se encontraron datos de clasificación'
        variant='warning'
      />
    );
  }

  return <TablaClasificacion data={clasificacion} />;
}
