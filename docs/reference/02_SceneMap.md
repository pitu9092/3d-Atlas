# 02 — Scene Map

The reference is a **single-page scroll-driven experience** with approximately **9–10 distinct scenes**. Each scene represents a pinned or scroll-triggered section with its own 3D model, color palette, and animation behavior.

Video duration: ~12 seconds at approximately real-time scroll speed.
Total estimated scroll length: **~600–900vh** (very long scroll).

---

## Scene 1 — Globe Hero

| Property             | Value                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Globe Hero                                                                                                                                                                                              |
| **Purpose**          | Brand introduction, global reach statement                                                                                                                                                              |
| **Scroll Start**     | 0vh                                                                                                                                                                                                     |
| **Scroll End**       | ~150vh (estimated)                                                                                                                                                                                      |
| **Background Color** | Pure black (#0a0a0a)                                                                                                                                                                                    |
| **Visible Elements** | Navbar, eyebrow text ("ONE OPERATOR"), H1 headline ("EVERY LEG OF THE JOURNEY"), body copy, two CTA buttons, 3D Earth Globe (right half of screen)                                                      |
| **3D Object**        | Rotating Earth globe — dark matte surface with glowing blue atmosphere rim, orange/red cloud glow at top, white geodesic dot/line network overlay (shipping routes), red marker dot (Australia visible) |
| **Transition Out**   | Camera/viewport scrolls upward — globe moves off-screen OR camera pulls back to reveal horizon/atmosphere                                                                                               |
| **Animation Type**   | Globe rotation (continuous), dot network pulse (continuous), scroll-driven camera pull-back                                                                                                             |
| **Camera Behavior**  | Static camera with globe rotating. As scroll progresses, camera pulls back to see the full Earth from space                                                                                             |
| **Scroll Type**      | Pinned section — content stays while scroll drives camera/globe animation                                                                                                                               |
| **Notes**            | Eyebrow label above H1. Two buttons: primary pill CTA (white fill) + secondary text link. Globe is positioned in right ~50% of viewport, partially cropped.                                             |

---

## Scene 2 — Atmosphere / Horizon

| Property             | Value                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Scene Name**       | Atmosphere Descent                                                                                                                                                             |
| **Purpose**          | Visual transition from space/global view to ground operations                                                                                                                  |
| **Scroll Start**     | ~150vh                                                                                                                                                                         |
| **Scroll End**       | ~200vh                                                                                                                                                                         |
| **Background Color** | Gradient — deep black at top → electric blue atmosphere band → off-white                                                                                                       |
| **Visible Elements** | Atmospheric glow band (blue horizon line of Earth from space), transitioning to white                                                                                          |
| **3D Object**        | Earth atmosphere limb / horizon — the glowing edge of the atmosphere visible from low orbit                                                                                    |
| **Transition Out**   | Camera "descends through" atmosphere — blue atmosphere fill fades to off-white                                                                                                 |
| **Animation Type**   | Camera scroll-linked descent                                                                                                                                                   |
| **Camera Behavior**  | Camera moves downward through atmosphere layer                                                                                                                                 |
| **Scroll Type**      | Scrubbed/pinned scroll                                                                                                                                                         |
| **Notes**            | This is the transition scene between the dark space hero and the light editorial sections below. The blue atmospheric band is visible as a full-width strip across the screen. |

---

## Scene 3 — Editorial Brand Statement

| Property             | Value                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Brand Statement (Light)                                                                                                                                                                                           |
| **Purpose**          | Core brand positioning statement                                                                                                                                                                                  |
| **Scroll Start**     | ~200vh                                                                                                                                                                                                            |
| **Scroll End**       | ~280vh                                                                                                                                                                                                            |
| **Background Color** | Near-white / off-white (#F5F5F2 estimated)                                                                                                                                                                        |
| **Visible Elements** | Large H2 left-aligned ("WE MOVE FREIGHT. WE OWN THE OUTCOME."), right-column body copy, stats counter ("2 500+" visible), small thumbnail image (aerial road/highway), eyebrow label above heading                |
| **3D Object**        | None (or minimal)                                                                                                                                                                                                 |
| **Transition Out**   | Smooth scroll reveal                                                                                                                                                                                              |
| **Animation Type**   | Text reveal (stagger left-to-right), counter animation (number count-up)                                                                                                                                          |
| **Camera Behavior**  | N/A                                                                                                                                                                                                               |
| **Scroll Type**      | Standard scroll                                                                                                                                                                                                   |
| **Notes**            | Two-column layout: large text left, supporting copy + stats right. The "2 500+" stat is rendered in a very large font size (estimated 80–120px). This section has a small rectangular photo of an aerial highway. |

---

## Scene 4 — Reach Stacker / Port Crane (White)

| Property             | Value                                                                                                                                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Port Operations — Reach Stacker                                                                                                                                                                                                                                                           |
| **Purpose**          | Show port/land logistics capability                                                                                                                                                                                                                                                       |
| **Scroll Start**     | ~280vh                                                                                                                                                                                                                                                                                    |
| **Scroll End**       | ~420vh (long pinned section)                                                                                                                                                                                                                                                              |
| **Background Color** | Pure white (#FFFFFF) or near-white                                                                                                                                                                                                                                                        |
| **Visible Elements** | 3D reach stacker crane (blue/teal color, highly detailed), stacked shipping containers (white, blue, red, various colors), scene is centered horizontally                                                                                                                                 |
| **3D Object**        | **Reach Stacker / Container Handler**: A large blue port crane vehicle. Highly detailed: tires, cab, boom arm, spreader (container lifting frame). Containers are stacked: multiple colors (white, blue, dark blue, red). As scroll progresses, crane picks up a container and places it. |
| **Transition In**    | Appears from white background — vehicle may slide in from right or fade in                                                                                                                                                                                                                |
| **Transition Out**   | Scene transitions to the truck section — containers are horizontal-wiped                                                                                                                                                                                                                  |
| **Animation Type**   | Scroll-driven mechanical animation: boom arm extends/retracts, spreader descends/ascends, container lifts                                                                                                                                                                                 |
| **Camera Behavior**  | Camera is static side-on view. Slight parallax depth shift possible. Alternatively, camera pulls back to reveal full vehicle.                                                                                                                                                             |
| **Scroll Type**      | Pinned section — scroll drives the crane animation sequence                                                                                                                                                                                                                               |
| **Notes**            | Extremely detailed 3D model. This is the centerpiece of the "land logistics" story. The animation sequence: crane boom extends → spreader lowers → container attaches → crane lifts container → moves right → places on stack.                                                            |

---

## Scene 5 — Truck / Road Freight (White)

| Property             | Value                                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Road Freight — Truck                                                                                                                                                        |
| **Purpose**          | Show road freight capability                                                                                                                                                |
| **Scroll Start**     | ~420vh                                                                                                                                                                      |
| **Scroll End**       | ~520vh                                                                                                                                                                      |
| **Background Color** | Off-white, transitioning to dark at bottom half                                                                                                                             |
| **Visible Elements** | 3D semi-truck with container trailer (grey/white container, dark cab), positioned center-right, horizontal orientation                                                      |
| **3D Object**        | **Semi-truck + 40ft container trailer**: Dark cab (black/dark grey), white/silver container body, realistic truck proportions. Container appears to be a standard ISO 40ft. |
| **Transition In**    | Truck appears centered/slightly cropped from the wipe transition                                                                                                            |
| **Transition Out**   | Lower half of screen wipes to dark background revealing service features grid                                                                                               |
| **Animation Type**   | Truck may animate driving (wheel rotation, suspension), or scroll-linked lateral movement                                                                                   |
| **Camera Behavior**  | Low side-on camera angle looking at truck from slightly below                                                                                                               |
| **Scroll Type**      | Scrubbed scroll                                                                                                                                                             |
| **Notes**            | The section splits horizontally — top half shows the truck (white BG), bottom half transitions to the dark services section. This split creates a dramatic design moment.   |

---

## Scene 6 — Services Grid (Dark)

| Property             | Value                                                                                                                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Services / Features Grid                                                                                                                                                                                                                                    |
| **Purpose**          | List key service features and differentiators                                                                                                                                                                                                               |
| **Scroll Start**     | ~490vh                                                                                                                                                                                                                                                      |
| **Scroll End**       | ~560vh                                                                                                                                                                                                                                                      |
| **Background Color** | Near-black / very dark charcoal (#111111 or #0D0D0D)                                                                                                                                                                                                        |
| **Visible Elements** | 4-column horizontal feature cards, each with: icon (small circular), feature title, body copy. Examples visible: "DANGEROUS GOODS ACCREDITATION", "OPERATOR-MANAGED VEHICLES", "PERSONALIZED SPEED AWARD", "ON-TIME DELIVERY". CTA button at bottom center. |
| **3D Object**        | None visible                                                                                                                                                                                                                                                |
| **Transition In**    | Wipe from bottom of truck section                                                                                                                                                                                                                           |
| **Transition Out**   | Transitions to blue container ship section                                                                                                                                                                                                                  |
| **Animation Type**   | Stagger reveal of feature cards (bottom to top, left to right)                                                                                                                                                                                              |
| **Camera Behavior**  | N/A                                                                                                                                                                                                                                                         |
| **Scroll Type**      | Standard scroll                                                                                                                                                                                                                                             |
| **Notes**            | Features use small icon graphics above titles. All text is light (white/light grey) on dark background.                                                                                                                                                     |

---

## Scene 7 — Container Ship (Blue)

| Property             | Value                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Sea Freight — Container Ship                                                                                                                                                                                                                                                                                                                 |
| **Purpose**          | Show sea/ocean freight capability                                                                                                                                                                                                                                                                                                            |
| **Scroll Start**     | ~560vh                                                                                                                                                                                                                                                                                                                                       |
| **Scroll End**       | ~700vh                                                                                                                                                                                                                                                                                                                                       |
| **Background Color** | Deep ocean blue (hsl ~215, 80%, 35%) with atmospheric particle/foam effects                                                                                                                                                                                                                                                                  |
| **Visible Elements** | 3D container ship (aerial/top-down perspective), surrounded by ocean water with foam/wake, feature labels positioned around the ship (top-left, top-right, center-left, center-right, bottom-center). Feature labels: "CONTROLLED", "RELIABILITY", "COMPLIANCE REAL-TIME VESSEL", "COMPETITIVE TRANSPARENT PRICING", "FAST ISSUE RESOLUTION" |
| **3D Object**        | **Container Ship (aerial view)**: Large cargo vessel with colorful containers on deck (multi-color grid of containers visible from above), ship hull visible, water foam/wake effects around vessel. Positioned center-screen vertically.                                                                                                    |
| **Transition In**    | Horizontal split/wipe from white sections above — blue ocean fills from center                                                                                                                                                                                                                                                               |
| **Transition Out**   | Vertical wipe/curtain toward aircraft section                                                                                                                                                                                                                                                                                                |
| **Animation Type**   | Ship rocks gently (continuous), water foam/particle animation, scroll-linked camera zoom                                                                                                                                                                                                                                                     |
| **Camera Behavior**  | Top-down / aerial camera looking straight down at the ship. Camera may slowly zoom or pan as scroll progresses.                                                                                                                                                                                                                              |
| **Scroll Type**      | Pinned section                                                                                                                                                                                                                                                                                                                               |
| **Notes**            | The surrounding text labels are arranged in a clock-like radial pattern around the ship. The water effect is either: a shader-based ocean simulation, a looping video texture, or a particle system. The foam/wave effect is prominent.                                                                                                      |

---

## Scene 8 — Section Transition Wipe

| Property             | Value                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Wipe Transition                                                                                                                                                                                                   |
| **Purpose**          | Visual scene separator — dramatic transition from sea to air                                                                                                                                                      |
| **Scroll Start**     | ~680vh                                                                                                                                                                                                            |
| **Scroll End**       | ~720vh                                                                                                                                                                                                            |
| **Background Color** | Split — white top, blue bottom, with black vertical center panel                                                                                                                                                  |
| **Visible Elements** | Vertical black/dark panel entering from center, splitting the previous and next sections. Text stacking/cycling animation visible on left side ("RELIABILITY", "EVERY MILESTONE" — multiple text lines stacking). |
| **3D Object**        | None                                                                                                                                                                                                              |
| **Transition In**    | Center black panel expands from thin vertical line to full width                                                                                                                                                  |
| **Transition Out**   | Reveals the aircraft-in-clouds section                                                                                                                                                                            |
| **Animation Type**   | Horizontal/vertical clip-path wipe, text shuffle/typewriter on left side                                                                                                                                          |
| **Camera Behavior**  | N/A                                                                                                                                                                                                               |
| **Scroll Type**      | Pinned scroll — dramatic effect held briefly                                                                                                                                                                      |
| **Notes**            | The center panel with text is a design accent. The text appears to cycle through words (slot machine effect). The transition is inspired by film editing wipes.                                                   |

---

## Scene 9 — Air Freight / Aircraft in Clouds

| Property             | Value                                                                                                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Air Freight — Aircraft                                                                                                                                                                                                                                                                                     |
| **Purpose**          | Show air freight capability                                                                                                                                                                                                                                                                                |
| **Scroll Start**     | ~720vh                                                                                                                                                                                                                                                                                                     |
| **Scroll End**       | ~820vh                                                                                                                                                                                                                                                                                                     |
| **Background Color** | Sky blue + white clouds (photorealistic or 3D rendered sky)                                                                                                                                                                                                                                                |
| **Visible Elements** | Large commercial aircraft (side view, from slightly above-left angle), dramatic cloud formations, blue sky                                                                                                                                                                                                 |
| **3D Object**        | **Commercial Cargo/Passenger Aircraft**: Light grey/white body with red tail markings. Positioned banking slightly left-forward. Seen from a camera angle slightly above and to the side, with clouds below and around. The aircraft appears to be a wide-body jet (Boeing 777 / Airbus A330 proportions). |
| **Transition In**    | Revealed from the wipe transition                                                                                                                                                                                                                                                                          |
| **Transition Out**   | Fades/scrolls to testimonial section                                                                                                                                                                                                                                                                       |
| **Animation Type**   | Aircraft in-flight (subtle banking, roll animation), cloud movement (continuous parallax), scroll-linked camera move                                                                                                                                                                                       |
| **Camera Behavior**  | Camera positioned slightly above-left of aircraft, looking down-right at it. May rotate/orbit with scroll.                                                                                                                                                                                                 |
| **Scroll Type**      | Pinned + scrub                                                                                                                                                                                                                                                                                             |
| **Notes**            | The sky and cloud environment is either: (a) a rendered 3D scene with cloud shader, (b) a volumetric cloud system in Three.js, or (c) a video texture background. The clouds are volumetric and photorealistic. Red tail livery visible — could be the airline brand livery.                               |

---

## Scene 10 — Testimonials (Light)

| Property             | Value                                                                                                                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scene Name**       | Testimonials                                                                                                                                                                                                                  |
| **Purpose**          | Social proof / client trust signals                                                                                                                                                                                           |
| **Scroll Start**     | ~820vh                                                                                                                                                                                                                        |
| **Scroll End**       | ~920vh                                                                                                                                                                                                                        |
| **Background Color** | Off-white / near-white                                                                                                                                                                                                        |
| **Visible Elements** | H2 left-aligned ("TRUSTED BY BUSINESSES ACROSS APAC"), 3D aircraft visible right side (still present from previous scene, fading/moving), testimonial card: client photo (square), client name, client title, quote body copy |
| **3D Object**        | Aircraft (carried over from previous scene, partially visible)                                                                                                                                                                |
| **Transition In**    | Scroll transition from aircraft scene                                                                                                                                                                                         |
| **Transition Out**   | UNKNOWN (end of reference video)                                                                                                                                                                                              |
| **Animation Type**   | Text reveal, testimonial card slide-in                                                                                                                                                                                        |
| **Camera Behavior**  | N/A                                                                                                                                                                                                                           |
| **Scroll Type**      | Standard scroll                                                                                                                                                                                                               |
| **Notes**            | The aircraft 3D model persists/overlaps into this section, creating a visual bridge between the air freight scene and testimonials. The testimonial layout is two-column: left for heading, right for quote.                  |
