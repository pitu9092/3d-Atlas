# 10 — Lighting Moments

**Project**: 3D Atlas  
**Focus**: Every observable lighting event — ambient, directional, bloom, glow, environment changes, and shadows

---

## Lighting Philosophy

The reference site uses **scene-isolated lighting** — each 3D scene has its own renderer, lighting rig, and environment. There is no global lighting shared between scenes.

The narrative lighting arc follows:

```
Space (dark + sun simulation) → Ground (studio white) → Sea (blue ambient) → Sky (bright solar)
```

---

## LIGHTING MOMENT 01 — Globe Scene: Space Lighting

**Section**: Hero  
**Video Evidence**: F0008–F0020  
**Observable**: Dark globe surface, bright blue rim, warm orange cloud glow

### Ambient Light

| Property      | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| **Color**     | Near-black `#04040a`                                                     |
| **Intensity** | ~0.05                                                                    |
| **Purpose**   | Prevents pure black on dark side of Earth — gives planetary ambient glow |

### Directional Light (Sun)

| Property      | Value                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Color**     | Warm white `#fff8f0`                                                                                                 |
| **Intensity** | ~1.8–2.0                                                                                                             |
| **Direction** | Upper-right (estimated: `[-0.5, 0.8, 0.3]` normalized)                                                               |
| **Shadow**    | Disabled (no ground plane to receive shadows)                                                                        |
| **Effect**    | Creates visible terminator — bright half of Earth, dark half                                                         |
| **Evidence**  | Australia (upper-right of globe) is lit. The India/Asia area shows the transition. Left side of globe is near-black. |

### Atmosphere Shader (Not a THREE.Light)

| Property          | Value                                                       |
| ----------------- | ----------------------------------------------------------- |
| **Type**          | Custom Fresnel shader                                       |
| **Color**         | Electric blue `hsl(210, 100%, 65%)` — `#1a7fff` approximate |
| **Effect**        | Rim glow brightens at viewing angle perpendicular to normal |
| **Fresnel power** | ~4.0 (sharp falloff)                                        |
| **Evidence**      | F0012: clear bright blue rim surrounds entire globe         |

### Thermal Cloud Glow (Not a THREE.Light)

| Property     | Value                                                    |
| ------------ | -------------------------------------------------------- |
| **Type**     | Additive blend mesh on upper hemisphere                  |
| **Color**    | `hsl(20, 90%, 55%)` orange → `hsl(5, 80%, 40%)` deep red |
| **Opacity**  | ~0.4–0.6                                                 |
| **Evidence** | F0008: orange/red circular glow on upper-right of globe  |

### Bloom (Post-Processing)

| Property      | Value                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Active**    | YES — strongly suggested                                                                                                                   |
| **Threshold** | ~0.8 (only very bright elements bloom)                                                                                                     |
| **Intensity** | ~0.4–0.6                                                                                                                                   |
| **Evidence**  | The atmosphere rim appears to extend beyond its geometry — characteristic of bloom. The orange thermal glow also appears to bleed outward. |
| **Affected**  | Atmosphere rim glow, thermal glow, route node highlights                                                                                   |

---

## LIGHTING MOMENT 02 — Globe: Terminator Line

**Observed**: The boundary between the lit and unlit sides of the Earth  
**Video Evidence**: F0012, F0016

| Property           | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Line type**      | Soft gradient (not sharp edge)                                                              |
| **Location**       | Runs vertically through center of globe, approximately                                      |
| **Dark side**      | Near black `#080808–#0a0a20`                                                                |
| **Lit side**       | Shows subtle landmass texture hints                                                         |
| **Implementation** | Achieved by `dot(normal, sunDirection)` in fragment shader, with `smoothstep` for soft edge |

---

## LIGHTING MOMENT 03 — Globe: Route Network Glow

**Observed**: Subtle glow on route dots  
**Video Evidence**: F0012

| Property   | Value                                                  |
| ---------- | ------------------------------------------------------ |
| **Effect** | Route dots (Points) appear slightly luminous           |
| **Color**  | White with possible blue tint                          |
| **Bloom**  | Dots may catch bloom post-processing                   |
| **Size**   | Small (~2px visual) but with bloom halo appears larger |

