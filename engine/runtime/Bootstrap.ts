/**
 * @file engine/runtime/Bootstrap.ts
 * @description Application-level engine bootstrap.
 *
 * Purpose: Provides a single static entry point to boot the engine
 * and export the active runtime instance.
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { EngineEvents } from '../shared/EngineEvents'

import { EngineInitializer } from './EngineInitializer'
import { EngineRuntime } from './EngineRuntime'

class EngineBootstrap {
  private runtime: EngineRuntime | null = null

  public async boot(): Promise<EngineRuntime> {
    if (this.runtime) {
      logger.warn('Engine is already booted. Returning existing runtime.')
      return this.runtime
    }

    try {
      globalEventBus.emit(EngineEvents.SYSTEM_INIT)

      // 1. Static Configuration
      EngineInitializer.init()

      // 2. Runtime Instantiation
      this.runtime = new EngineRuntime()

      // 3. Manager Initialization
      await this.runtime.init()

      globalEventBus.emit(EngineEvents.SYSTEM_READY)
      logger.info('🚀 3D Atlas Engine Boot Sequence Complete')

      return this.runtime
    } catch (error) {
      logger.error('Fatal error during engine boot sequence', error)
      throw error
    }
  }

  public getRuntime(): EngineRuntime {
    if (!this.runtime) {
      throw new Error('EngineRuntime accessed before boot. Call Bootstrap.boot() first.')
    }
    return this.runtime
  }

  public shutdown(): void {
    if (this.runtime) {
      globalEventBus.emit(EngineEvents.SYSTEM_DISPOSE)
      this.runtime.dispose()
      this.runtime = null
      logger.info('Engine shutdown complete.')
    }
  }
}

// Export a singleton instance of the bootstrap
export const Bootstrap = new EngineBootstrap()
