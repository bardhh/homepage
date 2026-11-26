import type { Metadata } from 'next';
import styles from '@/components/ResearchMap.module.css';
import { getPublications } from '@/lib/publications';
import { SITE_URL } from '@/lib/publication-utils';
import { buildResearchMap } from '@/lib/research-map';
import ResearchMap from '@/components/ResearchMap';

export const metadata: Metadata = {
  title: 'Research map | Bardh Hoxha',
  description: 'Explore relationships between research papers, research concepts, and applications.',
  alternates: { canonical: SITE_URL + '/research-map/' },
};

export default async function ResearchMapPage() {
  const papers = buildResearchMap(await getPublications());
  return <div className={styles.atlas}><ResearchMap papers={papers} /></div>;
}