---

## LIGHTING MOMENT 04 — Atmosphere Transition: No 3D Lighting

**Section**: Atmospheric Descent  
**Video Evidence**: F0020

| Property        | Value                                             |
| --------------- | ------------------------------------------------- |
| **3D Lighting** | None — no 3D scene in this section                |
| **Visual**      | Pure CSS/DOM gradient animation                   |
| **Colors**      | `#080808 → #1a3a7a → #1a7fff → #c0d8f0 → #f5f4f0` |
| **No bloom**    | No post-processing active (no WebGL canvas)       |

---

## LIGHTING MOMENT 05 — Reach Stacker: Studio Lighting

**Section**: Crane / Port Operations  
**Video Evidence**: F0032, F0036

### Ambient Light

| Property      | Value                                       |
| ------------- | ------------------------------------------- |
| **Color**     | White `#ffffff`                             |
| **Intensity** | ~0.8                                        |
| **Purpose**   | High ambient to match pure white background |

### Key Light (Directional)

| Property      | Value                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| **Color**     | White `#ffffff`                                                                |
| **Intensity** | ~2.0–2.5                                                                       |
| **Direction** | Upper-right (~45° above, ~30° right)                                           |
| **Shadow**    | PCFSoft shadows enabled                                                        |
| **Effect**    | Strong top-right highlight on crane teal surface                               |
| **Evidence**  | F0032: crane body shows clear highlight on top surfaces, shadow on ground area |

### Fill Light (Directional)

| Property      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| **Color**     | Soft blue-grey `#c0d0e0`                              |
| **Intensity** | ~0.5–0.8                                              |
| **Direction** | Lower-left (opposite to key)                          |
| **Purpose**   | Fills shadow sides, prevents pure black on crane body |

### Environment Map

| Property      | Value                                                  |
| ------------- | ------------------------------------------------------ |
| **Type**      | Neutral studio HDRI or `environment="studio"` preset   |
| **Intensity** | ~0.4–0.6                                               |
| **Purpose**   | Provides natural reflections on painted metal surfaces |

### Observable Effects (F0032)

- Teal crane body: bright highlight on top, gradually darkening sides
- Container (white): clear top highlight, subtle shadow on front face
- Red containers: strong red saturation maintained
- Tires (black): very slight rim light from fill

### Bloom

| Active             | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| **On crane scene** | Likely disabled — studio/white background scenes rarely need bloom |

---

## LIGHTING MOMENT 06 — Crane: Shadow Casting

**Section**: Crane  
**Video Evidence**: F0032

| Property           | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **Ground shadow**  | UNKNOWN — no ground plane visible (transparent canvas on white DOM)    |
| **Object shadows** | Container casts shadow on crane body, crane casts shadow on containers |
| **Shadow type**    | PCFSoftShadowMap — soft-edged shadows                                  |

---

## LIGHTING MOMENT 07 — Truck Scene: Product Lighting

**Section**: Road Freight  
**Video Evidence**: F0044

### Ambient

| Property      | Value                                   |
| ------------- | --------------------------------------- |
| **Intensity** | ~1.0 (bright, matches white background) |
| **Color**     | White                                   |

### Key Light

| Property      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| **Intensity** | ~2.0                                                  |
| **Direction** | Slightly above-right                                  |
| **Effect**    | Creates product photography quality on truck surfaces |

### Rim Light

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| **Purpose**   | Separates truck silhouette from white background |
| **Color**     | Cool white                                       |
| **Intensity** | ~1.0                                             |
| **Direction** | From rear                                        |

### Observable Effects (F0044)

