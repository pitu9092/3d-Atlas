'use client'

/**
 * @file components/scenes/scene01/Scene01Canvas.tsx
 * @description Canvas placeholder for Scene 01.
 *
 * Scene 01 (Atmosphere Transition) is a pure DOM/CSS visual effect — no 3D canvas.
 * This file exists for API consistency with other scenes and as an extension point
 * if a 3D horizon sphere is added in future.
 *
 * Per 07_ThreeBlueprint.md: The Globe canvas (Hero) deactivates when the hero
 * section exits the viewport. Scene 01 uses no additional canvas.
 */

export function Scene01Canvas() {
  // Intentionally empty — Scene 01 has no 3D canvas.
  // The Hero's Globe canvas fades out as we scroll into this section.
  return null
}
