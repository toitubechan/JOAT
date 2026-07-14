Read AGENTS.md first and follow it strictly.

Pre-launch hygiene - small, surgical, no refactoring.

- Brand the launch config: in `app.json`, the splash (`#208AEF`) and adaptive-icon background (`#E6F4FE`) are blue, but the app is ink+amber - the splash flashes off-brand on cold start. Set both to the ink/amber tokens from `theme/`.
- Remove the `"ios": { "icon": "./assets/expo.icon" }` entry from `app.json` - this is an Android-only app and the path is wrong.
- Gate the `profile.tsx` "Reset progress" control (marked "Remove before launch") behind `__DEV__`, or remove it. It must not be reachable in a release build.
- Rewrite `README.md` - it is still create-expo-app boilerplate. Document JOAT: what it is, the stack, how to run in Expo Go, the markdown content pipeline, and the monetization go-live steps.
- Tighten loose typing in `SocialAuthButtons.tsx`: `SocialButton`'s `logo: number` and `style?: object` should be proper React Native types (`ImageSourcePropType`, `StyleProp<ViewStyle>`).

Typecheck + lint clean.