- Dark cab: some top highlight visible, mostly dark (correct — it's a dark vehicle)
- Silver container: strong reflective surface, bright top face
- Tires: black, some rim light on wheels

---

## LIGHTING MOMENT 08 — Container Ship: Ocean Ambient

**Section**: Sea Freight  
**Video Evidence**: F0068–F0080

### Ambient Light

| Property      | Value                                                  |
| ------------- | ------------------------------------------------------ |
| **Color**     | Deep blue `hsl(215, 70%, 25%)` — `#133D77` approximate |
| **Intensity** | ~0.7                                                   |
| **Effect**    | Every surface on the ship takes on a blue tint         |
| **Purpose**   | Creates the underwater/deep-ocean color cast           |

### Directional Light (Aerial Sun)

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| **Color**     | Blue-white `#d0e0ff`                             |
| **Intensity** | ~1.5                                             |
| **Direction** | Straight down (aerial view — sun directly above) |
| **Effect**    | Highlights tops of containers                    |

### Background

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| **Type**   | Solid color fill                      |
| **Color**  | `#133D77` (estimated from F0068)      |
| **No sky** | No HDRI or sky — just solid deep blue |

### Container Emissive

| Property     | Value                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| **Possible** | Some containers may have slight emissive values                           |
| **Purpose**  | Maintain container color saturation under heavy blue ambient              |
| **Evidence** | The container colors (red, green, pink) remain vivid despite blue ambient |

### Bloom

| Active            | Notes                                        |
| ----------------- | -------------------------------------------- |
| **On ship scene** | Possible light bloom on water foam particles |
| **Intensity**     | Low — not dominant visual                    |

### Water/Foam Effect

| Property   | Value                                             |
| ---------- | ------------------------------------------------- |
| **Type**   | Emissive white particles OR bright white material |
| **Color**  | Bright white `#ffffff–#e8f8ff`                    |
| **Effect** | Contrast against blue — highly visible foam       |
| **Bloom**  | Likely catches bloom slightly                     |

---

## LIGHTING MOMENT 09 — Aircraft: Sky Lighting

**Section**: Air Freight  
**Video Evidence**: F0084, F0088

### Ambient

| Property      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| **Color**     | Sky blue `hsl(200, 60%, 70%)` — `#80b8d8` approximate |
| **Intensity** | ~0.8                                                  |
| **Effect**    | All surfaces have cool blue fill                      |

### Sun Light (Directional)

| Property      | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| **Color**     | Warm-white `#fffef0`                                                     |
| **Intensity** | ~2.5–3.0                                                                 |
| **Direction** | Above-rear of aircraft                                                   |
| **Effect**    | Strong highlights on top of fuselage and wings                           |
| **Evidence**  | F0088: top of fuselage appears bright white, wings have clear highlights |

### Environment

| Property     | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| **Type**     | Sky environment — either procedural sky (`Drei <Sky>`) or sky HDRI |
| **Colors**   | Blue-purple upper, white clouds lower                              |
| **Evidence** | F0084: gradient sky visible behind aircraft                        |

### Cloud Lighting

| Property           | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Cloud material** | White, fully rough (MeshStandardMaterial: metalness 0, roughness 1) |
| **Lighting**       | Clouds catch ambient sky light — appear bright white                |
| **Bloom**          | Cloud edges may have slight bloom                                   |

### Tone Mapping (All Scenes)

| Property     | Value                                         |
| ------------ | --------------------------------------------- |
| **Type**     | ACESFilmic                                    |
| **Exposure** | ~1.2                                          |
| **Effect**   | Cinematic contrast, prevents harsh highlights |

---

## Lighting Timeline Summary

| Section        | Primary Light           | Ambient     | Bloom        | Mood               |
| -------------- | ----------------------- | ----------- | ------------ | ------------------ |
| Globe Hero     | Sun (warm, off-angle)   | Space black | YES (strong) | Epic / cosmic      |
| Crane          | Studio key + fill       | White       | No           | Industrial / clean |
| Truck          | Product key + rim       | White       | No           | Commercial         |
| Container Ship | Overhead + blue ambient | Ocean blue  | Slight       | Maritime / moody   |
| Aircraft       | Solar + sky ambient     | Sky blue    | Slight       | Airy / bright      |

---

## Post-Processing Stack (Estimated by Scene)

| Scene    | Bloom    | SMAA/AA | Vignette | Color Grade |
| -------- | -------- | ------- | -------- | ----------- |
| Globe    | ✓ Strong | ✓       | Possible | Yes         |
| Crane    | ✗        | ✓       | ✗        | Subtle      |
| Truck    | ✗        | ✓       | ✗        | Subtle      |
| Ship     | Slight   | ✓       | ✗        | Yes (blue)  |
| Aircraft | Slight   | ✓       | ✗        | Yes (warm)  |
