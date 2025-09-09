# Expo IAP

<div align="center">
  <img src="https://hyochan.github.io/expo-iap/img/icon.png" alt="Expo IAP Logo" width="150" />
  
  [![Version](http://img.shields.io/npm/v/expo-iap.svg?style=flat-square)](https://npmjs.org/package/expo-iap) [![Download](http://img.shields.io/npm/dm/expo-iap.svg?style=flat-square)](https://npmjs.org/package/expo-iap) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhyochan%2Fexpo-iap.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhyochan%2Fexpo-iap?ref=badge_shield&issueType=license)
  
  In app purchase module in [Expo](https://docs.expo.dev/guides/in-app-purchases) that conforms to the [Open IAP specification](https://openiap.dev)
  
  <a href="https://openiap.dev"><img src="https://openiap.dev/logo.png" alt="Open IAP" height="40" /></a>
</div>

## 📚 Documentation

**[📖 Visit our comprehensive documentation site →](https://hyochan.github.io/expo-iap)**

## Notice

The `expo-iap` module has been migrated from [react-native-iap](https://github.com/dooboolab/react-native-iap). Moving forward, the `react-native-iap` repository will gradually be deprecated, and `expo-iap` will become the actively maintained module. Please take note of this transition. For more details, refer to the [Future Roadmap and Discussion in react-native-iap](https://github.com/dooboolab-community/react-native-iap/discussions/2754). Additionally, you can check the [Current Project Status comment](https://github.com/dooboolab-community/react-native-iap/discussions/2754#discussioncomment-10510249) to stay updated on the project's progress.

## Installation

```bash
npx expo install expo-iap
```

### Android Configuration

**Important:** For Android, `expo-iap` uses Google Play Billing Library v8.0.0 which requires Kotlin 2.0+. Since `expo-modules-core` doesn't support Kotlin v2 yet, you need to configure your project with `expo-build-properties`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "2.0.21"
          }
        }
      ]
    ]
  }
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup
- Running the example app
- Testing guidelines
- Code style and conventions
- Submitting pull requests

For detailed usage examples and error handling, see the [documentation](https://hyochan.github.io/expo-iap).

> Sharing your thoughts—any feedback would be greatly appreciated!

## Sponsors

💼 **[View Our Sponsors](https://openiap.dev/sponsors)**

### <p style="color: rgb(255, 182, 193);">Angel</p>

<a href="https://meta.com">
    <img width="600" alt="courier_dot_com" src="https://static.xx.fbcdn.net/rsrc.php/y3/r/y6QsbGgc866.svg" />
</a>

## Past Supporters

<div style="display: flex; align-items:center; gap: 10px;">
  <a href="https://namiml.com" style="opacity: 50%">
    <img src="https://github.com/hyochan/react-native-iap/assets/27461460/89d71f61-bb73-400a-83bd-fe0f96eb726e" alt="Nami ML" width="140"/>
  </a>
  <a href="https://www.courier.com/?utm_source=react-native-iap&utm_campaign=osssponsors" style="opacity: 50%;">
    <img width="80" alt="courier_dot_com" src="https://github.com/user-attachments/assets/319d8966-6839-498d-8ead-ce8cc72c3bca" />
  </a>
</div>
