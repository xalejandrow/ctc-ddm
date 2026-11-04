import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";
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
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${saved}` },
          });
          if (!response.ok) throw new Error();
          setUser(await response.json());
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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message ?? "No se pudo iniciar sesión.");
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
