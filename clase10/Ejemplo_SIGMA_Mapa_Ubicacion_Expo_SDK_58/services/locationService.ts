import * as Location from "expo-location";
import { ResultadoUbicacion } from "../types/location";

export const MAXIMUM_ACCEPTABLE_ACCURACY_METERS = 50;

export async function obtenerUbicacionActual(): Promise<ResultadoUbicacion> {
  let permission = await Location.getForegroundPermissionsAsync();

  if (!permission.granted) {
    permission = await Location.requestForegroundPermissionsAsync();
  }

  if (!permission.granted) {
    return {
      ok: false,
      code: "permission_denied",
      canAskAgain: permission.canAskAgain,
      message: "SIGMA no tiene permiso para acceder a la ubicación.",
    };
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    return {
      ok: false,
      code: "location_unavailable",
      canAskAgain: true,
      message: "Activá la ubicación o el GPS del celular e intentá nuevamente.",
    };
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      ok: true,
      ubicacion: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        capturedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ok: false,
      code: "unknown_error",
      canAskAgain: true,
      message: "No fue posible obtener la ubicación. Probá nuevamente en unos segundos.",
    };
  }
}
