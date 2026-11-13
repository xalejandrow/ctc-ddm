import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "SIGMA Mapa",
  slug: "sigma-mapa-ubicacion",
  scheme: "sigmamapa",
  orientation: "portrait",
  userInterfaceStyle: "light",
  android: {
    ...config.android,
    package: "com.softnetdynamics.sigmamapa",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: "com.softnetdynamics.sigmamapa",
  },
  plugins: [
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "SIGMA necesita tu ubicación para asociar la incidencia al lugar donde fue detectada.",
      },
    ],
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_IOS_KEY,
      },
    ],
  ],
});
