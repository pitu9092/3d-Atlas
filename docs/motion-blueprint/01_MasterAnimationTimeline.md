# 01 — Master Animation Timeline

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Source**: All Phase 2, 3A, 3B documentation  
**Purpose**: Complete scroll-driven experience timeline — the single source of truth for build sequencing and animation orchestration

---

## Experience Architecture at a Glance

```
TOTAL ESTIMATED SCROLL HEIGHT: ~1,460vh
TOTAL SCENES: 10 (S01–S10)
TOTAL 3D SCENES: 5 (Globe, Crane, Truck, Ship, Aircraft)
TOTAL TRANSITIONS: 9 (TR-01–TR-09)
SCROLL ENGINE: Lenis
ANIMATION ENGINE: GSAP + ScrollTrigger
3D ENGINE: Three.js via React-Three-Fiber
```

---

## Complete Master Timeline Table

| Scroll %    | Scroll vh     | Phase | Scene                      | Label                 | Pin   | Duration | Priority |
| ----------- | ------------- | ----- | -------------------------- | --------------------- | ----- | -------- | -------- |
| `0%`        | `0vh`         | LOAD  | —                          | `page-load`           | No    | 0        | Critical |
| `0%`        | `0vh`         | S01   | Globe Hero                 | `hero-enter`          | YES   | 150vh    | Critical |
| `0–100%`    | `0–150vh`     | S01   | Globe Hero (camera)        | `hero-cam`            | YES   | 150vh    | Critical |
| `100%`      | `150vh`       | TR-01 | Atmosphere Begin           | `atmo-start`          | YES   | 60vh     | High     |
| `110%`      | `210vh`       | TR-02 | Atmosphere End             | `atmo-end`            | No    | 0vh      | High     |
| `110%`      | `210vh`       | S03   | Editorial                  | `editorial-enter`     | No    | 100vh    | High     |
| `155%`      | `310vh`       | S04   | Crane (begin pin)          | `crane-pin-start`     | YES   | 350vh    | Critical |
| `155%–387%` | `310–660vh`   | S04   | Crane animation            | `crane-anim`          | YES   | 350vh    | Critical |
| `387%`      | `660vh`       | TR-04 | Crane→Truck                | `crane-truck`         | No    | 0vh      | High     |
| `387%`      | `660vh`       | S05   | Truck                      | `truck-enter`         | Brief | 100vh    | High     |
| `480%`      | `760vh`       | TR-05 | Split reveal               | `split-start`         | No    | 0vh      | High     |
| `480%–530%` | `760–860vh`   | S06   | Services Grid              | `services-enter`      | No    | 100vh    | Medium   |
| `530%`      | `860vh`       | TR-06 | Wipe begin                 | `wipe-start`          | YES   | 80vh     | High     |
| `590%`      | `940vh`       | TR-07 | Ship reveal                | `ship-reveal`         | No    | 0vh      | High     |
| `590%`      | `940vh`       | S08   | Container Ship (begin pin) | `ship-pin-start`      | YES   | 200vh    | Critical |
| `590–715%`  | `940–1140vh`  | S08   | Ship animation             | `ship-anim`           | YES   | 200vh    | Critical |
| `715%`      | `1140vh`      | TR-08 | Ship→Aircraft              | `air-reveal`          | No    | 0vh      | High     |
| `715%`      | `1140vh`      | S09   | Aircraft (begin pin)       | `aircraft-pin-start`  | YES   | 120vh    | High     |
| `715–790%`  | `1140–1260vh` | S09   | Aircraft zoom              | `aircraft-anim`       | YES   | 120vh    | High     |
| `790%`      | `1260vh`      | TR-09 | Aircraft→Testimonials      | `testimonials-enter`  | No    | 0vh      | Medium   |
| `790–918%`  | `1260–1460vh` | S10   | Testimonials               | `testimonials-scroll` | No    | 200vh    | Medium   |
| `918%`      | `1460vh`      | END   | —                          | `experience-end`      | No    | —        | Low      |

---

## Timeline Labels Reference

> These labels are used for GSAP `.addLabel()` calls and ScrollTrigger IDs throughout the codebase.

