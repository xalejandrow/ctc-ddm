import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Region } from "react-native-maps";
import { MapaIncidencia } from "../components/MapaIncidencia";
import {
  MAXIMUM_ACCEPTABLE_ACCURACY_METERS,
  obtenerUbicacionActual,
} from "../services/locationService";
import { UbicacionIncidencia } from "../types/location";

// const REGION_COLONIA: Region = {
//   latitude: -34.31667,
//   longitude: -57.35,
//   latitudeDelta: 0.035,
//   longitudeDelta: 0.035,
// };
const REGION_COLONIA: Region = {
  latitude: -34.4626,
  longitude: -57.8398,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

// • Latitud: -34.31667° (o 34° 19′ 0″ S)
// • Longitud: -57.35° (o 57° 21′ 0″ W)

export default function MapaIncidenciaScreen() {
  const [region, setRegion] = useState<Region>(REGION_COLONIA);
  const [ubicacion, setUbicacion] = useState<UbicacionIncidencia | null>(null);
  const [mensaje, setMensaje] = useState(
    "El mapa está centrado inicialmente en Colonia."
  );
  const [isLoading, setIsLoading] = useState(false);

  const precisionAceptable = useMemo(() => {
    if (!ubicacion) return false;

    return (
      (ubicacion.accuracy ?? Number.MAX_SAFE_INTEGER) <=
      MAXIMUM_ACCEPTABLE_ACCURACY_METERS
    );
  }, [ubicacion]);

  async function manejarObtenerUbicacion() {
    setIsLoading(true);
    setMensaje("Buscando señal y calculando ubicación...");

    const resultado = await obtenerUbicacionActual();

    setIsLoading(false);

    if (!resultado.ok) {
      setMensaje(resultado.message);

      if (resultado.code === "permission_denied" && !resultado.canAskAgain) {
        Alert.alert(
          "Permiso bloqueado",
          "Para usar la ubicación debés habilitar el permiso desde los ajustes de la aplicación.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
          ]
        );
      }

      return;
    }

    setUbicacion(resultado.ubicacion);

    setRegion({
      latitude: resultado.ubicacion.latitude,
      longitude: resultado.ubicacion.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    });

    const accuracy = resultado.ubicacion.accuracy ?? 999;

    if (accuracy > MAXIMUM_ACCEPTABLE_ACCURACY_METERS) {
      setMensaje(
        `Ubicación obtenida, pero la precisión es de ${Math.round(
          accuracy
        )} m. Para esta incidencia necesitamos 50 m o menos. Intentá nuevamente.`
      );
      return;
    }

    setMensaje(
      `Ubicación lista. Precisión estimada: ${Math.round(accuracy)} m.`
    );
  }

  function usarEstaUbicacion() {
    if (!ubicacion || !precisionAceptable) return;

    Alert.alert(
      "Ubicación seleccionada",
      `Latitud: ${ubicacion.latitude.toFixed(6)}\nLongitud: ${
        ubicacion.longitude
      .toFixed(6)}\nPrecisión: ${Math.round(ubicacion.accuracy ?? 0)} m`
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ubicación de la incidencia</Text>
        <Text style={styles.subtitle}>
          Ejemplo básico SIGMA: permiso, GPS, precisión y mapa.
        </Text>

        <MapaIncidencia region={region} ubicacion={ubicacion} />

        <View style={styles.infoBox}>
          <Text style={styles.message}>{mensaje}</Text>

          {ubicacion && (
            <Text style={styles.coordinates}>
              Latitud: {ubicacion.latitude.toFixed(6)}
              {"\n"}
              Longitud: {ubicacion.longitude.toFixed(6)}
              {"\n"}
              Precisión: {Math.round(ubicacion.accuracy ?? 0)} m
            </Text>
          )}
        </View>

        <Pressable
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
          onPress={manejarObtenerUbicacion}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Obteniendo ubicación..." : "Obtener mi ubicación"}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.secondaryButton,
            !precisionAceptable && styles.disabledButton,
          ]}
          disabled={!precisionAceptable}
          onPress={usarEstaUbicacion}
        >
          <Text style={styles.secondaryButtonText}>Usar esta ubicación</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#092C4C" },
  subtitle: { fontSize: 15, color: "#587185" },
  infoBox: {
    backgroundColor: "#EFF7FB",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  message: { fontSize: 15, color: "#163247" },
  coordinates: { fontSize: 14, color: "#475569" },
  primaryButton: {
    backgroundColor: "#1378C9",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#16A88C",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  disabledButton: { opacity: 0.45 },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryButtonText: { color: "#1378C9", fontWeight: "700" },
});
