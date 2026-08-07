/**
 * @file engine/runtime/Bootstrap.ts
 * @description Single static entry point to boot the 3D Atlas engine.
 *
 * Purpose: Provides `Bootstrap.boot()` — call once at application mount.
 * Responsibilities:
 *   - Run EngineInitializer (GSAP plugin registration, global defaults)
 *   - Instantiate EngineRuntime
 *   - Initialize all managers
 *   - Start the ResizeManager (begin tracking viewport)
 *   - Start the RenderLoop (begin ticking)
 *   - Emit system:ready event
 *   - Provide getRuntime() for late access
 *   - Provide shutdown() for clean teardown
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { EngineEvents } from '../shared/EngineEvents'

import { EngineInitializer } from './EngineInitializer'
import { EngineRuntime } from './EngineRuntime'

class EngineBootstrap {
  private runtime: EngineRuntime | null = null
  private bootPromise: Promise<EngineRuntime> | null = null

  /**
   * Boots the engine. Safe to call multiple times — returns the same runtime.
   * Idempotent: concurrent calls share a single boot promise.
   */
  public async boot(): Promise<EngineRuntime> {
    // Already booted
    if (this.runtime) {
      logger.warn('[Bootstrap] Engine already booted. Returning existing runtime.')
      return this.runtime
    }

    // Boot in progress — share the promise
    if (this.bootPromise) {
      return this.bootPromise
    }

    this.bootPromise = this.runBoot()
    return this.bootPromise
  }

  /**
   * Returns the runtime after boot. Throws if called before `boot()`.
   */
  public getRuntime(): EngineRuntime {
    if (!this.runtime) {
      throw new Error(
        '[Bootstrap] EngineRuntime accessed before boot. Call Bootstrap.boot() first.',
      )
    }
    return this.runtime
  }

  /**
   * Returns true if the engine has been booted successfully.
   */
  public get isBooted(): boolean {
    return this.runtime !== null
  }

  /**
   * Shuts down the engine and destroys the runtime.
   * After this, `boot()` can be called again.
   */
  public shutdown(): void {
    if (!this.runtime) {
      logger.warn('[Bootstrap] Shutdown called but engine is not running.')
      return
    }

    globalEventBus.emit(EngineEvents.SYSTEM_DISPOSE)
    this.runtime.dispose()
    this.runtime = null
    this.bootPromise = null

    logger.info('[Bootstrap] Engine shutdown complete.')
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private async runBoot(): Promise<EngineRuntime> {
    try {
      logger.info('[Bootstrap] 🚀 Starting 3D Atlas Engine boot sequence...')
      globalEventBus.emit(EngineEvents.SYSTEM_INIT)

      // ── 1. Static prerequisites (GSAP plugins, global defaults) ─────────
      EngineInitializer.init()

      // ── 2. Runtime instantiation ─────────────────────────────────────────
      this.runtime = new EngineRuntime()

      // ── 3. Manager initialization ────────────────────────────────────────
      await this.runtime.init()

      // ── 4. Start ResizeManager (begin tracking viewport) ─────────────────
      if (typeof document !== 'undefined') {
        this.runtime.renderer.resizeManager.start(document.body)
      }

      // ── 5. Start RenderLoop (begin ticking) ──────────────────────────────
      this.runtime.renderer.loop.start()

      // ── 6. Emit system ready ─────────────────────────────────────────────
      globalEventBus.emit(EngineEvents.SYSTEM_READY)
      logger.info('[Bootstrap] ✅ 3D Atlas Engine boot sequence complete.')

      return this.runtime
    } catch (error) {
      logger.error('[Bootstrap] ❌ Fatal error during engine boot sequence', error)
      this.runtime = null
      this.bootPromise = null
      throw error
    }
  }
}

// Singleton bootstrap instance
export const Bootstrap = new EngineBootstrap()
