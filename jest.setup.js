/* eslint-env jest */
// Runs before each test file (jest `setupFiles`).

// The dev-only validation warnings in lib/content.ts and store/progress.ts are
// gated on `__DEV__`; force it on so the tests can assert those warnings fire.
global.__DEV__ = true;

// AsyncStorage's native module isn't available under Node. Use the official mock
// so the persisted progress store imports and runs (the persist middleware reads
// storage on creation).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
