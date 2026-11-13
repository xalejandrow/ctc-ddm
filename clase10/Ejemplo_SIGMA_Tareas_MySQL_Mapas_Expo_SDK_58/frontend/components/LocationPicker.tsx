import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import {
  getCurrentLocation,
  DeviceLocation,
  MAX_ACCURACY_METERS,
} from "@/services/locationService";
// const FALLBACK: Region = {
//   latitude: -34.428,
//   longitude: -57.438,
//   latitudeDelta: 0.12,
//   longitudeDelta: 0.12,
// };
const FALLBACK: Region = {
  latitude: -34.4626,
  longitude: -57.8398,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};
export function LocationPicker({
  value,
  onChange,
}: {
  value: DeviceLocation | null;
  onChange: (value: DeviceLocation | null) => void;
}) {
  const [getting, setGetting] = useState(false);
  async function useDeviceLocation() {
    setGetting(true);
    try {
      const location = await getCurrentLocation();
      onChange(location);
      if (location.accuracy && location.accuracy > MAX_ACCURACY_METERS)
        Alert.alert(
          "Precisión insuficiente",
          `El margen actual es ±${Math.round(location.accuracy)} m. Para registrar una incidencia, intentá obtener una lectura de ±${MAX_ACCURACY_METERS} m o menor.`,
        );
    } catch (error) {
      Alert.alert(
        "Ubicación",
        error instanceof Error
          ? error.message
          : "No fue posible obtener la ubicación.",
      );
    } finally {
      setGetting(false);
    }
  }
  const region: Region = value
    ? {
        latitude: value.latitude,
        longitude: value.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }
    : FALLBACK;
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Ubicación de la incidencia</Text>
      <MapView
        style={styles.map}
        region={region}
        onPress={(event) =>
          onChange({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
            accuracy: null,
            capturedAt: new Date().toISOString(),
          })
        }
      >
        {value && <Marker coordinate={value} title="Ubicación seleccionada" />}
      </MapView>
      <Button
        title={getting ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        onPress={useDeviceLocation}
        disabled={getting}
      />
      {value ? (
        <>
          <Text style={styles.info}>
            {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          </Text>
          <Text
            style={[
              styles.info,
              value.accuracy && value.accuracy > MAX_ACCURACY_METERS
                ? styles.bad
                : styles.good,
            ]}
          >
            {value.accuracy
              ? `Precisión: ±${Math.round(value.accuracy)} m`
              : "Punto elegido manualmente en el mapa"}
          </Text>
          <Button
            title="Quitar ubicación"
            color="#a33"
            onPress={() => onChange(null)}
          />
        </>
      ) : (
        <Text style={styles.info}>
          Tocá el mapa para elegir un punto o usá el GPS del dispositivo.
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { gap: 8, marginTop: 12 },
  title: { fontWeight: "700", fontSize: 16 },
  map: { height: 220, borderRadius: 10 },
  info: { fontSize: 13, textAlign: "center" },
  good: { color: "#18733b" },
  bad: { color: "#a52b20", fontWeight: "700" },
});
