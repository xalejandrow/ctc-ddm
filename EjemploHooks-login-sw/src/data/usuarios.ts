export type Usuario = {
  id: string;
  nombre: string;
  nombreUsuario: string;
};

type UsuarioConClave = Usuario & {
  clave: string;
};

// Datos locales solo para el ejemplo. En una aplicacion real la validacion se hace en un servidor.
export const usuarios: UsuarioConClave[] = [
  { id: "1", nombre: "Leia Organa", nombreUsuario: "leia", clave: "rebeldes" },
  { id: "2", nombre: "Luke Skywalker", nombreUsuario: "luke", clave: "fuerza" },
  { id: "3", nombre: "Han Solo", nombreUsuario: "han", clave: "halcon" },
];
