/**
 * @file engine/loader/AssetLoader.ts
 * @description Full asset loading system for 3D Atlas.
 *
 * Purpose: Centralizes loading of GLTF/GLB, textures, HDRIs, videos, and fonts.
 * Responsibilities:
 *   - Per-type loaders (GLTF, Draco, Meshopt, RGBE, Texture, Video, Font)
 *   - LRU-style cache with typed retrieval
 *   - Retry strategy with exponential back-off
 *   - Concurrent load queue (capped at EngineConstants.MAX_CONCURRENT_LOADS)
 *   - Full Three.js type-safe GLTF return via GLTF type from drei
 */

import * as THREE from 'three'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { logger } from '@/lib/core'

import { EngineConstants } from '../shared/EngineConstants'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssetType = 'model' | 'texture' | 'hdri' | 'video' | 'font'

interface LoadTask {
  url: string
  type: AssetType
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  attempts: number
}

// ─── Retry Configuration ─────────────────────────────────────────────────────

const MAX_RETRY_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 500

function retryDelay(attempt: number): number {
  return RETRY_BASE_DELAY_MS * Math.pow(2, attempt)
}

// ─── Asset Loader ────────────────────────────────────────────────────────────

export class AssetLoader {
  private cache: Map<string, unknown> = new Map()

  private textureLoader = new THREE.TextureLoader()
  private gltfLoader: GLTFLoader
  private rgbeLoader = new RGBELoader()
  private fontLoader = new FontLoader()

  /** Active concurrent load count. */
  private activeLoads = 0

  /** Pending tasks waiting for a slot. */
  private queue: LoadTask[] = []

