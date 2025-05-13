// src/context/UserContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

import { AuthService } from '../services/core/authService';

import type { User } from '../types/User'; // <— importa tu tipo User
import { UserService } from '../services/userService';

interface UserContextValue {
  user: User | null; // ahora usa User (PlayerUser u OtherUser)
  loading: boolean;
  error?: string;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  refetchUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadUserProfile = async (uid: string) => {
    const MAX_RETRIES = 10;
    let retries = 0;
    let result;
    do {
      result = await UserService.getUserProfile(uid);
      if (result.success && result.data) {
        setUser(result.data);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
      retries++;
    } while (retries < MAX_RETRIES);

    console.error('Perfil de usuario no encontrado tras registro:', uid);
    setUser(null);
  };

  const refetchUser = async () => {
    if (!user?.uid) return;
    await loadUserProfile(user.uid); // ✅ Recargar desde Firestore
  };

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      await loadUserProfile(fbUser.uid);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => useContext(UserContext);
