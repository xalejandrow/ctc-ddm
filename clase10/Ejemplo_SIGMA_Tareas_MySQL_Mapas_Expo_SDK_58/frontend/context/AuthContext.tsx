import { createContext, useContext, useState } from "react";
import { request, setToken } from "@/services/http";
import { User } from "@/types/task";
type Auth = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<Auth>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await request<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setToken("");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
