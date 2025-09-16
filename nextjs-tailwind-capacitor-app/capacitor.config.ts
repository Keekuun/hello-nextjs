import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'nextjs-tailwind-capacitor-app',
  webDir: 'out',
  server: {
    // Capacitor Live Reload
    // npx cap copy
    url: 'http://192.168.74.74:3001',
    cleartext: true,
  },
  plugins: {
    // Enable CapacitorHttp to override the global `fetch` and `XMLHttpRequest` on native.
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
