import { useStorageState } from '@/hooks/useStorageState';
import { DEMO_CREDENTIALS, DEMO_USER } from '@/data/users';
import type { User } from '@/lib/types';
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  session: string | null;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => false,
  signOut: () => {},
  session: null,
  isLoading: false,
  user: null,
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (
            email.toLowerCase() === DEMO_CREDENTIALS.email &&
            password === DEMO_CREDENTIALS.password
          ) {
            setSession('demo-session-token');
            return true;
          }
          return false;
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        user: session ? DEMO_USER : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
