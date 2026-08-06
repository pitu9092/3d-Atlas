# 03 — Component Inventory

## Global Components

### Navbar

- **Position**: Fixed, top of viewport, full width
- **Height**: Estimated 48–64px
- **Background**: Semi-transparent / glass (on dark hero), transitions to match section color
- **Left**: Brand logo/wordmark — UNKNOWN exact text (too small in reference, estimated position top-left)
- **Center/Left-column**: Vertical stack of navigation links — non-standard vertical orientation
  - Items visible: approximately 5–6 links (Home, Services, Destinations, Features, Partners — UNKNOWN exact labels)
  - Style: Small caps, light weight, white on dark / dark on light
- **Right**: Single CTA button — pill shape, appears to be "GET A QUOTE" or similar
- **Behavior**: Transparent over hero, adapts color based on current scene background

### Custom Cursor

- **Type**: Circular ring cursor (replaces native OS cursor)
- **Shape**: Thin circle outline (~40px diameter)
- **Behavior**: Follows mouse with slight lag/lerp smoothing
- **Animation**: Rotates continuously OR pulses on hover
- **Color**: White on dark sections, dark on light sections (adapts to background)
- **Visible In**: Every scene

---

## Hero Section (Scene 1)

### Eyebrow Label

- **Content**: "ONE OPERATOR"
- **Position**: Above H1
- **Style**: Small, uppercase, wide letter-spacing, likely white, thin weight
- **Animation**: Fades in before H1

### H1 Headline

- **Content**: "EVERY LEG OF THE JOURNEY"
- **Style**: Extra bold / Black weight, all-caps, very large (estimated 72–96px on desktop), white
- **Animation**: Text reveal — likely lines reveal upward with clip-path mask
- **Width**: Left half of screen only

### Body Copy (Hero)

- **Content**: UNKNOWN — 2–3 lines of descriptive copy below headline
- **Style**: Small, regular weight, light grey/white, ~16–18px
- **Animation**: Fades in after headline

### CTA Buttons (Hero)

- **Button 1**: Primary — Pill shape, white fill, dark text — label UNKNOWN ("GET STARTED" / "OUR SERVICES")
- **Button 2**: Secondary — Text link style or ghost pill — label UNKNOWN ("OUR SERVICES" / "LEARN MORE")
- **Layout**: Side by side horizontally below body copy
- **Animation**: Fade in after body copy

### 3D Globe

- **Type**: R3F Canvas, full or partial viewport (right 50% of screen)
- **Model**: Earth — spherical
- **Material**: Dark matte surface (very dark grey/charcoal base), glowing atmosphere rim
- **Features**:
  - Orange/red thermal glow at north pole area (cloud atmospheric effect)
  - Bright electric blue atmospheric rim glow around entire circumference
  - White geodesic network overlay: dots at cities/nodes + connecting line arcs (shipping routes)
  - Red location pin/dot marker (visible over Australia)
- **Animation**: Slow continuous rotation on Y-axis, network dots pulsing

---

## Scene Transition Components

### Atmospheric Horizon Band

- **Type**: 3D rendered or CSS gradient element
- **Appearance**: Horizontal band of electric blue atmospheric glow with white haze above

### Wipe/Panel Transition (Scene 8)

- **Type**: DOM overlay panel OR CSS clip-path animation
- **Appearance**: Black vertical panel that expands from center to full width
- **Text Content**: Stacked lines of text cycling through words ("RELIABILITY", "EVERY", "MILESTONE" etc.)

---

## Scene 3 — Editorial Section

### H2 Headline (Large Editorial)

- **Content**: "WE MOVE FREIGHT. WE OWN THE OUTCOME."
- **Style**: Very large, extra bold, left-aligned, dark/black
- **Animation**: Words reveal left-to-right or line by line

### Stat Counter

- **Content**: "2 500+" (formatted with space separator — European number format)
- **Style**: Extremely large (80–120px), bold, dark
- **Label**: Below stat — UNKNOWN

