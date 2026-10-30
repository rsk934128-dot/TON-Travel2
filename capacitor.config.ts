import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tontravel.app',
  appName: 'TON Travel',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
