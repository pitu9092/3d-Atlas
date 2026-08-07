/**
 * @file assets/manifest/icons.ts
 * @description Static manifest for icon/SVG assets used in 3D Atlas.
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const iconManifest: AssetManifestEntry[] = [
  {
    id: 'icon/sprite',
    name: 'SVG Icon Sprite',
    category: 'icon',
    path: '/icons/sprite.svg',
    format: 'svg',
    size: 0,
    priority: AssetPriority.HIGH,
    preload: true,
    cache: true,
    qualityLevel: 'all',
    compression: 'none',
    dependencies: [],
    tags: ['global', 'ui'],
    group: 'icons',
  },
  {
    id: 'image/logo',
    name: 'Logo SVG',
    category: 'image',
    path: '/images/logo.svg',
    format: 'svg',
    size: 0,
    priority: AssetPriority.CRITICAL,
    preload: true,
    cache: true,
    qualityLevel: 'all',
    compression: 'none',
    dependencies: [],
    tags: ['global', 'header'],
    group: 'branding',
  },
]
