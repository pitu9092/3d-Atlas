/**
 * @file engine/performance/DeviceCapabilities.ts
 * @description Analyzes device hardware capabilities.
 *
 * Purpose: Determines safe performance budgets based on client hardware.
 * Responsibilities: WebGL support check, GPU tiering, memory limits.
 */

export interface DeviceInfo {
  isMobile: boolean
  hasWebGL2: boolean
  maxTextureSize: number
  hardwareConcurrency: number
  deviceMemoryMB?: number
  gpuName: string
  tier: 'low' | 'medium' | 'high' | 'ultra'
}

export class DeviceCapabilities {
  private static info: DeviceInfo | null = null

  /**
   * Evaluates and caches device capabilities.
   */
  public static evaluate(): DeviceInfo {
    if (this.info) return this.info

    const isClient = typeof window !== 'undefined'
    if (!isClient) {
      return this.getFallbackInfo()
    }

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    const hasWebGL2 = !!canvas.getContext('webgl2')

    let maxTextureSize = 2048
    let gpuName = 'Unknown GPU'

    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }

    const nav = navigator as unknown as {
      hardwareConcurrency?: number
      deviceMemory?: number
      userAgent: string
    }
    const hardwareConcurrency = nav.hardwareConcurrency || 4
    const deviceMemoryMB = nav.deviceMemory ? nav.deviceMemory * 1024 : undefined

    this.info = {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
      hasWebGL2,
      maxTextureSize,
      hardwareConcurrency,
      deviceMemoryMB,
      gpuName,
      tier: this.determineTier(
        maxTextureSize,
        hardwareConcurrency,
        deviceMemoryMB,
        this.isMobile(nav.userAgent),
      ),
    }

    return this.info
  }

  private static isMobile(userAgent: string): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  }

  private static determineTier(
    maxTexture: number,
    cores: number,
    _memory?: number,
    isMobile?: boolean,
  ): 'low' | 'medium' | 'high' | 'ultra' {
    if (isMobile) {
      if (maxTexture <= 4096 || cores <= 4) return 'low'
      return 'medium'
    }

    if (maxTexture <= 4096 || cores <= 4) return 'low'
    if (maxTexture <= 8192 && cores <= 8) return 'medium'
    if (maxTexture >= 16384 && cores > 8) return 'ultra'

    return 'high'
  }

  private static getFallbackInfo(): DeviceInfo {
    return {
      isMobile: false,
      hasWebGL2: false,
      maxTextureSize: 2048,
      hardwareConcurrency: 4,
      gpuName: 'Server',
      tier: 'low',
    }
  }
}
