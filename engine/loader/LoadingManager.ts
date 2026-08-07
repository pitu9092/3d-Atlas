/**
 * @file engine/loader/LoadingManager.ts
 * @description Coordinates the loading of multiple assets.
 *
 * Purpose: Aggregates loading progress, handles batches, and emits global events.
 * Responsibilities: Batch queueing, concurrency control, global Three.js DefaultLoadingManager integration.
 */

import * as THREE from 'three'

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { type EngineManager, type LifecycleState } from '../shared/EngineTypes'

import { AssetLoader } from './AssetLoader'
import { type LoadingState } from './LoadingState'

export class LoadingManager implements EngineManager {
  public state: LifecycleState = 'uninitialized'
  private loader: AssetLoader

  private loadingState: LoadingState = {
    progress: 0,
    itemsLoaded: 0,
    itemsTotal: 0,
    isComplete: false,
    hasErrors: false,
    currentAsset: null,
  }

  constructor() {
    this.loader = new AssetLoader()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      logger.debug(`[THREE] Started loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal}.`)
    }

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      logger.debug(`[THREE] Loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal}.`)
    }

    THREE.DefaultLoadingManager.onError = (url) => {
      logger.error(`[THREE] Error loading: ${url}`)
    }

    this.state = 'ready'
  }

  /**
   * Loads a manifest or array of assets, emitting progress events.
   */
  public async loadBatch(
    assets: { url: string; type: 'model' | 'texture' | 'hdri' }[],
    sceneId: string,
  ): Promise<void> {
    if (this.state === 'uninitialized') this.init()

    this.loadingState.itemsTotal = assets.length
    this.loadingState.itemsLoaded = 0
    this.loadingState.progress = 0
    this.loadingState.isComplete = false
    this.loadingState.hasErrors = false

    globalEventBus.emit('scene:load_start', { sceneId })

    try {
      // Basic serial loading for architecture shell; will implement concurrent batching later
      for (const asset of assets) {
        this.loadingState.currentAsset = asset.url

        if (asset.type === 'model') await this.loader.loadModel(asset.url)
        else if (asset.type === 'texture') await this.loader.loadTexture(asset.url)
        else if (asset.type === 'hdri') await this.loader.loadHDRI(asset.url)

        this.loadingState.itemsLoaded++
        this.loadingState.progress = this.loadingState.itemsLoaded / this.loadingState.itemsTotal

        globalEventBus.emit('scene:load_progress', {
          sceneId,
          progress: this.loadingState.progress,
        })
      }

      this.loadingState.isComplete = true
      globalEventBus.emit('scene:load_complete', { sceneId })
    } catch (error) {
      this.loadingState.hasErrors = true
      logger.error(`Failed to load batch for scene ${sceneId}`, error)
      throw error
    }
  }

  public getState(): LoadingState {
    return { ...this.loadingState }
  }

  public dispose(): void {
    this.loader.clearCache()
    this.state = 'destroyed'
  }
}