  constructor() {
    // ── Draco decoder ──────────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')

    // ── Meshopt decoder ────────────────────────────────────────────────────
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(dracoLoader)
    this.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /** Load a GLTF/GLB model. Returns cached result if already loaded. */
  public async loadModel(url: string): Promise<GLTF> {
    return this.enqueue<GLTF>(url, 'model')
  }

  /** Load a texture. Returns cached result if already loaded. */
  public async loadTexture(url: string): Promise<THREE.Texture> {
    return this.enqueue<THREE.Texture>(url, 'texture')
  }

  /** Load an HDRI environment map. Returns cached result if already loaded. */
  public async loadHDRI(url: string): Promise<THREE.DataTexture> {
    return this.enqueue<THREE.DataTexture>(url, 'hdri')
  }

  /**
   * Load a video as an HTMLVideoElement.
   * The video is muted, set to loop, and preloaded automatically.
   */
  public async loadVideo(url: string): Promise<HTMLVideoElement> {
    return this.enqueue<HTMLVideoElement>(url, 'video')
  }

  /** Load a Three.js font JSON file (for TextGeometry). */
  public async loadFont(url: string): Promise<Font> {
    return this.enqueue<Font>(url, 'font')
  }

  /**
   * Retrieve a cached asset by URL and type.
   * Returns null if not in cache.
   */
  public getFromCache<T>(url: string): T | null {
    return (this.cache.get(url) as T) ?? null
  }

  /** Check whether a URL is already cached. */
  public isCached(url: string): boolean {
    return this.cache.has(url)
  }

  /**
   * Clears the cache and disposes Three.js resources.
   */
  public clearCache(): void {
    this.cache.forEach((asset, url) => {
      this.disposeAsset(url, asset)
    })
    this.cache.clear()
    logger.info('[AssetLoader] Cache cleared')
  }

  /**
   * Clears a single URL from the cache and disposes its resource.
   */
  public evict(url: string): void {
    const asset = this.cache.get(url)
    if (asset !== undefined) {
      this.disposeAsset(url, asset)
      this.cache.delete(url)
    }
  }

  // ─── Internal Queue ──────────────────────────────────────────────────────

  /**
   * Enqueues a load task with concurrency control.
   * Resolves from cache immediately if available.
   */
  private enqueue<T>(url: string, type: AssetType): Promise<T> {
    // Cache hit — resolve immediately
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url) as T)
    }

    return new Promise<T>((resolve, reject) => {
      const task: LoadTask = {
        url,
        type,
        resolve: resolve as (v: unknown) => void,
        reject,
        attempts: 0,
      }

      this.queue.push(task)
      this.drain()
    })
  }

  /** Drains the queue up to the concurrency limit. */
  private drain(): void {
    while (this.activeLoads < EngineConstants.MAX_CONCURRENT_LOADS && this.queue.length > 0) {
      const task = this.queue.shift()!
      this.executeTask(task)
    }
  }

  private executeTask(task: LoadTask): void {
    this.activeLoads++

    this.loadRaw(task.url, task.type)
      .then((result) => {
        this.cache.set(task.url, result)
        task.resolve(result)
      })
      .catch((error: unknown) => {
        task.attempts++

        if (task.attempts < MAX_RETRY_ATTEMPTS) {
          const delay = retryDelay(task.attempts)
          logger.warn(
            `[AssetLoader] Load failed for '${task.url}'. Retrying in ${delay}ms (attempt ${task.attempts}/${MAX_RETRY_ATTEMPTS})`,
          )

          setTimeout(() => {
            this.queue.unshift(task) // Priority re-queue at front
            this.drain()
          }, delay)
        } else {
          logger.error(
            `[AssetLoader] Failed to load '${task.url}' after ${MAX_RETRY_ATTEMPTS} attempts`,
            error,
          )
          task.reject(error)
        }
      })
      .finally(() => {
        this.activeLoads--
        this.drain()
      })
  }

  // ─── Raw Loaders ─────────────────────────────────────────────────────────

  private loadRaw(url: string, type: AssetType): Promise<unknown> {
    switch (type) {
      case 'model':
        return this.loadRawModel(url)
      case 'texture':
        return this.loadRawTexture(url)
      case 'hdri':
        return this.loadRawHDRI(url)
      case 'video':
        return this.loadRawVideo(url)
      case 'font':
        return this.loadRawFont(url)
      default: {
        const _exhaustive: never = type
        return Promise.reject(new Error(`Unknown asset type: ${_exhaustive}`))
      }
    }
  }

  private loadRawModel(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, resolve, undefined, reject)
    })
  }

  private loadRawTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject)
    })
  }

  private loadRawHDRI(url: string): Promise<THREE.DataTexture> {
    return new Promise((resolve, reject) => {
      this.rgbeLoader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping
          resolve(texture)
        },
        undefined,
        reject,
      )
    })
  }

  private loadRawVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.src = url
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = 'auto'
      video.crossOrigin = 'anonymous'

      const onCanPlay = (): void => {
        video.removeEventListener('canplaythrough', onCanPlay)
        video.removeEventListener('error', onError)
        resolve(video)
      }

      const onError = (): void => {
        video.removeEventListener('canplaythrough', onCanPlay)
        video.removeEventListener('error', onError)
        reject(new Error(`[AssetLoader] Failed to load video: ${url}`))
      }

      video.addEventListener('canplaythrough', onCanPlay)
      video.addEventListener('error', onError)
      video.load()
    })
  }

  private loadRawFont(url: string): Promise<Font> {
    return new Promise((resolve, reject) => {
      this.fontLoader.load(url, resolve, undefined, reject)
    })
  }

  // ─── Disposal Helpers ────────────────────────────────────────────────────

  private disposeAsset(url: string, asset: unknown): void {
    if (asset instanceof THREE.Texture || asset instanceof THREE.DataTexture) {
      asset.dispose()
      return
    }

    // GLTF: dispose meshes, geometries, materials
    if (asset && typeof asset === 'object' && 'scene' in asset) {
      const gltf = asset as GLTF
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          const mat = child.material
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose())
          } else {
            mat?.dispose()
          }
        }
      })
      return
    }

    // Video element: pause and clear src
    if (asset instanceof HTMLVideoElement) {
      asset.pause()
      asset.src = ''
      asset.load()
      return
    }

    logger.debug(`[AssetLoader] No specific disposal for cached asset: ${url}`)
  }
}
