/**
 * @file engine/assets/AssetManifest.ts
 * @description Core manifest schema for the 3D Atlas asset pipeline.
 *
 * Purpose: Every asset in the system must be declared with this schema.
 * Responsibilities: Type definitions, category enum, compression enum.
 *
 * Design rules:
 *   - No magic strings. Every field uses a well-typed union or enum.
 *   - `qualityLevel` maps to PerformanceBudget presets.
 *   - `dependencies` enables ordered loading for assets referencing others.
 *   - `size` is an estimated byte count for memory budgeting (0 = unknown).
 */

import { type QualityPreset } from '@/config/performance'

// ─── Asset Category ───────────────────────────────────────────────────────────

export type AssetCategory =
  'model' | 'texture' | 'hdri' | 'video' | 'font' | 'audio' | 'icon' | 'image'

// ─── Asset Format / Extension ─────────────────────────────────────────────────

export type AssetFormat =
  | 'glb'
  | 'gltf'
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'ktx2'
  | 'basis'
  | 'hdr'
  | 'exr'
  | 'mp4'
  | 'webm'
  | 'ttf'
  | 'woff'
  | 'woff2'
  | 'otf'
  | 'mp3'
  | 'ogg'
  | 'wav'
  | 'svg'
  | 'json'

// ─── Compression ──────────────────────────────────────────────────────────────

export type AssetCompression = 'none' | 'draco' | 'meshopt' | 'ktx2' | 'basis' | 'gzip' | 'brotli'

// ─── Quality Level ────────────────────────────────────────────────────────────

export type AssetQualityLevel = QualityPreset | 'all'

// ─── Manifest Entry ───────────────────────────────────────────────────────────

export interface AssetManifestEntry {
  /**
   * Unique, stable identifier for this asset.
   * Convention: `<category>/<name>` e.g. `model/globe`, `texture/earth_diffuse`
   */
  readonly id: string

  /** Human-readable name for logging and dev tools. */
  readonly name: string

  /** Asset category (model, texture, hdri, video, font, audio, icon, image). */
  readonly category: AssetCategory

  /** Public URL path (resolved from /public). */
  readonly path: string

  /** File format extension. */
  readonly format: AssetFormat

  /**
   * Estimated byte size of the file. 0 = unknown.
   * Used for memory budgeting and progress calculations.
   */
  readonly size: number

  /**
   * Loading priority. Lower number = higher priority.
   * Use AssetPriority constants for clarity.
   */
  readonly priority: number

  /**
   * Whether this asset should be loaded in the critical preload pass.
   * True = loaded before the first frame renders.
   */
  readonly preload: boolean

  /**
   * Whether to keep this asset in cache permanently (never auto-evict).
   * True for shared assets used across multiple scenes.
   */
  readonly cache: boolean

  /**
   * Minimum quality level at which this asset is loaded.
   * 'all' = always loaded regardless of quality tier.
   */
  readonly qualityLevel: AssetQualityLevel

  /** Compression scheme applied to this asset file. */
  readonly compression: AssetCompression

  /**
   * IDs of assets that must be loaded before this one.
   * Enables ordered loading chains (e.g. skeleton before skinned mesh).
   */
  readonly dependencies: readonly string[]

  /**
   * Optional tags for group-based loading (e.g. 'hero', 'scene-01', 'ui').
   */
  readonly tags?: readonly string[]

  /**
   * Optional group name for batch operations (e.g. 'earth', 'particles').
   */
  readonly group?: string
}

// ─── Manifest Collection ──────────────────────────────────────────────────────

export type AssetManifest = readonly AssetManifestEntry[]
