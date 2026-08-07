/**
 * @file engine/assets/AssetValidator.ts
 * @description Validates asset manifest entries for correctness and completeness.
 *
 * Purpose: Catches misconfigured asset declarations at registration time (dev) or build time.
 * Responsibilities:
 *   - Required field validation
 *   - Type and category enum validation
 *   - Path format checks
 *   - Duplicate ID detection
 *   - Dependency existence check
 */

import {
  type AssetManifest,
  type AssetManifestEntry,
  type AssetCategory,
  type AssetFormat,
} from './AssetManifest'

// ─── Validation Result ────────────────────────────────────────────────────────

export interface ValidationError {
  id: string
  field: string
  message: string
}

export interface ValidationReport {
  valid: boolean
  totalEntries: number
  errorCount: number
  errors: ValidationError[]
}

// ─── Valid Sets ───────────────────────────────────────────────────────────────

const VALID_CATEGORIES = new Set<AssetCategory>([
  'model',
  'texture',
  'hdri',
  'video',
  'font',
  'audio',
  'icon',
  'image',
])

const VALID_FORMATS = new Set<AssetFormat>([
  'glb',
  'gltf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'ktx2',
  'basis',
  'hdr',
  'exr',
  'mp4',
  'webm',
  'ttf',
  'woff',
  'woff2',
  'otf',
  'mp3',
  'ogg',
  'wav',
  'svg',
  'json',
])

const VALID_QUALITY_LEVELS = new Set(['all', 'low', 'medium', 'high', 'ultra'])
const VALID_COMPRESSIONS = new Set(['none', 'draco', 'meshopt', 'ktx2', 'basis', 'gzip', 'brotli'])

// ─── Asset Validator ─────────────────────────────────────────────────────────

export class AssetValidator {
  /**
   * Validates a single asset manifest entry.
   * Returns all errors found.
   */
  public validate(entry: AssetManifestEntry): ValidationError[] {
    const errors: ValidationError[] = []
    const { id } = entry

    // ── Required string fields ────────────────────────────────────────────
    if (!entry.id || entry.id.trim() === '') {
      errors.push({ id: id ?? '?', field: 'id', message: 'ID is required and must be non-empty.' })
    }

    if (!entry.name || entry.name.trim() === '') {
      errors.push({ id, field: 'name', message: 'Name is required.' })
    }

    if (!entry.path || entry.path.trim() === '') {
      errors.push({ id, field: 'path', message: 'Path is required.' })
    } else if (!entry.path.startsWith('/')) {
      errors.push({ id, field: 'path', message: `Path must start with '/' (got '${entry.path}').` })
    }

    // ── Enum fields ───────────────────────────────────────────────────────
    if (!VALID_CATEGORIES.has(entry.category)) {
      errors.push({
        id,
        field: 'category',
        message: `Invalid category '${entry.category}'. Valid: ${Array.from(VALID_CATEGORIES).join(', ')}`,
      })
    }

    if (!VALID_FORMATS.has(entry.format)) {
      errors.push({
        id,
        field: 'format',
        message: `Invalid format '${entry.format}'. Valid: ${Array.from(VALID_FORMATS).join(', ')}`,
      })
    }

    if (!VALID_QUALITY_LEVELS.has(entry.qualityLevel)) {
      errors.push({
        id,
        field: 'qualityLevel',
        message: `Invalid qualityLevel '${entry.qualityLevel}'.`,
      })
    }

    if (!VALID_COMPRESSIONS.has(entry.compression)) {
      errors.push({
        id,
        field: 'compression',
        message: `Invalid compression '${entry.compression}'.`,
      })
    }

    // ── Numeric fields ────────────────────────────────────────────────────
    if (typeof entry.size !== 'number' || entry.size < 0) {
      errors.push({ id, field: 'size', message: 'Size must be a non-negative number.' })
    }

    if (typeof entry.priority !== 'number' || entry.priority < 0) {
      errors.push({ id, field: 'priority', message: 'Priority must be a non-negative integer.' })
    }

    // ── Boolean fields ────────────────────────────────────────────────────
    if (typeof entry.preload !== 'boolean') {
      errors.push({ id, field: 'preload', message: 'preload must be a boolean.' })
    }

    if (typeof entry.cache !== 'boolean') {
      errors.push({ id, field: 'cache', message: 'cache must be a boolean.' })
    }

    // ── ID format check ───────────────────────────────────────────────────
    if (entry.id && !/^[a-z0-9_/-]+$/.test(entry.id)) {
      errors.push({
        id,
        field: 'id',
        message: `ID contains invalid characters. Use lowercase alphanumeric, _, /, or -.`,
      })
    }

    return errors
  }

  /**
   * Validates all entries in a manifest and returns a full report.
   */
  public validateAll(manifest: AssetManifest): ValidationReport {
    const errors: ValidationError[] = []

    for (const entry of manifest) {
      errors.push(...this.validate(entry))
    }

    // Check for duplicate IDs
    errors.push(...this.checkDuplicates(manifest))

    return {
      valid: errors.length === 0,
      totalEntries: manifest.length,
      errorCount: errors.length,
      errors,
    }
  }

  /**
   * Detects duplicate IDs in a manifest.
   */
  public checkDuplicates(manifest: AssetManifest): ValidationError[] {
    const errors: ValidationError[] = []
    const seen = new Map<string, number>()

    manifest.forEach((entry, index) => {
      if (seen.has(entry.id)) {
        errors.push({
          id: entry.id,
          field: 'id',
          message: `Duplicate ID '${entry.id}' at index ${index} (first seen at ${seen.get(entry.id)!}).`,
        })
      } else {
        seen.set(entry.id, index)
      }
    })

    return errors
  }

  /**
   * Checks that all declared dependencies exist in the manifest.
   */
  public checkDependencies(manifest: AssetManifest): ValidationError[] {
    const errors: ValidationError[] = []
    const ids = new Set(manifest.map((e) => e.id))

    manifest.forEach((entry) => {
      entry.dependencies.forEach((depId) => {
        if (!ids.has(depId)) {
          errors.push({
            id: entry.id,
            field: 'dependencies',
            message: `Dependency '${depId}' is not declared in the manifest.`,
          })
        }
      })
    })

    return errors
  }
}

// Singleton instance
export const assetValidator = new AssetValidator()
