import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { apiFetch } from '../services/api';

type AuthContextType = {
  user: User | null;
  token: string | null;
  restoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = await SecureStore.getItemAsync('accessToken');
      if (!savedToken) { setRestoring(false); return; }
      try {
        const savedUser = await apiFetch<User>('/auth/me', {}, savedToken);
        setToken(savedToken);
        setUser(savedUser);
      } catch {
        await SecureStore.deleteItemAsync('accessToken');
      } finally {
        setRestoring(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: User }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync('accessToken', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function logout() {
    await SecureStore.deleteItemAsync('accessToken');
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, token, restoring, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
