import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "nz.co.wynyardcollective.landoforwen",
  appName: "Land of Orwen",
  webDir: "www",
  server: {
    url: "https://rough.co.nz/play?source=android-app",
    cleartext: false,
    androidScheme: "https",
    allowNavigation: ["rough.co.nz", "www.rough.co.nz"],
  },
  android: {
    allowMixedContent: false,
    buildOptions: {
      releaseType: "AAB",
    },
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#0c0a09",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0c0a09",
    },
  },
};

export default config;
