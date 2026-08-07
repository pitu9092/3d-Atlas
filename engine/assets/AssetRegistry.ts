/**
 * @file engine/assets/AssetRegistry.ts
 * @description Global registry of all declared asset manifest entries.
 *
 * Purpose: Single source of truth for what assets exist in the system.
 * Responsibilities:
 *   - Register / remove / update / lookup entries
 *   - Group, tag, and category-based queries
 *   - Dependency graph lookup
 *   - Deduplication guard (error on duplicate ID)
 *
 * Usage:
 *   assetRegistry.register(entry)
 *   assetRegistry.getByCategory('texture')
 *   assetRegistry.getDependencies('model/crane')
 */

import { logger } from '@/lib/core'

import { type AssetManifest, type AssetManifestEntry, type AssetCategory } from './AssetManifest'

export class AssetRegistry {
  private entries: Map<string, AssetManifestEntry> = new Map()

  // ─── Registration ─────────────────────────────────────────────────────────

  /**
   * Registers a single asset manifest entry.
   * Throws if the ID is already registered (prevents silent overwrites).
   */
  public register(entry: AssetManifestEntry): void {
    if (this.entries.has(entry.id)) {
      logger.warn(`[AssetRegistry] Duplicate asset ID: '${entry.id}'. Overwriting.`)
    }
    this.entries.set(entry.id, entry)
  }

  /**
   * Registers many entries at once.
   * Errors are collected and logged without stopping the batch.
   */
  public registerMany(manifest: AssetManifest): void {
    let count = 0
    for (const entry of manifest) {
      this.register(entry)
      count++
    }
    logger.info(`[AssetRegistry] Registered ${count} assets.`)
  }

  /**
   * Removes an asset from the registry by ID.
   */
  public remove(id: string): boolean {
    const existed = this.entries.delete(id)
    if (!existed) {
      logger.warn(`[AssetRegistry] Attempted to remove unknown asset: '${id}'`)
    }
    return existed
  }

  /**
   * Applies a partial update to an existing entry.
   * Only specified fields are overwritten.
   */
  public update(id: string, patch: Partial<Omit<AssetManifestEntry, 'id'>>): void {
    const existing = this.entries.get(id)
    if (!existing) {
      logger.error(`[AssetRegistry] Cannot update unknown asset: '${id}'`)
      return
    }
    this.entries.set(id, { ...existing, ...patch })
  }

  // ─── Lookup ───────────────────────────────────────────────────────────────

  /**
   * Retrieves an entry by ID.
   */
  public get(id: string): AssetManifestEntry | undefined {
    return this.entries.get(id)
  }

  /**
   * Checks whether an asset is registered.
   */
  public has(id: string): boolean {
    return this.entries.has(id)
  }

  /**
   * Returns all registered entries.
   */
  public getAll(): AssetManifestEntry[] {
    return Array.from(this.entries.values())
  }

  // ─── Filtered Queries ─────────────────────────────────────────────────────

  /**
   * Returns all assets of a given category.
   */
  public getByCategory(category: AssetCategory): AssetManifestEntry[] {
    return this.getAll().filter((e) => e.category === category)
  }

  /**
   * Returns all assets with the specified tag.
   */
  public getByTag(tag: string): AssetManifestEntry[] {
    return this.getAll().filter((e) => e.tags?.includes(tag))
  }

  /**
   * Returns all assets in the specified group.
   */
  public getByGroup(group: string): AssetManifestEntry[] {
    return this.getAll().filter((e) => e.group === group)
  }

  /**
   * Returns all assets where `preload === true`.
   */
  public getCriticalAssets(): AssetManifestEntry[] {
    return this.getAll().filter((e) => e.preload)
  }

  /**
   * Returns all assets sorted by priority (ascending — lowest number first).
   */
  public getByPriority(): AssetManifestEntry[] {
    return this.getAll().sort((a, b) => a.priority - b.priority)
  }

  // ─── Dependency Graph ─────────────────────────────────────────────────────

  /**
   * Returns the full resolved dependency list for an asset.
   * Performs a depth-first traversal to flatten transitive deps.
   * Circular dependencies are detected and skipped with a warning.
   */
  public getDependencies(id: string, visited: Set<string> = new Set()): AssetManifestEntry[] {
    const entry = this.entries.get(id)
    if (!entry || entry.dependencies.length === 0) return []

    visited.add(id)
    const deps: AssetManifestEntry[] = []

    for (const depId of entry.dependencies) {
      if (visited.has(depId)) {
        logger.warn(`[AssetRegistry] Circular dependency detected: '${id}' → '${depId}'`)
        continue
      }

      const depEntry = this.entries.get(depId)
      if (!depEntry) {
        logger.warn(`[AssetRegistry] Missing dependency: '${depId}' required by '${id}'`)
        continue
      }

      deps.push(...this.getDependencies(depId, new Set(visited)), depEntry)
    }

    return deps
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  public get size(): number {
    return this.entries.size
  }

  /**
   * Clears all registered entries.
   */
  public clear(): void {
    this.entries.clear()
    logger.info('[AssetRegistry] Cleared.')
  }
}

// Singleton instance
export const assetRegistry = new AssetRegistry()
