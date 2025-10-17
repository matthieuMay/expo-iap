import type {ConfigContext, ExpoConfig} from '@expo/config';

const LOCAL_OPENIAP_PATHS = {
  ios: '/Users/hyo/Github/hyodotdev/openiap/packages/apple',
  android: '/Users/hyo/Github/hyodotdev/openiap/packages/google',
} as const;

export default ({config}: ConfigContext): ExpoConfig => {
  const pluginEntries: NonNullable<ExpoConfig['plugins']> = [
    [
      '../app.plugin.js',
      {
        enableLocalDev: false,
        localPath: {
          ios: LOCAL_OPENIAP_PATHS.ios,
          android: LOCAL_OPENIAP_PATHS.android,
        },
        modules: {
          onside: false,
        },
        // iOS Alternative Billing configuration (optional)
        // Uncomment and configure for external purchase support
        // NOTE: Requires Apple approval and proper provisioning profile
        // iosAlternativeBilling: {
        //   // Required: Countries where external purchases are supported (ISO 3166-1 alpha-2)
        //   countries: ['kr', 'nl'],
        //   //   countries: ['kr', 'nl', 'de', 'fr', 'it', 'es'],
        //
        //   // Optional: External purchase URLs per country (iOS 15.4+)
        //   links: {
        //     kr: 'https://openiap.dev/kr',
        //     nl: 'https://openiap.dev/nl',
        //   },
        //   //   links: {
        //   //     kr: 'https://your-site.com/kr/checkout',
        //   //     nl: 'https://your-site.com/nl/checkout',
        //   //     de: 'https://your-site.com/de/checkout',
        //   //   },
        //
        //   // Optional: Multiple URLs per country (iOS 17.5+, up to 5)
        //   //   multiLinks: {
        //   //     fr: [
        //   //       'https://your-site.com/fr',
        //   //       'https://your-site.com/global-sale',
        //   //     ],
        //   //     it: ['https://your-site.com/global-sale'],
        //   //   },
        //
        //   // Optional: Custom link regions (iOS 18.1+)
        //   //   customLinkRegions: ['de', 'fr', 'nl'],
        //
        //   // Optional: Streaming regions for music apps (iOS 18.2+)
        //   //   streamingLinkRegions: ['at', 'de', 'fr', 'nl', 'is', 'no'],
        //
        //   // Enable external purchase link entitlement
        //   enableExternalPurchaseLink: true,
        //
        //   // Enable streaming entitlement (music apps only)
        //   //   enableExternalPurchaseLinkStreaming: false,
        // },
      },
    ],
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.1.20',
        },
        ios: {
          deploymentTarget: '15.1',
        },
      },
    ],
  ];

  const expoConfig: ExpoConfig = {
    ...config,
    name: 'expo-iap-example',
    slug: 'expo-iap-example',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'expo-iap-example',
    userInterfaceStyle: 'automatic',
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: 'dev.hyo.martie',
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'dev.hyo.martie',
    },
    plugins: pluginEntries,
    experiments: {
      ...config.experiments,
      typedRoutes: true,
    },
  };

  return expoConfig;
};
