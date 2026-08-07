/**
 * @file assets/manifest/hdr.ts
 * @description Static manifest for HDRI environment map assets.
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const hdrManifest: AssetManifestEntry[] = [
  {
    id: 'hdri/studio',
    name: 'Studio HDRI',
    category: 'hdri',
    path: '/hdr/studio.hdr',
    format: 'hdr',
    size: 0,
    priority: AssetPriority.HIGH,
    preload: true,
    cache: true,
    qualityLevel: 'medium',
    compression: 'none',
    dependencies: [],
    tags: ['hero', 'scene-01'],
    group: 'lighting',
  },
  {
    id: 'hdri/sunset',
    name: 'Sunset HDRI',
    category: 'hdri',
    path: '/hdr/sunset.hdr',
    format: 'hdr',
    size: 0,
    priority: AssetPriority.NORMAL,
    preload: false,
    cache: true,
    qualityLevel: 'high',
    compression: 'none',
    dependencies: [],
    tags: ['scene-02'],
    group: 'lighting',
  },
  {
    id: 'hdri/night',
    name: 'Night HDRI',
    category: 'hdri',
    path: '/hdr/night.hdr',
    format: 'hdr',
    size: 0,
    priority: AssetPriority.LOW,
    preload: false,
    cache: true,
    qualityLevel: 'high',
    compression: 'none',
    dependencies: [],
    tags: ['scene-03', 'scene-04'],
    group: 'lighting',
  },
]
