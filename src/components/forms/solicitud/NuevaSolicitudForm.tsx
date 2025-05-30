// src/components/forms/solicitud/NuevaSolicitudForm.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { useTheme } from '../../../contexts/ThemeContext';
import ImagePicker from '../../common/ImagePicker';
import SelectableCardGroup from '../../common/SelectableCardGroup';
import StyledText from '../../common/StyledText';
import InputFormik from '../InputFormik';
import StyledAlert from '../../common/StyledAlert';
import {
  solicitudCrearEquipo,
  solicitudDisolverEquipo,
  solicitudSalirEquipo,
} from '../../../types/Solicitud';
import { BaseSolicitudService } from '../../../services/solicitudesService';
import { getRandomUID } from '../../../utils/getRandomUID';
import { useTemporadaContext } from '../../../contexts/TemporadaContext';
import { useToast } from '../../../contexts/ToastContext';
import { router } from 'expo-router';
import { useUser } from '../../../contexts/UserContext';
import { PlayerProfile, PlayerUser } from '../../../types/User';
import { equipoService } from '../../../services/equipoService';
import { UserService } from '../../../services/userService';
import LoadingIndicator from '../../common/LoadingIndicator';

export type SolicitudTipo = 'createTeam' | 'leaveTeam' | 'dissolveTeam';

const opcionesBase = {
  createTeam: {
    label: 'Crear equipo',
    description: 'Solicita un nuevo equipo',
  },
  leaveTeam: {
    label: 'Salir de equipo',
    description: 'Solicita abandonar tu equipo',
  },
  dissolveTeam: {
    label: 'Disolver equipo',
    description: 'Propón disolver un equipo',
  },
};

interface Props {
  opcionesPermitidas: SolicitudTipo[];
}

interface FormValues {
  teamName?: string;
  joinTeamId?: string;
  leaveReason?: string;
  dissolveReason?: string;
  teamLogo?: string;
}

