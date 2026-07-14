/**
 * Ambient types for static asset imports resolved by Metro.
 * A `require()`d / imported asset is a number (the asset registry id), which is
 * exactly what `expo-image`'s `source` and React Native accept.
 */
declare module "*.png" {
  const value: number;
  export default value;
}
declare module "*.jpg" {
  const value: number;
  export default value;
}
declare module "*.jpeg" {
  const value: number;
  export default value;
}
declare module "*.gif" {
  const value: number;
  export default value;
}
declare module "*.webp" {
  const value: number;
  export default value;
}
declare module "*.svg" {
  const value: number;
  export default value;
}

/**
 * Markdown lesson files are bundled as raw strings by `md-transformer.js`
 * (registered in metro.config.js), so importing one yields its text content.
 */
declare module "*.md" {
  const value: string;
  export default value;
}
