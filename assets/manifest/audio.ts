/**
 * @file assets/manifest/audio.ts
 * @description Static manifest for audio assets used in 3D Atlas.
 *
 * All audio is loaded lazily — user interaction is required before playback.
 * Assets are not preloaded to comply with autoplay policy.
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const audioManifest: AssetManifestEntry[] = [
  // Placeholder: audio assets will be populated as they are confirmed.
  // Example entry structure:
  // {
  //   id: 'audio/ambient-space',
  //   name: 'Ambient Space Loop',
  //   category: 'audio',
  //   path: '/audio/ambient-space.mp3',
  //   format: 'mp3',
  //   size: 0,
  //   priority: AssetPriority.LAZY,
  //   preload: false,
  //   cache: false,
  //   qualityLevel: 'all',
  //   compression: 'none',
  //   dependencies: [],
  //   tags: ['ambient'],
  //   group: 'audio',
  // },
] satisfies AssetManifestEntry[]

// Silence unused import warning during placeholder phase
void AssetPriority
