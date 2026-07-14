/**
 * Metro babel transformer that lets us `import` markdown files as plain strings.
 *
 * When Metro transforms a `.md` file we swap its source for a tiny CommonJS
 * module that exports the raw markdown text. Every other file is handed to
 * Expo's default transformer untouched.
 *
 * This is what makes `content/*.md` the source of truth at runtime: the lesson
 * markdown is bundled as strings (works in Expo Go, no Node `fs` needed) and
 * parsed into typed models in `src/lib/content.ts`.
 *
 * Wired up in `metro.config.js` via `transformer.babelTransformerPath`, and the
 * `.md` extension is registered in `resolver.sourceExts`.
 */
const upstreamTransformer = require("@expo/metro-config/babel-transformer");

function transform(props) {
  if (props.filename.endsWith(".md")) {
    return upstreamTransformer.transform({
      ...props,
      src: `module.exports = ${JSON.stringify(props.src)};`,
    });
  }
  return upstreamTransformer.transform(props);
}

module.exports = {
  transform,
  getCacheKey: upstreamTransformer.getCacheKey,
};
