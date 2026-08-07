/**
 * @file assets/manifest/index.ts
 * @description Aggregated manifest of all assets across all categories.
 *
 * This is the single import for the full asset pipeline manifest.
 * Passed to assetRegistry.registerMany() during engine bootstrap.
 *
 * Usage:
 *   import { fullManifest } from '@/assets/manifest'
 *   assetRegistry.registerMany(fullManifest)
 */

import { type AssetManifest } from '@/engine/assets/AssetManifest'

import { audioManifest } from './audio'
import { fontManifest } from './fonts'
import { hdrManifest } from './hdr'
import { iconManifest } from './icons'
import { modelManifest } from './models'
import { textureManifest } from './textures'
import { videoManifest } from './videos'

/**
 * Complete asset manifest — every asset declared for 3D Atlas.
 * Immutable at runtime. Categories exported separately for filtering.
 */
export const fullManifest: AssetManifest = [
  ...modelManifest,
  ...textureManifest,
  ...hdrManifest,
  ...videoManifest,
  ...fontManifest,
  ...audioManifest,
  ...iconManifest,
] as const

// Category exports for targeted registration or validation
export { modelManifest } from './models'
export { textureManifest } from './textures'
export { hdrManifest } from './hdr'
export { videoManifest } from './videos'
export { fontManifest } from './fonts'
export { audioManifest } from './audio'
export { iconManifest } from './icons'