| Label                  | Scroll Position             | Purpose                                     |
| ---------------------- | --------------------------- | ------------------------------------------- |
| `"page-load"`          | Immediate                   | Page entry animations (H1, globe entrance)  |
| `"hero-cam-start"`     | `scrollY = 0`               | Globe camera pull-back begins               |
| `"hero-cam-end"`       | `scrollY = 150vh`           | Globe camera at max Z, ready for transition |
| `"atmo-start"`         | `scrollY = 150vh`           | Background gradient begins                  |
| `"atmo-peak"`          | `scrollY = 180vh`           | Blue band at maximum                        |
| `"atmo-end"`           | `scrollY = 210vh`           | Background resolved to off-white            |
| `"editorial-h2"`       | Element at `top 80%`        | H2 text reveal fires                        |
| `"editorial-stats"`    | Element at `top 70%`        | Stat counters fire                          |
| `"crane-pin-start"`    | `scrollY = 310vh`           | Crane section sticks                        |
| `"crane-lift"`         | Crane progress `0.45`       | Spreader contacts container                 |
| `"crane-apex"`         | Crane progress `0.65`       | Container at top of lift                    |
| `"crane-carry"`        | Crane progress `0.85`       | Container in horizontal carry               |
| `"crane-pin-end"`      | `scrollY = 660vh`           | Crane section unpins                        |
| `"truck-enter"`        | `scrollY = 660vh`           | Truck canvas activates                      |
| `"split-start"`        | `scrollY = 760vh`           | Dark section begins rising                  |
| `"services-grid"`      | `scrollY = 800vh`           | Service columns animate in                  |
| `"wipe-start"`         | `scrollY = 860vh`           | Wipe section pins                           |
| `"wipe-panel-peak"`    | Wipe progress `0.6`         | Black panel at max width                    |
| `"ship-reveal"`        | `scrollY = 940vh`           | Ship canvas fully active                    |
| `"ship-zoom-in"`       | Ship progress `0.0–0.4`     | Camera descends                             |
| `"ship-text"`          | Ship progress `0.4–0.55`    | "LOGISTICS..." text visible                 |
| `"ship-labels"`        | Ship progress `0.6–0.9`     | Feature labels appear                       |
| `"ship-zoom-out"`      | Ship progress `0.55–1.0`    | Camera ascends                              |
| `"aircraft-enter"`     | `scrollY = 1140vh`          | Aircraft canvas activates                   |
| `"aircraft-zoom"`      | Aircraft progress `0.0–1.0` | Camera zoom toward aircraft                 |
| `"testimonials-h2"`    | Element at `top 80%`        | Testimonials H2 reveal fires                |
| `"testimonials-cards"` | Element at `top 70%`        | Client cards stagger in                     |
| `"experience-end"`     | `scrollY = 1460vh`          | All animations complete                     |

---

## Animation Priority Matrix

| Priority          | Scene                 | Reason                                        |
| ----------------- | --------------------- | --------------------------------------------- |
| **P0 — Critical** | Globe Hero            | First impression — must be perfect at 60fps   |
| **P0 — Critical** | Crane animation       | Most complex, most unique, defines the brand  |
| **P0 — Critical** | Container Ship        | Longest 3D section, most visual impact        |
| **P1 — High**     | Atmosphere transition | Bridges hero to content — must be seamless    |
| **P1 — High**     | Wipe transition       | Cinematic moment — defines quality perception |
| **P1 — High**     | Aircraft              | Second major 3D scene                         |
| **P2 — Medium**   | Editorial             | Standard scroll — polished but not complex    |
| **P2 — Medium**   | Services Grid         | Text-based — achievable                       |
| **P2 — Medium**   | Testimonials          | Standard layout                               |
| **P3 — Low**      | Micro-animations      | Cursor, hover states, button interactions     |

---

## Scene Dependencies

```
Page Load
└── Globe canvas must render before any scroll
    └── Lenis must init before ScrollTrigger
        └── ScrollTrigger must refresh after Lenis
            ├── Hero ScrollTrigger (depends on canvas ready)
            ├── Atmosphere ScrollTrigger (depends on hero ST)
            ├── Editorial (depends on atmo)
            ├── Crane pin (depends on GLB loaded)
            │   └── Truck (depends on crane section)
            │       └── Services (depends on truck)
            │           └── Wipe (depends on services)
            │               └── Ship pin (depends on ship GLB loaded)
            │                   └── Aircraft pin (depends on aircraft GLB loaded)
            │                       └── Testimonials (depends on aircraft)
```

---

## Completion Conditions

| Scene          | Complete When                                                  |
| -------------- | -------------------------------------------------------------- |
| Globe Hero     | Camera reaches Z=7.0, all text visible                         |
| Atmosphere     | Background is fully `#F5F4F0`                                  |
| Editorial      | All text revealed, all counters complete                       |
| Crane          | Container in horizontal carry position (scroll progress = 1.0) |
| Truck          | Truck fully visible, services section beginning                |
| Services Grid  | All 5 columns visible, word shuffle settled                    |
| Wipe           | Panel completed its grow cycle, ship visible below             |
| Container Ship | All feature labels visible, camera back at Y=20                |
| Aircraft       | Aircraft at full zoom size                                     |
| Testimonials   | All visible testimonials in frame                              |

---

## Performance Budget

| Category            | Target         | Notes                                           |
| ------------------- | -------------- | ----------------------------------------------- |
| **Frame rate**      | 60fps constant | Must not drop below 30fps on mid-range hardware |
| **Globe canvas**    | ≤ 4ms GPU      | Bloom is expensive — optimize shader            |
| **Crane canvas**    | ≤ 3ms GPU      | No post-processing — should be cheap            |
| **Ship canvas**     | ≤ 3ms GPU      | Moderate bloom on foam only                     |
| **Aircraft canvas** | ≤ 3ms GPU      | Sky shader + clouds — moderate cost             |
| **DOM animations**  | ≤ 1ms JS       | Pure CSS transforms — no layout thrash          |
| **Scroll handler**  | ≤ 0.5ms JS     | Lenis RAF — lightweight                         |
| **Total JS**        | ≤ 8ms/frame    | Leave 8ms for browser overhead                  |
