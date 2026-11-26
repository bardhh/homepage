'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { researchAreas } from '@/data/research-areas';
import { readPublicationState, writePublicationState } from '@/lib/publication-utils';
import { publicationLinkClass } from './PublicationResources';

export default function PublicationReturnLink() {
  const results = useSearchParams().get('results');
  let href = '/publications/';
  let label = 'All publications';
  if (results !== null) {
    const params = new URLSearchParams(results);
    const area = researchAreas.find(area => area.paper === params.get('start'));
    const query = writePublicationState(area ? `start=${area.paper}` : '', readPublicationState(results));
    href = `/${query ? `?${query}` : ''}#publications`;
    label = area ? `Back to ${area.title}` : 'Back to publication results';
  }
  return <Link prefetch={false} href={href} className={`inline-block text-sm ${publicationLinkClass}`}>← {label}</Link>;
}
