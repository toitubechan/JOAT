const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bundle lesson markdown as importable strings. `md-transformer.js` turns each
// `.md` import into a string export; here we register it and teach Metro to
// resolve the `.md` extension. Set before withNativewind so its CSS worker
// (which delegates to this babelTransformerPath) keeps both settings.
config.transformer.babelTransformerPath = require.resolve("./md-transformer.js");
config.resolver.sourceExts.push("md");

module.exports = withNativewind(config, {
  inlineVariables: true,
  globalClassNamePolyfill: false,
});
