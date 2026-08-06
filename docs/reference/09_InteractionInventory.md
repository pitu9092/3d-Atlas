# 09 — Interaction Inventory

---

## Custom Cursor

### Type

Circular ring cursor replacing the native OS cursor.

### Behavior

- **Follow**: Tracks mouse position with lerp smoothing (~0.08–0.12 lerp factor)
- **Lag**: Visible lag behind actual mouse position — creates inertia feel
- **Rotation**: Ring appears to have a continuous slow rotation animation
- **Shape**: Circle outline, ~32–48px diameter, 1–2px border width
- **Color adaptation**: White on dark backgrounds, inverts/darkens on light backgrounds
- **Scale**: May scale up on hover over interactive elements (magnetic effect)

### Implementation Notes

```
requestAnimationFrame loop:
  cursorX += (mouseX - cursorX) * 0.1
  cursorY += (mouseY - cursorY) * 0.1
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
```

---

## Scroll

### Primary Interaction

Scroll is the **primary interaction driver** for the entire experience. Everything — camera movement, 3D model animation, section transitions, and text reveals — is driven by scroll position.

### Scroll System

- **Engine**: Lenis (smooth scroll with inertia)
- **Type**: Vertical scroll only
- **Behavior**: Smooth, heavily damped — very premium feel
- **Speed**: Standard scroll speed (not dramatically modified)
- **Snap**: No visible snap points — free scroll

### Scroll-Driven Animations

| Element                 | Scroll Behavior                                     |
| ----------------------- | --------------------------------------------------- |
| Globe rotation          | Slow rotation relative to scroll (parallax)         |
| Globe zoom              | Camera pulls back as hero is scrolled past          |
| Atmosphere reveal       | Blue band fades in as globe section exits           |
| Text reveals            | ScrollTrigger: trigger on element entering viewport |
| Reach stacker animation | Crane arm movement synced 1:1 with scroll progress  |
| Truck positioning       | Truck may slide in from left with scroll            |
| Ship scene labels       | Fade in as user scrolls through pinned ship section |
| Wipe transition         | Fully scrubbed — exact progress tied to scroll      |
| Aircraft position       | Camera angle / aircraft banking tied to scroll      |

---

## Mouse Move / Parallax

### Globe Scene

- **Probable behavior**: Mouse movement causes subtle globe tilt or camera slight offset
- **Effect**: Gives the globe a "looking at you" quality as cursor moves
- **Magnitude**: Very small — ~2–5% of mouse offset
- **UNKNOWN**: Cannot confirm from video — camera may be static with only scroll movement

### General Parallax

- **UNKNOWN**: Whether DOM elements have mouse-based parallax
- **3D scenes**: Mouse movement may subtly shift camera or model rotation

---

## Hover Interactions

### Navigation Links

- **Effect**: Underline slide-in OR text color change
- **Duration**: ~150–200ms
- **UNKNOWN**: Cannot confirm exact hover style from reference video

### CTA Buttons

- **Effect**: Background fill animation (likely from left) OR scale transform
- **Type**: CSS transition or GSAP hover
- **UNKNOWN**: Exact effect not confirmable from reference

### Feature Labels (Ship Scene)

- **Effect**: UNKNOWN — may expand to show more text on hover
- **UNKNOWN**: Cannot confirm interactivity of these labels

---

## Click Interactions

### CTA Buttons

- **Primary button**: Likely navigates to a contact/quote page
- **Secondary button**: Likely navigates to services section or page
- **Click animation**: Brief scale-down on press (tactile feedback)

### Navigation Links

- **Behavior**: Standard page navigation or scroll-to-section

---

## No-Drag / No-Swipe Observed

- No drag interactions visible in reference
- No touch swipe indicators visible
- Site appears primarily designed for desktop mouse interaction

---

## Magnetic Effects

**UNKNOWN** — Not directly observable from the reference video. Premium sites of this caliber often implement magnetic button effects where the button slightly follows the cursor when nearby. Cannot confirm without live site inspection.

---

## Scroll Progress Indicator

**UNKNOWN** — No visible scroll progress bar or indicator in reference frames.

---

## Loading / Entry Animation

**UNKNOWN** — Not captured in the reference video. A high-quality site of this type would typically have a branded loading screen or entrance animation sequence that plays before the main content appears.

---

## Touch / Mobile Interactions

**UNKNOWN** — Reference is shot on desktop (iMac). Mobile interaction patterns are not visible in the reference.
