/**
 * @file engine/renderer/ResizeManager.ts
 * @description Listens to window and container resizing; computes optimal dimensions.
 *
 * Purpose: Single source of truth for viewport size and pixel ratio.
 * Responsibilities:
 *   - ResizeObserver on container element
 *   - orientationchange event for mobile Safari
 *   - Debounced emission to prevent layout thrashing
 *   - Pixel ratio clamping for performance
 *   - pause / resume (disconnect / reconnect observer)
 */

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'
import { type EngineManager, type LifecycleState, type ViewportInfo } from '../shared/EngineTypes'
import { EngineUtils } from '../shared/EngineUtils'

export class ResizeManager implements EngineManager {
  public state: LifecycleState = 'uninitialized'

  public width = 0
  public height = 0
  public pixelRatio = 1

  private resizeObserver: ResizeObserver | null = null
  private container: HTMLElement | null = null
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private readonly debounceMs = 100

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'
    this.state = 'ready'
  }

  /**
   * Starts tracking resizes on `container` (defaults to `document.body`).
   * Safe to call after `init()`.
   */
  public start(container: HTMLElement = document.body): void {
    if (this.resizeObserver) return // already started

    this.container = container
    this.updateDimensions(container)

    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleUpdate()
    })

    this.resizeObserver.observe(container)

    // Mobile Safari orientation change doesn't always fire ResizeObserver
    window.addEventListener('orientationchange', this.onOrientationChange)

    this.state = 'running'
  }

  public pause(): void {
    if (this.state !== 'running') return
    if (this.resizeObserver && this.container) {
      this.resizeObserver.unobserve(this.container)
    }
    window.removeEventListener('orientationchange', this.onOrientationChange)
    this.state = 'paused'
  }

  public resume(): void {
    if (this.state !== 'paused' || !this.container) return
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.container)
    }
    window.addEventListener('orientationchange', this.onOrientationChange)
    this.state = 'running'
  }

  public dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    window.removeEventListener('orientationchange', this.onOrientationChange)
    this.container = null
    this.state = 'destroyed'
  }

  // ─── Contract ─────────────────────────────────────────────────────────────

  /**
   * Manually trigger a resize update.
   * Part of the EngineManager resize contract — called by EngineRuntime.
   */
  public resize(_width: number, _height: number, _pixelRatio: number): void {
    // ResizeManager IS the source of truth; this is a no-op from the contract perspective.
    // If container is still alive, recompute from DOM.
    if (this.container) {
      this.updateDimensions(this.container)
    }
  }

  // ─── Accessors ────────────────────────────────────────────────────────────

  public getViewport(): ViewportInfo {
    return {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
      aspect: this.height > 0 ? this.width / this.height : 1,
    }
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private scheduleUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(() => {
      if (this.container) {
        this.updateDimensions(this.container)
      }
    }, this.debounceMs)
  }

  private onOrientationChange = (): void => {
    // Small delay to allow layout reflow after orientation change
    setTimeout(() => {
      if (this.container) {
        this.updateDimensions(this.container)
      }
    }, 300)
  }

  private updateDimensions(container: HTMLElement): void {
    this.width = container.clientWidth
    this.height = container.clientHeight

    // Clamp pixel ratio for performance budget
    const rawDpr = window.devicePixelRatio || 1
    this.pixelRatio = EngineUtils.clamp(
      rawDpr,
      EngineConstants.MIN_PIXEL_RATIO,
      EngineConstants.MAX_PIXEL_RATIO,
    )

    globalEventBus.emit('window:resize', {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    })
  }
}
