/**
 * @file config/site.ts
 * @description Application metadata configuration.
 *
 * Requirements met:
 * - Title
 * - Description
 * - Keywords
 * - Author
 * - Social
 * - SEO defaults
 */

import { APP_INFO } from '@/lib/core/constants'

export const siteConfig = {
  name: APP_INFO.name,
  description: APP_INFO.description,
  titleTemplate: `%s | ${APP_INFO.name}`,
  url: 'https://3datlas.com', // Replace with actual production URL

  author: {
    name: '3D Atlas Team',
    url: 'https://3datlas.com',
  },

  keywords: ['3D', 'WebGL', 'Three.js', 'Logistics', 'Interactive', 'Web Experience'],

  social: {
    twitter: '@3datlas',
    github: 'https://github.com/3datlas',
  },

  seoDefaults: {
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://3datlas.com',
      title: APP_INFO.name,
      description: APP_INFO.description,
      siteName: APP_INFO.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: APP_INFO.name,
      description: APP_INFO.description,
      creator: '@3datlas',
    },
  },
} as const

export type SiteConfig = typeof siteConfig
