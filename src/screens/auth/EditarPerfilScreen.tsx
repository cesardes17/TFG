import { StyleSheet, View } from 'react-native';
import StyledText from '../../components/common/StyledText';
import { useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EditarPerfilForm, {
  ValoresFormulario,
} from '../../components/forms/auth/EditarPerfilForm';
import { useUser } from '../../contexts/UserContext';
import StyledAlert from '../../components/common/StyledAlert';

export default function EditarPerfilScreen() {
  const { user, loadingUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('Cargando perfil...');

  if (loadingUser) return null;
  if (!user) return null;

  if (isLoading) {
    return <LoadingIndicator text={isLoadingText} />;
  }

  if (
    user.rol === 'organizador' ||
    user.rol === 'coorganizador' ||
    user.rol === 'arbitro' ||
    user.rol === 'capitan'
  ) {
    return (
      <StyledAlert
        variant='warning'
        message='Con tu rol actual no puedes editar tu perfil'
      />
    );
  }
  let valoresIniciales: ValoresFormulario = {
    nombre: user.nombre,
    apellidos: user.apellidos,
    rol: user.rol,
    altura: '',
    peso: '',
    posicionPreferida: '',
    dorsalPreferido: '',
    imagenPerfil: '',
  };

  if (user.rol === 'jugador') {
    valoresIniciales = {
      ...valoresIniciales,
      altura: user.altura.toString(),
      peso: user.peso.toString(),
      posicionPreferida: '',
      dorsalPreferido: user.dorsal.toString(),
      imagenPerfil: '',
    };
  }

  return (
    <EditarPerfilForm
      setIsLoading={setIsLoading}
      setLoadingText={setIsLoadingText}
      valoresIniciales={valoresIniciales}
    />
  );
}
