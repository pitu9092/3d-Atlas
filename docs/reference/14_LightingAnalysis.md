# 14 — Lighting Analysis

---

## Lighting Philosophy

The site uses **scene-specific lighting** tailored to the mood of each 3D scene. There is no global lighting setup — each scene is lit independently to achieve its dramatic aesthetic.

| Scene          | Mood                | Primary Light                |
| -------------- | ------------------- | ---------------------------- |
| Globe          | Space / epic        | Sun (directional, off-angle) |
| Reach Stacker  | Industrial / clean  | Soft overhead studio         |
| Truck          | Product photography | Studio key + fill            |
| Container Ship | Underwater / moody  | Ambient blue + top fill      |
| Aircraft       | Open sky / bright   | Strong sun simulation        |

---

## Scene 1 — Globe Lighting

### Sun Light (DirectionalLight)

- **Direction**: ~45° from top-right (simulating sun position in space)
- **Color**: White-warm (`#fff8f0`)
- **Intensity**: ~1.5–2.0
- **Target**: Earth center
- **Shadows**: Disabled (spheres don't need real-time shadows)
- **Effect**: Creates the terminator line — the light/dark divide on the globe

### Ambient Light

- **Color**: Very dim (`#0a0a20`)
- **Intensity**: ~0.05–0.1
- **Purpose**: Gives the dark side of Earth a faint planetary glow (not pure black)

### Atmosphere Shader Light (Not a THREE.Light)

- The Fresnel rim glow on the atmosphere is not a real Three.js light
- It is computed in the **shader** based on camera position and normal vectors
- Creates the illusion of a blue "scattering halo" around the entire globe

### Thermal/Cloud Glow (Not a THREE.Light)

- The orange/red glow at the globe's pole is a shader effect
- Not a real emissive light — additive blending on a hemisphere mesh

---

## Scene 4 — Reach Stacker Lighting

### Key Light (DirectionalLight)

- **Direction**: Top-right (~45° above, ~30° to the right)
- **Color**: White (`#ffffff`)
- **Intensity**: ~1.8–2.5
- **Shadows**: Enabled (soft shadows for detail)
- **Effect**: Main highlight on the crane's teal surface, container edges

### Fill Light (DirectionalLight)

- **Direction**: Bottom-left (opposite to key)
- **Color**: Soft blue-grey (`#c0d0e0`)
- **Intensity**: ~0.5–0.8
- **Purpose**: Fills shadow areas, prevents completely dark surfaces

### Ambient Light

- **Color**: White
- **Intensity**: ~0.6–0.8
- **Purpose**: Overall scene brightness (white background look)

### Environment

- **HDRI**: Possible `neutral` or `studio` preset from Drei
- **Intensity**: ~0.5

### Observation

The reach stacker appears with very clean, product-photography style lighting. The teal/blue of the vehicle body is well-saturated and clearly lit. This is consistent with a neutral studio HDRI + directional key.

---

## Scene 5 — Truck Lighting

### Key Light

- **Direction**: Slightly top-right
- **Color**: Warm white (`#fffaf5`)
- **Intensity**: ~2.0
- **Effect**: Primary highlight on cab and container side panel

### Rim/Back Light

- **Direction**: Top-rear
- **Color**: Cool white (`#e0eeff`)
- **Intensity**: ~1.0
- **Effect**: Separates truck silhouette from white background

### Ambient

- **Intensity**: ~0.8 (bright, matches white background)

---

## Scene 7 — Container Ship Lighting

### Ambient Light

- **Color**: Blue-tinted (`#2040a0`)
- **Intensity**: ~0.5–0.7
- **Purpose**: Creates the underwater/oceanic blue color cast on everything

### Sun/Key Light (DirectionalLight)

- **Direction**: From above (aerial view — sun would be directly above)
- **Color**: White-blue (`#d0e8ff`)
- **Intensity**: ~1.5
- **Effect**: Highlights container tops, ship deck

### Emissive Elements

- The colorful containers may have slight emissive values to stay vibrant under blue ambient light

### Environment

- Deep blue color or HDRI with ocean/sky environment
- `scene.background = new THREE.Color('#133D77')`
- `scene.fog` possible — slight blue fog to enhance depth

---

## Scene 9 — Aircraft Lighting

### Sun Light (DirectionalLight)

- **Direction**: From slightly above and behind camera
- **Color**: Warm bright white (`#fffef5`)
- **Intensity**: ~2.5–3.0
- **Effect**: Creates strong highlights on top of fuselage and wings

### Sky Ambient

- **Color**: Sky blue (`#c0d8f0`)
- **Intensity**: ~0.8
- **Effect**: Blue-tinted ambient from sky reflection

### Cloud Reflections

- Cloud environment provides soft fill from below
- Clouds are bright white — they act as soft fill lights

### Environment Map

- Sky HDRI or procedural sky environment
- `<Sky />` component from Drei (sun position, rayleigh scattering, turbidity settings)

---

## Shadow Strategy

| Scene          | Shadows                      | Type                |
| -------------- | ---------------------------- | ------------------- |
| Globe          | None                         | N/A                 |
| Reach Stacker  | Yes                          | PCFSoft             |
| Truck          | Yes                          | PCFSoft             |
| Container Ship | Minimal                      | PCFSoft or disabled |
| Aircraft       | Minimal (clouds catch light) | UNKNOWN             |

## Tone Mapping

All scenes likely use **ACESFilmic tone mapping**:

```javascript
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2 // slightly bright for premium look
```

This is the industry standard for web 3D — provides cinematic contrast and color rendering.
