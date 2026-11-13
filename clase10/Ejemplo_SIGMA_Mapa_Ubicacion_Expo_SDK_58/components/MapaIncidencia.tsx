import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {
  MAXIMUM_ACCEPTABLE_ACCURACY_METERS,
} from "../services/locationService";
import { UbicacionIncidencia } from "../types/location";

type Props = {
  region: Region;
  ubicacion: UbicacionIncidencia | null;
};

export function MapaIncidencia({ region, ubicacion }: Props) {
  const precisionAceptable =
    ubicacion !== null &&
    (ubicacion.accuracy ?? Number.MAX_SAFE_INTEGER) <=
      MAXIMUM_ACCEPTABLE_ACCURACY_METERS;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={ubicacion !== null}
        showsMyLocationButton={ubicacion !== null}
      >
        {ubicacion && (
          <Marker
            coordinate={{
              latitude: ubicacion.latitude,
              longitude: ubicacion.longitude,
            }}
            title="Ubicación de la incidencia"
            description={`Precisión estimada: ${Math.round(
              ubicacion.accuracy ?? 0
            )} m`}
            pinColor={precisionAceptable ? "green" : "orange"}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 330,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
