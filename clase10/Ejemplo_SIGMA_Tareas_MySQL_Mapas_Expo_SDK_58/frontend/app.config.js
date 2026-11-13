require("dotenv").config();
module.exports = {
  expo: {
    name: "SIGMA Tareas",
    slug: "sigma-tareas-mysql-mapas",
    scheme: "sigma",
    plugins: [
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "SIGMA usa tu ubicación para asociarla a una incidencia.",
        },
      ],
    ],
    android: {
      package: "com.ejemplo.sigmatareas",
      config: {
        googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY || "" },
      },
    },
    ios: {
      bundleIdentifier: "com.ejemplo.sigmatareas",
      config: { googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_KEY || "" },
    },
  },
};