### Thumbnail Image

- **Type**: Small rectangular photo (actual photograph)
- **Content**: Aerial view of a highway/road
- **Position**: Left column

---

## Scene 4 — Reach Stacker (3D Object)

### Reach Stacker Crane Model

- **Type**: 3D GLB model, R3F Canvas
- **Base Color**: Teal/mid-blue (#2A8FC5 estimated)
- **Features**: Detailed vehicle — large rubber tires, operator cab, articulating boom arm, spreader head
- **Scale**: Fills approximately 60–70% of viewport height

### Shipping Containers (Stacked)

- **Type**: Part of 3D scene or separate models
- **Colors**: White, dark navy blue, red/burgundy — standard ISO colors
- **Arrangement**: Stacked 2–3 high in a column to the right of the crane
- **Labels**: Container ID codes visible (too small to read in reference)

---

## Scene 5 — Truck Section

### Semi-Truck 3D Model

- **Type**: 3D GLB model
- **Components**: Dark cab (black/charcoal), silver/grey 40ft container trailer
- **Detail Level**: High — visible tires, air intakes, trailer ridges
- **Position**: Center screen, side profile view

---

## Scene 6 — Services Grid

### Feature Card (×4 visible)

- **Layout**: Horizontal row of 4 cards
- **Each card contains**:
  - Icon (circular or small graphic — UNKNOWN exact type)
  - Title in caps
  - Body copy 2–3 lines
- **Examples**: "DANGEROUS GOODS ACCREDITATION", "OPERATOR-MANAGED VEHICLES", "PERSONALIZED SPEED AWARD", "ON-TIME DELIVERY"
- **Style**: White text on dark background

### CTA Button (Services)

- **Position**: Center bottom of section
- **Style**: Pill shape, outlined or filled

---

## Scene 7 — Container Ship

### Container Ship 3D Model

- **Type**: 3D GLB model, aerial/top-down camera angle
- **Scale**: Fills center of viewport
- **Container deck**: Multi-color containers visible from above (full color spectrum — green, red, blue, white, pink, orange, red)
- **Hull**: Standard ship hull shape visible from top
- **Water effect**: Surrounding ocean with foam/wake particles

### Feature Labels (Around Ship)

- **Layout**: Radial arrangement around ship
- **Positions**: Top-left, top-right, center-left, center-right, bottom-center
- **Content**:
  - "CONTROLLED" (top area)
  - "RELIABILITY" (top area)
  - "COMPLIANCE REAL-TIME VESSEL" (center-left)
  - "COMPETITIVE TRANSPARENT PRICING" (center-right)
  - "FAST ISSUE RESOLUTION" (bottom center)
- **Style**: White text on blue background, with caption text below each label

---

## Scene 9 — Aircraft

### Commercial Aircraft 3D Model

- **Type**: 3D GLB model
- **Color**: White/grey fuselage, red tail livery
- **Classification**: Wide-body commercial jet (appears to be A330 or 777 proportions)
- **Camera Angle**: Slightly above and to the side, aircraft banking left

### Sky/Cloud Environment

- **Type**: 3D cloud system OR video texture OR HDRI environment
- **Appearance**: Photorealistic volumetric clouds, blue sky above

---

## Scene 10 — Testimonials

### Testimonial Card

- **Layout**: Two-column — heading left, quote right
- **Elements**:
  - Client photo (square thumbnail, ~80–100px)
  - Client name
  - Client title/company
  - Quote body text (large paragraph)
- **Style**: Light background, dark text

### Heading

- **Content**: "TRUSTED BY BUSINESSES ACROSS APAC"
- **Style**: Large, bold, left-aligned, dark

---

## Shared/Global UI Elements

| Component        | Notes                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| Section dividers | Red horizontal line (thin, ~1px, accent) used as separator in some sections |
| Page scrollbar   | Likely hidden or custom styled                                              |
| Loading screen   | UNKNOWN — not captured in reference                                         |
| Footer           | UNKNOWN — not captured in reference                                         |
