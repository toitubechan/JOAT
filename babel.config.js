// Babel config used by Jest (babel-jest). Metro already applies babel-preset-expo
// by default, so this just makes the same preset explicit for the test runner —
// no change to how the app bundles. babel-preset-expo bundles the TypeScript and
// Reanimated transforms, so no extra plugins are needed here.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
