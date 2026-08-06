/**
 * @file engine/renderer/ResizeManager.ts
 * @description Listens to window resizing and computes optimal dimensions.
 *
 * Purpose: Ensures the renderer and camera always know the exact viewport size and safe pixel ratio.
 * Responsibilities: Debounced resize listener, pixel ratio calculation.
 */

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'
import { EngineUtils } from '../shared/EngineUtils'

export class ResizeManager {
  public width = 0
  public height = 0
  public pixelRatio = 1

  private resizeObserver: ResizeObserver | null = null

  /**
   * Starts tracking window/container resizes.
   */
  public start(container: HTMLElement = document.body): void {
    this.updateDimensions(container)

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          this.updateDimensions(container)
        }
      }
    })

    this.resizeObserver.observe(container)
  }

  private updateDimensions(container: HTMLElement): void {
    this.width = container.clientWidth
    this.height = container.clientHeight

    // Clamp pixel ratio for performance
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

  public dispose(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }
}
