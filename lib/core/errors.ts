/**
 * @file lib/core/errors.ts
 * @description Centralized error utilities for 3D Atlas.
 *
 * Requirements met:
 * - Application Errors
 * - Configuration Errors
 * - Asset Errors
 * - Animation Errors
 * - Three Errors
 * - Network Errors
 * - Safe error formatting
 */

export class AppError extends Error {
  public readonly code: string
  public readonly metadata?: Record<string, unknown>

  constructor(message: string, code = 'APP_ERROR', metadata?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.metadata = metadata
    Error.captureStackTrace?.(this, this.constructor)
  }
}

export class ConfigError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', metadata)
  }
}

export class AssetError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'ASSET_ERROR', metadata)
  }
}

export class AnimationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'ANIMATION_ERROR', metadata)
  }
}

export class ThreeError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'THREE_ERROR', metadata)
  }
}

export class NetworkError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', metadata)
  }
}

/**
 * Safely formats any thrown value into an Error object.
 */
export function formatError(err: unknown): Error {
  if (err instanceof Error) {
    return err
  }

  if (typeof err === 'string') {
    return new Error(err)
  }

  try {
    return new Error(JSON.stringify(err))
  } catch {
    return new Error(String(err))
  }
}
