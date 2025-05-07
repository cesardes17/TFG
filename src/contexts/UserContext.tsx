// src/context/UserContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import type { ResultService } from '../types/ResultService';
import { AuthService } from '../services/authService';
import { FirestoreService } from '../services/firestoreService';
import type { User } from '../types/User'; // <— importa tu tipo User

interface UserContextValue {
  user: User | null; // ahora usa User (PlayerUser u OtherUser)
  loading: boolean;
  error?: string;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Le decimos a FirestoreService que esperamos un objeto User
      const result: ResultService<User | null> =
        await FirestoreService.getDocument<User>('users', firebaseUser.uid);

      if (result.success) {
        if (result.data) {
          setUser(result.data); // ahora result.data ya cumple User
        } else {
          console.error(
            'Perfil de usuario inexistente en Firestore:',
            firebaseUser.uid
          );
          setUser(null);
        }
      } else {
        setError(result.errorMessage);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => useContext(UserContext);
