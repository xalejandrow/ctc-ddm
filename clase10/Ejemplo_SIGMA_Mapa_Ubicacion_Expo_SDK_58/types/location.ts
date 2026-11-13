import * as Location from "expo-location";

export type UbicacionIncidencia = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  capturedAt: string;
};

export type ResultadoUbicacion =
  | {
      ok: true;
      ubicacion: UbicacionIncidencia;
    }
  | {
      ok: false;
      code: "permission_denied" | "location_unavailable" | "unknown_error";
      canAskAgain: boolean;
      message: string;
    };

export type LocationObject = Location.LocationObject;
