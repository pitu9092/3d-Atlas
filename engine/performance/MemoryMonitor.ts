/**
 * @file engine/performance/MemoryMonitor.ts
 * @description Tracks heap memory usage (if supported by browser).
 *
 * Purpose: Detects memory leaks and approaches to memory limits.
 * Responsibilities: performance.memory querying, GC recommendation tracking.
 */

export class MemoryMonitor {
  private maxAllowedMB = 512

  constructor(maxMemoryMB = 512) {
    this.maxAllowedMB = maxMemoryMB
  }

  /**
   * Returns current memory usage if supported, otherwise null.
   */
  public getMemoryStats(): {
    usedMB: number
    totalMB: number
    limitMB: number
    percentage: number
  } | null {
    const perf = performance as unknown as {
      memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
    }
    if (!perf.memory) return null

    const usedMB = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024))
    const totalMB = Math.round(perf.memory.totalJSHeapSize / (1024 * 1024))
    const limitMB = Math.round(perf.memory.jsHeapSizeLimit / (1024 * 1024))

    return {
      usedMB,
      totalMB,
      limitMB,
      percentage: (usedMB / this.maxAllowedMB) * 100,
    }
  }

  /**
   * Checks if memory usage is critical.
   */
  public isCritical(): boolean {
    const stats = this.getMemoryStats()
    if (!stats) return false
    return stats.percentage > 90 || stats.usedMB > this.maxAllowedMB * 0.9
  }
}
