import * as Location from "expo-location";
export const MAX_ACCURACY_METERS = 50;
export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  capturedAt: string;
};
export async function getCurrentLocation(): Promise<DeviceLocation> {
  let permission = await Location.getForegroundPermissionsAsync();
  if (!permission.granted)
    permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      permission.canAskAgain
        ? "Necesitás aceptar el permiso de ubicación."
        : "El permiso fue denegado permanentemente. Abrí Ajustes para habilitarlo.",
    );
  if (!(await Location.hasServicesEnabledAsync()))
    throw new Error("Activá los servicios de ubicación del teléfono.");
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    capturedAt: new Date().toISOString(),
  };
}
