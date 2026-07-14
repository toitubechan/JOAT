/**
 * Jest config for the pure-logic test pass (content parsing + progress store).
 *
 * Uses the official `jest-expo` preset (RN/Expo transforms, the `__DEV__` global,
 * async-storage mock). Tests are deliberately device/network-free:
 *   - `.md` imports (Metro string transform) are stubbed to an empty string;
 *     the parser tests feed crafted markdown directly.
 *   - `@/…` path alias is mapped to `src/`.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  preset: "jest-expo",
  // `setupFilesAfterEnv` (not `setupFiles`) so we ADD to jest-expo's own setup
  // (which defines `__DEV__` + RN globals) instead of replacing it. It still runs
  // before each test file's imports, so the async-storage mock lands in time.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Only our co-located unit tests — pure `.ts` logic, no component rendering.
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    // Bundled lesson markdown is a Metro-only string transform; stub it so
    // importing the content module doesn't need the real files.
    "\\.md$": "<rootDir>/jest/mdStub.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
