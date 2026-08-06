/**
 * @file engine/performance/index.ts
 * @description Barrel export for the performance engine module.
 *
 * Public API:
 * - PerformanceMonitor: Facade for performance systems
 * - DeviceCapabilities: Hardware evaluation
 * - FPSMonitor: Framerate tracking
 * - MemoryMonitor: Heap usage tracking
 * - QualityManager: Active rendering preset state
 */

export * from './DeviceCapabilities'
export * from './FPSMonitor'
export * from './MemoryMonitor'
export * from './PerformanceMonitor'
export * from './QualityManager'
