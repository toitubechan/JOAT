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
