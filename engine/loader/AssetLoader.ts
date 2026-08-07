/**
 * @file engine/loader/AssetLoader.ts
 * @description Wrapper for Three.js loading mechanisms.
 *
 * Purpose: Centralizes loading logic for GLTF, Textures, HDRIs, Audio, etc.
 * Responsibilities: Caching, parsing, error handling for individual assets.
 *
 * Note: Actual Three.js implementations (GLTFLoader, TextureLoader) will be
 * integrated here during the implementation phase. This is the architectural shell.
 */

import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export class AssetLoader {
  private cache: Map<string, unknown> = new Map()

  private textureLoader = new THREE.TextureLoader()
  private gltfLoader = new GLTFLoader()
  private rgbeLoader = new RGBELoader()

  constructor() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/') // Assumes draco is copied to public/draco
    this.gltfLoader.setDRACOLoader(dracoLoader)
  }

  /**
   * Loads a GLTF/GLB model.
   */
  public async loadModel(url: string): Promise<unknown> {
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.cache.set(url, gltf)
          resolve(gltf)
        },
        undefined,
        reject,
      )
    })
  }

  /**
   * Loads a texture.
   */
  public async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as THREE.Texture
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.cache.set(url, texture)
          resolve(texture)
        },
        undefined,
        reject,
      )
    })
  }

  /**
   * Loads an HDRI environment map.
   */
  public async loadHDRI(url: string): Promise<THREE.DataTexture> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as THREE.DataTexture
    }

    return new Promise((resolve, reject) => {
      this.rgbeLoader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping
          this.cache.set(url, texture)
          resolve(texture)
        },
        undefined,
        reject,
      )
    })
  }

  /**
   * Clears the asset cache to free memory.
   */
  public clearCache(): void {
    this.cache.forEach((asset) => {
      if (asset instanceof THREE.Texture || asset instanceof THREE.DataTexture) {
        asset.dispose()
      } else if (asset && typeof asset === 'object' && 'scene' in asset) {
        // GLTF
        const gltf = asset as { scene: THREE.Scene }
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material?.dispose()
            }
          }
        })
      }
    })
    this.cache.clear()
  }
}
