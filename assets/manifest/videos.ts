/**
 * @file assets/manifest/videos.ts
 * @description Static manifest for video assets used in 3D Atlas.
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const videoManifest: AssetManifestEntry[] = [
  {
    id: 'video/intro-transition',
    name: 'Intro Transition Video',
    category: 'video',
    path: '/videos/intro-transition.mp4',
    format: 'mp4',
    size: 0,
    priority: AssetPriority.NORMAL,
    preload: false,
    cache: true,
    qualityLevel: 'medium',
    compression: 'none',
    dependencies: [],
    tags: ['hero', 'intro'],
    group: 'intro',
  },
]
