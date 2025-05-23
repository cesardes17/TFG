import { useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';

import { useUser } from '../../contexts/UserContext';
import StyledAlert from '../../components/common/StyledAlert';
import editPerfilHelper from '../../utils/editPerfilHelper';
import { useToast } from '../../contexts/ToastContext';
import { router } from 'expo-router';
import { View } from 'react-native';
import PerfilForm, {
  ValoresFormulario,
} from '../../components/forms/auth/PerfilForm';

export default function EditarPerfilScreen() {
  const { user, loadingUser } = useUser();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState('Cargando perfil...');

  if (loadingUser) return null;
  if (!user) return null;

  const manejarEnvio = async (valores: ValoresFormulario) => {
    setIsLoading(true);
    setIsLoadingText('Editando perfil...');
    const res = await editPerfilHelper(user, valores, updateLoadingText);
    showToast(res.message, res.type);
    setIsLoadingText('');
    setIsLoading(false);
    if (res.type === 'success') {
      return router.back();
    }
    return null;
  };

  const updateLoadingText = (text: string) => {
    setIsLoadingText(text);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator text={isLoadingText} />
      </View>
    );
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
    imagenExistente: false,
  };

  if (user.rol === 'jugador') {
    valoresIniciales = {
      ...valoresIniciales,
      altura: user.altura.toString(),
      peso: user.peso.toString(),
      posicionPreferida: user.posicion,
      dorsalPreferido: user.dorsal.toString(),
      imagenPerfil: '',
      imagenExistente: true,
    };
  }

  return (
    <PerfilForm
      setIsLoading={setIsLoading}
      setLoadingText={setIsLoadingText}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
    />
  );
}
