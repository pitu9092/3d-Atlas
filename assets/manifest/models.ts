/**
 * @file assets/manifest/models.ts
 * @description Static manifest for all 3D model assets used in 3D Atlas.
 *
 * All paths resolve to /public/. Add new models here as they become available.
 * Size values are approximate byte estimates (0 = TBD / not yet measured).
 */

import { type AssetManifestEntry } from '@/engine/assets/AssetManifest'
import { AssetPriority } from '@/engine/assets/AssetPriority'

export const modelManifest: AssetManifestEntry[] = [
  {
    id: 'model/globe',
    name: 'Globe',
    category: 'model',
    path: '/models/globe.glb',
    format: 'glb',
    size: 0,
    priority: AssetPriority.CRITICAL,
    preload: true,
    cache: true,
    qualityLevel: 'all',
    compression: 'meshopt',
    dependencies: [],
    tags: ['hero', 'scene-01'],
    group: 'earth',
  },
  {
    id: 'model/crane',
    name: 'Crane',
    category: 'model',
    path: '/models/crane.glb',
    format: 'glb',
    size: 0,
    priority: AssetPriority.HIGH,
    preload: false,
    cache: true,
    qualityLevel: 'medium',
    compression: 'draco',
    dependencies: [],
    tags: ['scene-02', 'logistics'],
    group: 'vehicles',
  },
  {
    id: 'model/truck',
    name: 'Truck',
    category: 'model',
    path: '/models/truck.glb',
    format: 'glb',
    size: 0,
    priority: AssetPriority.NORMAL,
    preload: false,
    cache: true,
    qualityLevel: 'medium',
    compression: 'draco',
    dependencies: [],
    tags: ['scene-02', 'logistics'],
    group: 'vehicles',
  },
  {
    id: 'model/ship',
    name: 'Cargo Ship',
    category: 'model',
    path: '/models/ship.glb',
    format: 'glb',
    size: 0,
    priority: AssetPriority.NORMAL,
    preload: false,
    cache: true,
    qualityLevel: 'medium',
    compression: 'draco',
    dependencies: [],
    tags: ['scene-03', 'logistics'],
    group: 'vehicles',
  },
  {
    id: 'model/aircraft',
    name: 'Aircraft',
    category: 'model',
    path: '/models/aircraft.glb',
    format: 'glb',
    size: 0,
    priority: AssetPriority.LOW,
    preload: false,
    cache: true,
    qualityLevel: 'high',
    compression: 'draco',
    dependencies: [],
    tags: ['scene-04', 'logistics'],
    group: 'vehicles',
  },
]
