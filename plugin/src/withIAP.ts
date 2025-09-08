import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
} from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import withLocalOpenIAP from './withLocalOpenIAP';

const pkg = require('../../package.json');

// Log a message only once per Node process
const logOnce = (() => {
  const printed = new Set<string>();
  return (msg: string) => {
    if (!printed.has(msg)) {
      console.log(msg);
      printed.add(msg);
    }
  };
})();

const addLineToGradle = (
  content: string,
  anchor: RegExp | string,
  lineToAdd: string,
  offset: number = 1,
): string => {
  const lines = content.split('\n');
  const index = lines.findIndex((line) => line.match(anchor));
  if (index === -1) {
    console.warn(
      `Anchor "${anchor}" not found in build.gradle. Appending to end.`,
    );
    lines.push(lineToAdd);
  } else {
    lines.splice(index + offset, 0, lineToAdd);
  }
  return lines.join('\n');
};

const modifyAppBuildGradle = (gradle: string): string => {
  let modified = gradle;

  // Add billing library dependencies to app-level build.gradle
  const billingDep = `    implementation "com.android.billingclient:billing-ktx:8.0.0"`;
  const gmsDep = `    implementation "com.google.android.gms:play-services-base:18.1.0"`;

  let hasAddedDependency = false;

  if (!modified.includes(billingDep)) {
    modified = addLineToGradle(modified, /dependencies\s*{/, billingDep);
    hasAddedDependency = true;
  }
  if (!modified.includes(gmsDep)) {
    modified = addLineToGradle(modified, /dependencies\s*{/, gmsDep, 1);
    hasAddedDependency = true;
  }

  // Log only once and only if we actually added dependencies
  if (hasAddedDependency)
    logOnce('🛠️ expo-iap: Added billing dependencies to build.gradle');

  return modified;
};

const withIapAndroid: ConfigPlugin = (config) => {
  // Add IAP dependencies to app build.gradle
  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = modifyAppBuildGradle(
      config.modResults.contents,
    );
    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    if (!manifest.manifest['uses-permission']) {
      manifest.manifest['uses-permission'] = [];
    }

    const permissions = manifest.manifest['uses-permission'];
    const billingPerm = {$: {'android:name': 'com.android.vending.BILLING'}};

    const alreadyExists = permissions.some(
      (p) => p.$['android:name'] === 'com.android.vending.BILLING',
    );
    if (!alreadyExists) {
      permissions.push(billingPerm);
      logOnce('✅ Added com.android.vending.BILLING to AndroidManifest.xml');
    } else {
      logOnce(
        'ℹ️ com.android.vending.BILLING already exists in AndroidManifest.xml',
      );
    }

    return config;
  });

  return config;
};

/** Ensure Podfile uses CocoaPods CDN and no stale local OpenIAP entry remains. */
const withIapIOS: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const {platformProjectRoot} = config.modRequest;
      const podfilePath = path.join(platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        return config;
      }

      let content = fs.readFileSync(podfilePath, 'utf8');

      // 1) Ensure CocoaPods CDN source is present at the very top
      const cdnLine = `source 'https://cdn.cocoapods.org/'`;
      if (!content.includes(cdnLine)) {
        content = `${cdnLine}\n\n${content}`;
        logOnce('📦 expo-iap: Added CocoaPods CDN source to Podfile');
      }

      // 2) Remove any lingering local OpenIAP pod injection
      const localPodRegex =
        /^\s*pod\s+'openiap'\s*,\s*:path\s*=>\s*['"][^'"]+['"][^\n]*$/gm;
      if (localPodRegex.test(content)) {
        content = content.replace(localPodRegex, '').replace(/\n{3,}/g, '\n\n');
        logOnce('🧹 expo-iap: Removed local OpenIAP pod from Podfile');
      }

      fs.writeFileSync(podfilePath, content);
      return config;
    },
  ]);
};

export interface ExpoIapPluginOptions {
  /** Local development path for OpenIAP library */
  localPath?: string;
  /** Enable local development mode */
  enableLocalDev?: boolean;
}

const withIap: ConfigPlugin<ExpoIapPluginOptions | void> = (
  config,
  options,
) => {
  try {
    // Apply Android modifications
    let result = withIapAndroid(config);

    // iOS: choose one path to avoid overlap
    if (options?.enableLocalDev || options?.localPath) {
      if (!options?.localPath) {
        WarningAggregator.addWarningIOS(
          'expo-iap',
          'enableLocalDev is true but no localPath provided. Skipping local OpenIAP integration.',
        );
      } else {
        const localPath = path.resolve(options.localPath);
        logOnce(
          `🔧 [expo-iap] Enabling local OpenIAP development at: ${localPath}`,
        );
        result = withLocalOpenIAP(result, {localPath});
      }
    } else {
      // Ensure iOS Podfile is set up to resolve public CocoaPods specs
      result = withIapIOS(result);
      logOnce('📦 [expo-iap] Using OpenIAP from CocoaPods');
    }

    return result;
  } catch (error) {
    WarningAggregator.addWarningAndroid(
      'expo-iap',
      `expo-iap plugin encountered an error: ${error}`,
    );
    console.error('expo-iap plugin error:', error);
    return config;
  }
};

export default createRunOncePlugin(withIap, pkg.name, pkg.version);
