import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "../services/api";
import { User } from "../types";
type Context = {
  user: User | null;
  token: string | null;
  restoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<Context | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);
  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync("accessToken");
      if (saved)
        try {
          setUser(await apiFetch<User>("/auth/me", {}, saved));
          setToken(saved);
        } catch {
          await SecureStore.deleteItemAsync("accessToken");
        } finally {
          setRestoring(false);
        }
      else setRestoring(false);
    })();
  }, []);
  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync("accessToken", data.token);
    setToken(data.token);
    setUser(data.user);
  }
  async function logout() {
    await SecureStore.deleteItemAsync("accessToken");
    setToken(null);
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, token, restoring, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth requiere AuthProvider");
  return value;
}
