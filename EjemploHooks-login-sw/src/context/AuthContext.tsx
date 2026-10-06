import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { usuarios, Usuario } from "../data/usuarios";

type AuthContextValue = {
  usuarioActivo: Usuario | null;
  iniciarSesion: (nombreUsuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);

  // useCallback conserva esta funcion entre renderizados mientras sus dependencias no cambien.
  const iniciarSesion = useCallback((nombreUsuario: string, clave: string) => {
    const usuario = usuarios.find(
      (item) => item.nombreUsuario === nombreUsuario.trim().toLowerCase() && item.clave === clave,
    );

    setUsuarioActivo(usuario ?? null);
    return Boolean(usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    setUsuarioActivo(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuarioActivo, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return contexto;
}
