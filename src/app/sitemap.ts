import type { MetadataRoute } from 'next'
import { getPublications } from '@/lib/publications'
import { publicationPath, SITE_URL } from '@/lib/publication-utils'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://www.bhoxha.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    { url: `${SITE_URL}/publications/`, changeFrequency: 'monthly', priority: 0.8 },
    ...(await getPublications()).map(publication => ({ url: `${SITE_URL}${publicationPath(publication)}` })),
  ]
}
