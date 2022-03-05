import 'dotenv/config';

export default {
  expo: {
    name: "wrkr",
    slug: "wrkr",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    // icon: "./assets/icon.jpg",
    splash: {
      image: "./assets/splash.png",
      // image: "./assets/splash.jpg",
      // resizeMode: "contain",
      resizeMode: "cover",
      // backgroundColor: "#ffffff"
      backgroundColor: "#48821b"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      bundleIdentifier: "com.wrkr",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "The user's location is used to set their address in their profile. Their information is used in no other way. It is set once at startup so that they won't have to enter in an address for each job they want to create.",
        CFBundleShortVersionString: "1.0.2",
        CFBundleVersion: "1.0.2"
      }
    },
    android: {
      package: 'com.wrkr',
      // googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: 'AIzaSyAMupGVraeTXbfZ0HgeM7UrFqMWnbLFHH8'
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        // foregroundImage: "./assets/icon.jpg",
        // backgroundColor: "#ffffff"
        backgroundColor: "#48821b"
      },
      softwareKeyboardLayoutMode: "pan",
      versionCode: 2
    },
    web: {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      mapAPIKey: process.env.MAP_API_KEY,
      civicAPIKey: process.env.CIVIC_API_KEY
    }
  }
}