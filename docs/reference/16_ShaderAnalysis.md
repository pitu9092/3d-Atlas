# 16 — Shader Analysis

---

## Are Custom Shaders Used?

**YES — custom GLSL shaders are almost certainly present.**

### Evidence:

1. **Globe atmosphere rim glow**: The electric blue Fresnel halo around the Earth cannot be achieved with standard Three.js materials (MeshStandardMaterial does not produce this). It requires a custom vertex/fragment shader implementing the Fresnel equation.
2. **Thermal cloud glow**: The orange-red gradient visible only on the upper portion of the globe, with additive blending and animated pulsing, requires custom shader logic.
3. **Water/ocean effect**: The foam and particle simulation around the container ship suggests either a custom water shader or a specialized material not available in standard Three.js.
4. **Performance**: The globe loads and animates at 60fps. This level of visual quality on a sphere (Fresnel atmosphere + Earth texture + route network) strongly suggests GPU-side shader optimization, not CPU-driven material updates.

---

## Shader 01 — Earth Surface

### File (estimated)

`shaders/vertex/earth.vert` + `shaders/fragment/earth.frag`

### Vertex Shader Responsibilities

- Pass `vNormal` (world-space normal) to fragment shader
- Pass `vUv` (UV coordinates for Earth texture mapping)
- Pass `vViewDir` (view direction for Fresnel calculation)

```glsl
// Estimated vertex shader
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Fragment Shader Responsibilities

- Sample Earth texture (day map)
- Apply dark color grade (multiply down to near-black)
- Compute terminator (day/night boundary)
- Output final color

```glsl
// Estimated fragment shader
uniform sampler2D uEarthTexture;
uniform vec3 uSunDirection;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec4 earthColor = texture2D(uEarthTexture, vUv);
  // Darken dramatically
  earthColor.rgb *= 0.3;
  // Day/night terminator
  float dayFactor = max(0.0, dot(vNormal, normalize(uSunDirection)));
  earthColor.rgb += dayFactor * 0.1;
  gl_FragColor = earthColor;
}
```

---

## Shader 02 — Atmosphere Fresnel

### File (estimated)

`shaders/vertex/atmosphere.vert` + `shaders/fragment/atmosphere.frag`

### Technique

**Fresnel Effect**: The atmosphere appears brighter at the edges (where the view direction is perpendicular to the normal) and transparent at the center.

```glsl
// Fragment shader (estimated)
uniform vec3 uAtmosphereColor;
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vViewDirection)), uFresnelPower);
  gl_FragColor = vec4(uAtmosphereColor * fresnel, fresnel);
}
```

### Uniforms

```javascript
uniforms: {
  uAtmosphereColor: { value: new THREE.Color(0x1a7fff) },
  uFresnelPower: { value: 4.0 },
  uTime: { value: 0.0 }  // for pulse animation
}
```

### Blend Mode

`THREE.AdditiveBlending` — allows the atmosphere to glow over the Earth and space background.

---

## Shader 03 — Thermal Glow

### File (estimated)

`shaders/fragment/thermal.frag`

### Technique

Gradient color from orange to red, masked to upper hemisphere only.

```glsl
// Fragment shader (estimated)
uniform float uTime;
uniform vec3 uGlowColor;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Only upper hemisphere
  float mask = smoothstep(0.0, 0.5, vNormal.y);
  // Pulse animation
  float pulse = 0.8 + 0.2 * sin(uTime * 1.5);
  gl_FragColor = vec4(uGlowColor * mask * pulse, mask * pulse * 0.6);
}
```

---

## Shader 04 — Water / Ocean Surface

### Likely Technique

The ocean around the container ship uses one of:

1. **THREE.Water** (Three.js add-on) with an animated normal map
2. **Custom water shader** with `uTime`-driven wave distortion and foam texture

### If Custom Shader

```glsl
// Simplified water fragment (estimated)
uniform float uTime;
uniform sampler2D uWaterNormal;
uniform vec3 uWaterColor;
uniform vec3 uFoamColor;

varying vec2 vUv;

void main() {
  // Animated UV scroll
  vec2 uv1 = vUv + vec2(uTime * 0.01, uTime * 0.005);
  vec2 uv2 = vUv - vec2(uTime * 0.008, uTime * 0.015);

  vec3 normal1 = texture2D(uWaterNormal, uv1).rgb * 2.0 - 1.0;
  vec3 normal2 = texture2D(uWaterNormal, uv2).rgb * 2.0 - 1.0;
  vec3 waterNormal = normalize(normal1 + normal2);

  // Foam near ship edges (distance-based)
  // ... foam calculation ...

  gl_FragColor = vec4(mix(uWaterColor, uFoamColor, foam), 1.0);
}
```

---

## Shader 05 — Route Arc Lines (Globe)

### Technique

Curved lines in 3D space connecting route nodes. Likely using `QuadraticBezierCurve3` or `CubicBezierCurve3` to generate arc geometries.

```javascript
// Arc generation (estimated JavaScript, not GLSL)
const curve = new THREE.QuadraticBezierCurve3(
  start.clone(),
  midPoint, // elevated midpoint creates the arc
  end.clone(),
)
const points = curve.getPoints(50)
const geometry = new THREE.BufferGeometry().setFromPoints(points)
```

The line material may include a custom dash pattern shader for animated dashes.

---

## Shader 06 — Cloud Material

### Technique (estimated)

Either a soft volumetric-looking cloud mesh or billboard sprites. If volumetric, a noise-based shader:

```glsl
// Fragment shader (estimated)
uniform float uTime;
uniform sampler3D uNoise;  // 3D noise texture

varying vec3 vWorldPosition;

void main() {
  // Sample noise at world position
  float density = texture(uNoise, vWorldPosition * 0.1 + uTime * 0.01).r;
  // Cloud shape
  density = smoothstep(0.4, 0.8, density);
  gl_FragColor = vec4(1.0, 1.0, 1.0, density * 0.9);
}
```

---

## GLSL Uniforms Reference

| Shader     | Key Uniforms                                 |
| ---------- | -------------------------------------------- |
| Earth      | `uEarthTexture`, `uSunDirection`, `uTime`    |
| Atmosphere | `uAtmosphereColor`, `uFresnelPower`, `uTime` |
| Thermal    | `uTime`, `uGlowColor`                        |
| Water      | `uTime`, `uWaterNormal`, `uWaterColor`       |
| Clouds     | `uTime`, `uNoise`                            |

All `uTime` uniforms are updated every frame in `useFrame`:

```typescript
useFrame(({ clock }) => {
  material.uniforms.uTime.value = clock.elapsedTime
})
```
