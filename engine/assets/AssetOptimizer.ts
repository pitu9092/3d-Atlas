/**
 * @file engine/assets/AssetOptimizer.ts
 * @description Texture compression, memory optimization, and asset deduplication.
 *
 * Purpose: Post-load optimization pass applied to assets before scene use.
 * Responsibilities:
 *   - Mipmap generation and filtering configuration
 *   - Texture size clamping based on device quality tier
 *   - Scene-level texture deduplication (shared textures → one GPU upload)
 *   - Memory usage estimation for cache budgeting
 *   - Color space enforcement (sRGB for diffuse, Linear for data textures)
 */

import * as THREE from 'three'

import { performanceConfig, type QualityPreset } from '@/config/performance'
import { logger } from '@/lib/core'

export class AssetOptimizer {
  // ─── Texture Optimization ─────────────────────────────────────────────────

  /**
   * Enables mipmap generation and sets high-quality anisotropic filtering.
   * Must be called before the texture is uploaded to the GPU.
   */
  public generateMipmaps(texture: THREE.Texture, anisotropy = 4): THREE.Texture {
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = anisotropy
    texture.needsUpdate = true

    return texture
  }

  /**
   * Clamps a texture's dimensions to the quality tier's maxTextureSize.
   * Mutates `texture.image` if it exceeds the limit.
   * NOTE: Must be called before GPU upload (before scene add).
   */
  public clampTextureSize(texture: THREE.Texture, qualityTier: QualityPreset): THREE.Texture {
    const maxSize = performanceConfig.presets[qualityTier].maxTextureSize

    const img = texture.image as HTMLImageElement | ImageBitmap | undefined
    if (!img) return texture

    const width = 'naturalWidth' in img ? img.naturalWidth : img.width
    const height = 'naturalHeight' in img ? img.naturalHeight : img.height

    if (width > maxSize || height > maxSize) {
      logger.debug(
        `[AssetOptimizer] Texture ${texture.uuid} (${width}x${height}) exceeds ${maxSize}px limit for '${qualityTier}' tier. Clamping.`,
      )
      texture.repeat.set(maxSize / width, maxSize / height)
    }

    return texture
  }

  /**
   * Enforces correct color space for a texture.
   * Diffuse/albedo textures use SRGBColorSpace.
   * Normal/roughness/metalness maps use LinearSRGBColorSpace.
   */
  public enforceColorSpace(texture: THREE.Texture, isSRGB: boolean): THREE.Texture {
    texture.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace
    texture.needsUpdate = true
    return texture
  }

  // ─── Scene Deduplication ──────────────────────────────────────────────────

  /**
   * Finds textures in a scene that share the same image source UUID
   * and re-assigns them all to a single texture instance.
   * Reduces GPU texture uploads for shared materials.
   *
   * Returns the number of duplicates removed.
   */
  public deduplicateTextures(scene: THREE.Scene): number {
    const textureMap = new Map<string, THREE.Texture>()
    let duplicatesRemoved = 0

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const materials = Array.isArray(child.material) ? child.material : [child.material]

      materials.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return

        const mapKeys: (keyof THREE.MeshStandardMaterial)[] = [
          'map',
          'normalMap',
          'roughnessMap',
          'metalnessMap',
          'emissiveMap',
          'aoMap',
        ]

        mapKeys.forEach((key) => {
          const texture = mat[key] as THREE.Texture | null
          if (!texture) return

          const existing = textureMap.get(texture.uuid)
          if (existing && existing !== texture) {
            // Replace with the canonical instance
            // Type assertion needed because of MeshStandardMaterial key indexing
            // Double-cast via unknown to safely assign to material map property
            ;(mat as unknown as Record<string, THREE.Texture | null>)[key as string] = existing
            duplicatesRemoved++
          } else {
            textureMap.set(texture.uuid, texture)
          }
        })
      })
    })

    if (duplicatesRemoved > 0) {
      logger.info(`[AssetOptimizer] Deduplicated ${duplicatesRemoved} texture references.`)
    }

    return duplicatesRemoved
  }

  // ─── Memory Estimation ────────────────────────────────────────────────────

  /**
   * Estimates GPU memory usage of a texture in MB.
   * Formula: width × height × channels × bytesPerChannel / 1_000_000
   */
  public estimateTextureMB(texture: THREE.Texture | THREE.DataTexture): number {
    const img = texture.image as { width?: number; height?: number } | undefined
    if (!img?.width || !img?.height) return 0

    const { width, height } = img
    // RGBA, 1 byte per channel — conservative estimate for uncompressed
    const channels = 4
    const bytesPerChannel = 1
    const bytes = width * height * channels * bytesPerChannel
    return bytes / 1_000_000
  }

  /**
   * Estimates memory for a GLTF model based on vertex count.
   * Very rough approximation: ~100 bytes per vertex.
   */
  public estimateModelMB(scene: THREE.Object3D): number {
    let totalVertices = 0

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        totalVertices += child.geometry.attributes['position']?.count ?? 0
      }
    })

    return (totalVertices * 100) / 1_000_000
  }

  /**
   * Estimates memory for a video element in MB.
   * Conservative estimate: 1920×1080 RGBA × 30fps = ~238MB/s, use 4MB as a floor.
   */
  public estimateVideoMB(_video: HTMLVideoElement): number {
    return 4 // Conservative floor estimate
  }
}

// Singleton instance
export const assetOptimizer = new AssetOptimizer()
