/**
 * @file engine/renderer/CanvasManager.ts
 * @description Manages the primary WebGL canvas DOM element.
 *
 * Purpose: Ensures the canvas mounts correctly, applies base CSS, and tracks its dimensions.
 */

export class CanvasManager {
  private canvas: HTMLCanvasElement | null = null
  private container: HTMLElement | null = null

  /**
   * Mounts the canvas to a container element.
   */
  public mount(container: HTMLElement): HTMLCanvasElement {
    this.container = container

    // In React Three Fiber this is often handled by <Canvas>,
    // but the engine architecture supports raw Three.js fallback or container tracking.
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.outline = 'none'
    this.canvas.style.touchAction = 'none'

    this.container.appendChild(this.canvas)

    return this.canvas
  }

  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas
  }

  public getContainer(): HTMLElement | null {
    return this.container
  }

  public dispose(): void {
    if (this.container && this.canvas) {
      this.container.removeChild(this.canvas)
    }
    this.canvas = null
    this.container = null
  }
}
