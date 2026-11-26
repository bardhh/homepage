import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/publication-utils';
import Genealogy from '@/components/Genealogy';

export const metadata: Metadata = {
  title: 'Academic genealogy | Bardh Hoxha',
  description: 'Explore Bardh Hoxha’s academic lineage through an interactive map of scholars and advisor relationships.',
  alternates: { canonical: SITE_URL + '/genealogy/' },
};

export default function GenealogyPage() {
  return <Genealogy />;
}
