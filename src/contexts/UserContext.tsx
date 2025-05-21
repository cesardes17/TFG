import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { AuthService } from '../services/core/authService';
import { UserService } from '../services/userService';
import type { User } from '../types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextValue {
  user: User | null;
  loadingUser: boolean;
  error?: string;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loadingUser: true,
  refetchUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string>();

  /**
   * Carga el perfil desde Firestore con retry
   */
  const loadUserProfile = async (uid: string): Promise<void> => {
    setLoadingUser(true); // solo se usa aquí en el ciclo de vida inicial
    try {
      const MAX_RETRIES = 10;
      let retries = 0;
      let result;

      do {
        result = await UserService.getUserProfile(uid);
        if (result.success && result.data) {
          setUser(result.data);
          setError(undefined);

          // Si el usuario no tiene registrada la visita pero hay una en localStorage, se migra
          if (!result.data.ultimaVisitaTablon) {
            const localVisita = await AsyncStorage.getItem(
              'ultimaVisitaTablon'
            );
            if (localVisita) {
              const parsedDate = new Date(localVisita);
              await UserService.updateUserProfile(result.data.uid, {
                ultimaVisitaTablon: parsedDate,
              });
              await AsyncStorage.removeItem('ultimaVisitaTablon');
            }
          }

          break;
        }
        await new Promise((r) => setTimeout(r, 300));
        retries++;
      } while (retries < MAX_RETRIES);

      if (!result?.success || !result.data) {
        console.error('❌ No se pudo obtener el perfil de usuario');
        setUser(null);
        setError('Usuario no encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuario');
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  /**
   * Refresca el usuario manualmente desde cualquier componente
   * pero SIN afectar el `loadingUser` global ni resetear el estado
   */
  const refetchUser = async (): Promise<void> => {
    try {
      const current = await AuthService.getCurrentUser();
      if (!current?.uid) return;

      const result = await UserService.getUserProfile(current.uid);
      if (result.success && result.data) {
        setUser(result.data);
        setError(undefined);
      }
    } catch (err: any) {
      console.error('Error al refetch del usuario:', err.message);
    }
  };

  /**
   * Suscripción al estado de autenticación
   */
  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoadingUser(false);
        return;
      }
      await loadUserProfile(fbUser.uid);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        error,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => useContext(UserContext);
