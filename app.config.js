import 'dotenv/config';

export default {
  expo: {
    name: "mowr",
    slug: "mowr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      package: 'com.mower',
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: 'AIzaSyAMupGVraeTXbfZ0HgeM7UrFqMWnbLFHH8'
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      mapAPIKey: process.env.MAP_API_KEY,
      civicAPIKey: process.env.CIVIC_API_KEY
    }
  }
}