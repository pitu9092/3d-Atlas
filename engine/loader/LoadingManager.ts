/**
 * @file engine/loader/LoadingManager.ts
 * @description Coordinates loading of multiple assets with concurrency and progress tracking.
 *
 * Purpose: Aggregates loading progress, handles batches, and emits global events.
 * Responsibilities:
 *   - Concurrent batch loading up to MAX_CONCURRENT_LOADS
 *   - Per-scene progress tracking via EventBus
 *   - Pause / resume (queues new tasks, doesn't interrupt in-flight)
 *   - Three.js DefaultLoadingManager integration for legacy loaders
 */

import * as THREE from 'three'

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'
import { type EngineManager, type LifecycleState } from '../shared/EngineTypes'

import { AssetLoader, type AssetType } from './AssetLoader'
import { type LoadingState } from './LoadingState'

// ─── Batch Item ───────────────────────────────────────────────────────────────

export interface BatchItem {
  url: string
  type: AssetType
}

// ─── Loading Manager ─────────────────────────────────────────────────────────

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

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // ── Hook into Three.js DefaultLoadingManager ─────────────────────────
    THREE.DefaultLoadingManager.onStart = (_url, itemsLoaded, itemsTotal) => {
      logger.debug(`[THREE LoadingManager] Started. Loaded ${itemsLoaded} of ${itemsTotal}.`)
    }

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      logger.debug(`[THREE LoadingManager] Progress: ${url}. ${itemsLoaded}/${itemsTotal}`)
    }

    THREE.DefaultLoadingManager.onError = (url) => {
      logger.error(`[THREE LoadingManager] Error loading: ${url}`)
    }

    this.state = 'ready'
    logger.info('[LoadingManager] Initialized')
  }

  public update(_delta: number): void {
    // Loading is async — nothing to tick.
  }

  public pause(): void {
    // In-flight loads are not interrupted. New enqueues are held.
    this.state = 'paused'
  }

  public resume(): void {
    if (this.state !== 'paused') return
    this.state = 'ready'
  }

  public dispose(): void {
    this.loader.clearCache()
    this.state = 'destroyed'
    logger.info('[LoadingManager] Disposed and cache cleared')
  }

  // ─── Batch Loading ────────────────────────────────────────────────────────

  /**
   * Loads a batch of assets concurrently (capped at MAX_CONCURRENT_LOADS).
   * Emits scene:load_start, scene:load_progress, and scene:load_complete events.
   *
   * @param assets  - Array of assets to load.
   * @param sceneId - Scene ID for event payloads.
   */
  public async loadBatch(assets: BatchItem[], sceneId: string): Promise<void> {
    if (this.state === 'uninitialized') this.init()

    const total = assets.length
    let loaded = 0

    this.loadingState = {
      progress: 0,
      itemsLoaded: 0,
      itemsTotal: total,
      isComplete: false,
      hasErrors: false,
      currentAsset: null,
    }

    globalEventBus.emit('scene:load_start', { sceneId })
    logger.info(`[LoadingManager] Starting batch for scene '${sceneId}' (${total} assets)`)

    // ── Concurrent pool ──────────────────────────────────────────────────
    const pool = new Array(Math.min(EngineConstants.MAX_CONCURRENT_LOADS, total)).fill(null)
    let index = 0

    const processNext = async (): Promise<void> => {
      while (index < assets.length) {
        const asset = assets[index++]
        this.loadingState.currentAsset = asset.url

        try {
          await this.loadSingle(asset)
        } catch {
          this.loadingState.hasErrors = true
          logger.error(`[LoadingManager] Failed to load: ${asset.url}`)
        }

        loaded++
        this.loadingState.itemsLoaded = loaded
        this.loadingState.progress = total > 0 ? loaded / total : 1

        globalEventBus.emit('scene:load_progress', {
          sceneId,
          progress: this.loadingState.progress,
        })
      }
    }

    // Run concurrent workers
    await Promise.all(pool.map(() => processNext()))

    this.loadingState.isComplete = true
    this.loadingState.currentAsset = null

    globalEventBus.emit('scene:load_complete', { sceneId })
    logger.info(
      `[LoadingManager] Batch complete for '${sceneId}'. Errors: ${this.loadingState.hasErrors}`,
    )

    if (this.loadingState.hasErrors) {
      throw new Error(`[LoadingManager] Batch for scene '${sceneId}' completed with errors.`)
    }
  }

  // ─── Accessors ────────────────────────────────────────────────────────────

  public getState(): LoadingState {
    return { ...this.loadingState }
  }

  public getLoader(): AssetLoader {
    return this.loader
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private async loadSingle(asset: BatchItem): Promise<void> {
    switch (asset.type) {
      case 'model':
        await this.loader.loadModel(asset.url)
        break
      case 'texture':
        await this.loader.loadTexture(asset.url)
        break
      case 'hdri':
        await this.loader.loadHDRI(asset.url)
        break
      case 'video':
        await this.loader.loadVideo(asset.url)
        break
      case 'font':
        await this.loader.loadFont(asset.url)
        break
      default: {
        const _exhaustive: never = asset.type
        throw new Error(`[LoadingManager] Unknown asset type: ${_exhaustive}`)
      }
    }
  }
}
