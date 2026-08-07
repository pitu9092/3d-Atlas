/**
 * @file engine/loader/LoaderState.ts
 * @description State machine types for the cinematic loader.
 *
 * Purpose: Defines the loader's lifecycle phases and context shape.
 * Responsibilities: State enum, context interface, transition validation.
 */

// ─── Loader Phase ─────────────────────────────────────────────────────────────

/** Ordered lifecycle phases of the cinematic loader. */
export type LoaderPhase =
  | 'idle' // Initial: loader visible, no progress yet
  | 'loading' // Assets loading, progress updating
  | 'completing' // All loaded, minimum-duration hold
  | 'complete' // Exit transition starting
  | 'hidden' // Fully hidden, component can unmount

// ─── Loader State ─────────────────────────────────────────────────────────────

export interface LoaderStateValue {
  /** Current lifecycle phase. */
  phase: LoaderPhase

  /** Loading progress: 0.0 → 1.0. */
  progress: number

  /** Human-readable label for the current loading operation. */
  currentItem: string | null

  /** Number of assets loaded so far. */
  itemsLoaded: number

  /** Total number of assets expected. */
  itemsTotal: number

  /** True if any asset failed to load. */
  hasErrors: boolean

  /** Elapsed time since loader mount (ms). */
  elapsedMs: number
}

// ─── Phase Transition Guard ───────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<LoaderPhase, LoaderPhase[]> = {
  idle: ['loading'],
  loading: ['completing'],
  completing: ['complete'],
  complete: ['hidden'],
  hidden: [],
}

export function isValidTransition(from: LoaderPhase, to: LoaderPhase): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

// ─── Initial State ────────────────────────────────────────────────────────────

export function createInitialLoaderState(): LoaderStateValue {
  return {
    phase: 'idle',
    progress: 0,
    currentItem: null,
    itemsLoaded: 0,
    itemsTotal: 0,
    hasErrors: false,
    elapsedMs: 0,
  }
}
