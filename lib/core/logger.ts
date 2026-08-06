/**
 * @file lib/core/logger.ts
 * @description Centralized logging utility for 3D Atlas.
 *
 * Requirements met:
 * - Development and production loggers
 * - Debug, info, warn, error methods
 * - Group logging
 * - Performance logging
 * - Enable/disable by environment
 */

import { isDev } from './env'
import { featureFlags } from './featureFlags'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
  private prefix = '[3D Atlas]'

  private shouldLog(level: LogLevel): boolean {
    if (!isDev && level !== 'error' && level !== 'warn') {
      return false
    }

    // Check feature flags for debug logging
    if (level === 'debug' && !featureFlags.enableDebug) {
      return false
    }

    return true
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`${this.prefix} [DEBUG] ${message}`, ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`${this.prefix} [INFO] ${message}`, ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`${this.prefix} [WARN] ${message}`, ...args)
    }
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`${this.prefix} [ERROR] ${message}`, error, ...args)
    }
  }

  group(label: string, callback: () => void): void {
    if (this.shouldLog('debug')) {
      console.group(`${this.prefix} ${label}`)
      callback()
      console.groupEnd()
    } else {
      // In production or if debug is off, just execute without grouping
      callback()
    }
  }

  performance(label: string, callback: () => void): void {
    if (this.shouldLog('debug')) {
      console.time(`${this.prefix} [PERF] ${label}`)
      callback()
      console.timeEnd(`${this.prefix} [PERF] ${label}`)
    } else {
      callback()
    }
  }
}

export const logger = new Logger()
