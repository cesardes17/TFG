import { View } from 'react-native';
import StyledText from '../common/StyledText';
import { Solicitud, solicitudCrearEquipo } from '../../types/Solicitud';
import CrearEquipoCard from './CrearEquipoCard';

interface solicitudCardProps {
  solicitud: Solicitud;
}

export default function SolicitudCard({ solicitud }: solicitudCardProps) {
  const renderSolicitud = () => {
    switch (solicitud.tipo) {
      case 'Crear Equipo':
        return (
          <CrearEquipoCard solicitud={solicitud as solicitudCrearEquipo} />
        );
      default:
        return (
          <View>
            <StyledText>Tipo de solicitud no soportado</StyledText>
          </View>
        );
    }
  };

  return renderSolicitud();
}