export default function NuevaSolicitudForm({ opcionesPermitidas }: Props) {
  const { temporada } = useTemporadaContext();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [tipo, setTipo] = useState<SolicitudTipo | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      switch (tipo) {
        case 'createTeam': {
          const createTeamSolicitud: solicitudCrearEquipo = {
            id: getRandomUID(),
            estado: 'pendiente',
            tipo: 'Crear Equipo',
            solicitante: {
              id: user!.uid,
              nombre: user!.nombre,
              apellidos: user!.apellidos,
              correo: user!.correo,
              fotoUrl: (user as PlayerProfile).fotoUrl,
              dorsal: (user as PlayerProfile).dorsal,
            },
            fechaCreacion: new Date(),
            nombreEquipo: values.teamName || '',
            escudoUrl: values.teamLogo || '',
            escurdoPath: '',
          };

          const res = await BaseSolicitudService.setSolicitud(
            temporada!.id,
            createTeamSolicitud.id,
            createTeamSolicitud,
            setLoadingText
          );

          if (!res.success || !res.data) {
            throw new Error(res.errorMessage || 'Error creando solicitud');
          }
          showToast('Solicitud enviada', 'success');
          router.back();
          break;
        }
        case 'leaveTeam': {
          if (!values.leaveReason) {
            throw new Error('Por favor, ingresa un motivo');
          }
          const resEquipo = await equipoService.getEquipo(
            temporada!.id,
            (user as PlayerProfile)!.equipo!.id
          );
          if (!resEquipo.success || !resEquipo.data) {
            throw new Error(
              resEquipo.errorMessage ||
                'Error al obtener la informacion del equipo'
            );
          }
          const capitanRes = await UserService.getUserProfile(
            resEquipo.data.capitan.id
          );
          if (!capitanRes.success || !capitanRes.data) {
            throw new Error(
              capitanRes.errorMessage ||
                'Error al obtener la informacion del capitan'
            );
          }
          const leaveTeamSolicitud: solicitudSalirEquipo = {
            id: getRandomUID(),
            estado: 'pendiente',
            tipo: 'Salir de Equipo',
            solicitante: {
              id: user!.uid,
              nombre: user!.nombre,
              apellidos: user!.apellidos,
              correo: user!.correo,
              fotoUrl: (user as PlayerProfile).fotoUrl,
            },
            fechaCreacion: new Date(),
            motivoSalida: values.leaveReason,
            equipoActual: (user as PlayerProfile)!.equipo!,
            capitanObjetivo: {
              id: capitanRes.data.uid,
              nombre: capitanRes.data.nombre,
              apellidos: capitanRes.data.apellidos,
              correo: capitanRes.data.correo,
              fotoUrl: (capitanRes.data as PlayerUser).fotoUrl,
            },
          };
          const res = await BaseSolicitudService.setSolicitud(
            temporada!.id,
            leaveTeamSolicitud.id,
            leaveTeamSolicitud,
            setLoadingText
          );
          if (!res.success || !res.data) {
            throw new Error(res.errorMessage || 'Error creando solicitud');
          }
          showToast('Solicitud enviada', 'success');
          router.back();
          break;
        }
        case 'dissolveTeam': {
          if (!values.dissolveReason) {
            throw new Error('Por favor, ingresa un motivo');
          }
          const solicitud: solicitudDisolverEquipo = {
            id: getRandomUID(),
            estado: 'pendiente',
            tipo: 'Disolver Equipo',
            solicitante: {
              id: user!.uid,
              nombre: user!.nombre,
              apellidos: user!.apellidos,
              correo: user!.correo,
              fotoUrl: (user as PlayerProfile).fotoUrl,
            },
            fechaCreacion: new Date(),
            motivoDisolucion: values.dissolveReason,
            equipo: (user as PlayerProfile)!.equipo!,
          };
          const res = await BaseSolicitudService.setSolicitud(
            temporada!.id,
            solicitud.id,
            solicitud,
            setLoadingText
          );
          if (!res.success || !res.data) {
            throw new Error(res.errorMessage || 'Error creando solicitud');
          }
          showToast('Solicitud enviada', 'success');
          router.back();
          break;
        }
        default:
          break;
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  };

  const initialValues: FormValues = {
    teamName: '',
    joinTeamId: '',
    leaveReason: '',
    dissolveReason: '',
    teamLogo: '',
  };

  const renderForm = (
    values: FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => {
    switch (tipo) {
      case 'createTeam':
        return (
          <View style={styles.form}>
            <InputFormik name='teamName' placeholder='Nombre del equipo' />
            <ImagePicker
              placeholder='Selecciona escudo'
              onImageSelected={(uri) => setFieldValue('teamLogo', uri)}
            />
          </View>
        );
      case 'leaveTeam':
        return (
          <View style={styles.form}>
            <StyledText style={[styles.label, { color: theme.text.primary }]}>
              Motivo para salir
            </StyledText>
            <InputFormik name='leaveReason' placeholder='Motivo' />
          </View>
        );
      case 'dissolveTeam':
        return (
          <View style={styles.form}>
            <StyledText style={[styles.label, { color: theme.text.primary }]}>
              Motivo para disolver
            </StyledText>
            <InputFormik name='dissolveReason' placeholder='Motivo' />
          </View>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoadingIndicator text={loadingText} />
      </View>
    );
  }

  const opciones = opcionesPermitidas.map((key) => ({
    label: opcionesBase[key].label,
    description: opcionesBase[key].description,
    value: key,
  }));

  return (
    <>
      {error && <StyledAlert message={error} variant='error' />}
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          if (step === 1) {
            setStep(2);
          } else {
            handleSubmit(values);
          }
        }}
      >
        {({ handleSubmit: formikSubmit, values, setFieldValue }) => (
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <StyledText
                style={[styles.progress, { color: theme.text.primary }]}
              >
                Paso {step} de 2
              </StyledText>
            </View>

            <ScrollView contentContainerStyle={styles.formSection}>
              {step === 1 ? (
                <>
                  <StyledText
                    style={[styles.title, { color: theme.text.primary }]}
                  >
                    Selecciona tipo de solicitud
                  </StyledText>
                  <SelectableCardGroup
                    style={{ width: '100%' }}
                    options={opciones}
                    value={tipo}
                    onChange={(v) => setTipo(v as SolicitudTipo)}
                  />
                </>
              ) : (
                <>{renderForm(values, setFieldValue)}</>
              )}
            </ScrollView>

            <View style={styles.footerSection}>
              <View style={styles.buttonContainer}>
                {step > 1 && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.backButton,
                      { borderColor: theme.border.primary },
                    ]}
                    onPress={() => setStep(1)}
                  >
                    <StyledText
                      style={[styles.buttonText, { color: theme.text.primary }]}
                    >
                      Atrás
                    </StyledText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    step > 1 && styles.nextButton,
                    { backgroundColor: theme.icon.active },
                  ]}
                  onPress={() => formikSubmit()}
                  disabled={step === 1 && !tipo}
                >
                  <StyledText
                    style={[styles.buttonText, { color: theme.text.dark }]}
                  >
                    {step === 1 ? 'Siguiente' : 'Enviar'}
                  </StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: { marginTop: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  headerSection: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  formSection: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-start', // opcional para evitar centrado vertical si hay poco contenido
  },
  footerSection: { padding: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 120,
  },
  backButton: { backgroundColor: 'transparent' },
  nextButton: { flex: 1 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  progress: { fontSize: 14 },
});
