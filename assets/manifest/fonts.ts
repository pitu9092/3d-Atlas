/**
 * @file assets/manifest/fonts.ts
 * @description Static manifest for font assets used in 3D Atlas.
 *
 * NOTE: Web fonts (CSS @font-face) are loaded via Next.js.
 * These entries are for Three.js FontLoader (JSON typeface fonts for 3D text geometry).
 * The Inter and Outfit variable fonts declared here are also used for CSS fallback paths.
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const fontManifest: AssetManifestEntry[] = [
  {
    id: 'font/inter-variable',
    name: 'Inter Variable Font',
    category: 'font',
    path: '/fonts/Inter-VariableFont_slnt,wght.ttf',
    format: 'ttf',
    size: 0,
    priority: AssetPriority.CRITICAL,
    preload: true,
    cache: true,
    qualityLevel: 'all',
    compression: 'none',
    dependencies: [],
    tags: ['global', 'ui'],
    group: 'typography',
  },
  {
    id: 'font/outfit-variable',
    name: 'Outfit Variable Font',
    category: 'font',
    path: '/fonts/Outfit-VariableFont_wght.ttf',
    format: 'ttf',
    size: 0,
    priority: AssetPriority.CRITICAL,
    preload: true,
    cache: true,
    qualityLevel: 'all',
    compression: 'none',
    dependencies: [],
    tags: ['global', 'ui'],
    group: 'typography',
  },
]
