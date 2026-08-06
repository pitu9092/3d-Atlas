/**
 * @file engine/loader/LoadingState.ts
 * @description State interface for the loading process.
 *
 * Purpose: Tracks progress and loaded item counts across the application.
 */

export interface LoadingState {
  progress: number // 0 to 1
  itemsLoaded: number
  itemsTotal: number
  isComplete: boolean
  hasErrors: boolean
  currentAsset: string | null
}
