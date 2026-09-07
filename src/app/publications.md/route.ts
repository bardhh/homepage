import { getPublications } from '@/lib/publications';
import { publicationsMarkdown } from '@/lib/publication-utils';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(publicationsMarkdown(await getPublications()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
