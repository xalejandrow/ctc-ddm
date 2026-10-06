import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";

type Pelicula = {
  episode_id: number;
  title: string;
  director: string;
  release_date: string;
};

type Estado = {
  peliculas: Pelicula[];
  cargando: boolean;
  error: string;
};

type Accion =
  | { type: "CARGA_INICIADA" }
  | { type: "CARGA_EXITOSA"; peliculas: Pelicula[] }
  | { type: "CARGA_FALLIDA"; error: string };

const estadoInicial: Estado = { peliculas: [], cargando: true, error: "" };

// useReducer concentra las transiciones de estado de la consulta HTTP.
function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case "CARGA_INICIADA":
      return { ...estado, cargando: true, error: "" };
    case "CARGA_EXITOSA":
      return { peliculas: accion.peliculas, cargando: false, error: "" };
    case "CARGA_FALLIDA":
      return { ...estado, cargando: false, error: accion.error };
  }
}

export function PeliculasList() {
  const { usuarioActivo, cerrarSesion } = useAuth();
  const [estado, dispatch] = useReducer(reducer, estadoInicial);
  const [busqueda, setBusqueda] = useState("");
  const [intento, setIntento] = useState(0);

  // useEffect consulta al montar el listado y cada vez que el usuario pide reintentar.
  useEffect(() => {
    const controller = new AbortController();

    const cargarPeliculas = async () => {
      dispatch({ type: "CARGA_INICIADA" });
      try {
        const respuesta = await fetch("https://swapi.py4e.com/api/films/", {
          signal: controller.signal,
        });
        if (!respuesta.ok) throw new Error("La API no respondio correctamente.");

        const datos: { results: Pelicula[] } = await respuesta.json();
        dispatch({ type: "CARGA_EXITOSA", peliculas: datos.results });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          dispatch({ type: "CARGA_FALLIDA", error: "No fue posible cargar las peliculas." });
        }
      }
    };

    cargarPeliculas();
    return () => controller.abort();
  }, [intento]);

  // useMemo evita filtrar nuevamente si no cambiaron la lista ni el texto de busqueda.
  const peliculasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return estado.peliculas
      .filter((pelicula) => pelicula.title.toLowerCase().includes(texto))
      .sort((a, b) => a.episode_id - b.episode_id);
  }, [busqueda, estado.peliculas]);

  // useCallback mantiene referencias estables para las props de FlatList.
  const renderizarPelicula = useCallback(({ item }: { item: Pelicula }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.tituloPelicula}>Episodio {item.episode_id}: {item.title}</Text>
      <Text>Director: {item.director}</Text>
      <Text>Estreno: {item.release_date}</Text>
    </View>
  ), []);

  const obtenerClave = useCallback((item: Pelicula) => String(item.episode_id), []);

  if (estado.cargando) {
    return <View style={styles.centrado}><ActivityIndicator size="large" /></View>;
  }

  if (estado.error) {
    return (
      <View style={styles.centrado}>
        <Text>{estado.error}</Text>
        <Button title="Reintentar" onPress={() => setIntento((valor) => valor + 1)} />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.saludo}>Hola, {usuarioActivo?.nombre}</Text>
        <Button title="Salir" onPress={cerrarSesion} />
      </View>
      <TextInput
        autoCapitalize="none"
        placeholder="Filtrar por titulo"
        style={styles.buscador}
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <FlatList
        data={peliculasFiltradas}
        keyExtractor={obtenerClave}
        renderItem={renderizarPelicula}
        ListEmptyComponent={<Text>No hay peliculas que coincidan.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, gap: 12 },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  saludo: { fontSize: 20, fontWeight: "700" },
  buscador: { borderWidth: 1, borderColor: "#9ca3af", borderRadius: 8, padding: 12 },
  tarjeta: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 14, marginBottom: 10, gap: 4 },
  tituloPelicula: { fontWeight: "700" },
});
