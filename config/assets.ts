/**
 * @file config/assets.ts
 * @description Centralized asset paths for 3D Atlas.
 *
 * Requirements met:
 * - Models
 * - Textures
 * - HDRIs
 * - Images
 * - Videos
 * - Icons
 * - Fonts
 */

export const assetsConfig = {
  models: {
    crane: '/assets/models/crane.glb',
    truck: '/assets/models/truck.glb',
    ship: '/assets/models/ship.glb',
    aircraft: '/assets/models/aircraft.glb',
    globe: '/assets/models/globe.glb',
  },

  textures: {
    earth: {
      diffuse: '/assets/textures/earth_diffuse.jpg',
      normal: '/assets/textures/earth_normal.jpg',
      specular: '/assets/textures/earth_specular.jpg',
      clouds: '/assets/textures/earth_clouds.jpg',
    },
    particles: {
      dot: '/assets/textures/particles/dot.png',
      glow: '/assets/textures/particles/glow.png',
    },
  },

  hdri: {
    studio: '/assets/hdri/studio.hdr',
    sunset: '/assets/hdri/sunset.hdr',
    night: '/assets/hdri/night.hdr',
  },

  images: {
    heroFallback: '/assets/images/hero-fallback.jpg',
    logo: '/assets/images/logo.svg',
    ogImage: '/assets/images/og-image.jpg',
  },

  videos: {
    introTransition: '/assets/videos/intro-transition.mp4',
  },

  icons: {
    sprite: '/assets/icons/sprite.svg',
  },

  fonts: {
    primary: '/assets/fonts/Inter-VariableFont_slnt,wght.ttf',
    display: '/assets/fonts/Outfit-VariableFont_wght.ttf',
  },
} as const

export type AssetsConfig = typeof assetsConfig
