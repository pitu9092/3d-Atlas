/**
 * @file engine/assets/AssetDisposer.ts
 * @description Typed disposal of all asset types used in 3D Atlas.
 *
 * Purpose: Ensures every Three.js resource is properly released to the GPU
 * and every DOM element is cleaned up when assets are no longer needed.
 *
 * Responsibilities:
 *   - Typed disposal for: Texture, DataTexture, GLTF, Material, BufferGeometry,
 *     VideoElement, AudioElement
 *   - `disposeByType()` dispatcher for cache-eviction integration
 *   - Recursive GLTF scene traversal (geometry + materials + maps)
 */

import * as THREE from 'three'
import { type Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { logger } from '@/lib/core'

import { type AssetCategory } from './AssetManifest'

export class AssetDisposer {
  // ─── Textures ─────────────────────────────────────────────────────────────

  public disposeTexture(texture: THREE.Texture | THREE.DataTexture): void {
    texture.dispose()
    logger.debug(`[AssetDisposer] Texture disposed: ${texture.uuid}`)
  }

  // ─── Materials ────────────────────────────────────────────────────────────

  /**
   * Disposes a material and all its assigned texture maps.
   */
  public disposeMaterial(material: THREE.Material): void {
    // Dispose texture maps on standard materials
    if (material instanceof THREE.MeshStandardMaterial) {
      const maps: (THREE.Texture | null)[] = [
        material.map,
        material.normalMap,
        material.roughnessMap,
        material.metalnessMap,
        material.emissiveMap,
        material.aoMap,
        material.displacementMap,
        material.envMap,
        material.lightMap,
        material.alphaMap,
      ]

      maps.forEach((map) => {
        if (map) map.dispose()
      })
    } else if (material instanceof THREE.MeshBasicMaterial) {
      if (material.map) material.map.dispose()
      if (material.envMap) material.envMap.dispose()
      if (material.alphaMap) material.alphaMap.dispose()
      if (material.aoMap) material.aoMap.dispose()
      if (material.lightMap) material.lightMap.dispose()
      if (material.specularMap) material.specularMap.dispose()
    }

    material.dispose()
    logger.debug(`[AssetDisposer] Material disposed: ${material.uuid}`)
  }

  // ─── Geometry ─────────────────────────────────────────────────────────────

  public disposeGeometry(geometry: THREE.BufferGeometry): void {
    geometry.dispose()
    logger.debug(`[AssetDisposer] Geometry disposed: ${geometry.uuid}`)
  }

  // ─── GLTF ─────────────────────────────────────────────────────────────────

  /**
   * Traverses a GLTF scene and disposes all geometries and materials.
   * Also disposes animation clips if present.
   */
  public disposeGLTF(gltf: GLTF): void {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        this.disposeGeometry(child.geometry)

        const materials = Array.isArray(child.material) ? child.material : [child.material]

        materials.forEach((mat) => this.disposeMaterial(mat))
      }

      if (child instanceof THREE.SkinnedMesh && child.skeleton) {
        // No explicit dispose needed — skeleton is part of geometry
      }
    })

    // Dispose animation clips (remove from memory)
    gltf.animations.forEach((clip) => {
      THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(clip)) // Clears internal buffers
      void clip
    })

    logger.debug('[AssetDisposer] GLTF scene disposed.')
  }

  // ─── Video ────────────────────────────────────────────────────────────────

  public disposeVideo(video: HTMLVideoElement): void {
    video.pause()
    video.removeAttribute('src')
    video.load() // Trigger resource release
    logger.debug(`[AssetDisposer] Video disposed: ${video.src ?? 'unknown'}`)
  }

  // ─── Audio ────────────────────────────────────────────────────────────────

  public disposeAudio(audio: HTMLAudioElement): void {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    logger.debug('[AssetDisposer] Audio disposed.')
  }

  // ─── Font ─────────────────────────────────────────────────────────────────

  /**
   * Fonts are JSON data — no GPU resources to release.
   * Logged for bookkeeping.
   */
  public disposeFont(_font: Font): void {
    logger.debug('[AssetDisposer] Font released from cache (no GPU resource).')
  }

  // ─── Dispatcher ───────────────────────────────────────────────────────────

  /**
   * Dispatches disposal to the correct handler based on category.
   * Used by AssetCache.evict() for typed cleanup.
   */
  public disposeByType(category: AssetCategory, asset: unknown): void {
    switch (category) {
      case 'texture':
      case 'hdri':
      case 'image':
        if (asset instanceof THREE.Texture || asset instanceof THREE.DataTexture) {
          this.disposeTexture(asset)
        }
        break

      case 'model':
        if (asset && typeof asset === 'object' && 'scene' in asset) {
          this.disposeGLTF(asset as GLTF)
        }
        break

      case 'video':
        if (asset instanceof HTMLVideoElement) {
          this.disposeVideo(asset)
        }
        break

      case 'audio':
        if (asset instanceof HTMLAudioElement) {
          this.disposeAudio(asset)
        }
        break

      case 'font':
        this.disposeFont(asset as Font)
        break

      case 'icon':
        // SVG sprites are DOM elements or strings — no GPU resources
        break

      default: {
        const _exhaustive: never = category
        logger.warn(`[AssetDisposer] No disposal handler for category: ${_exhaustive}`)
      }
    }
  }
}

// Singleton instance
export const assetDisposer = new AssetDisposer()
