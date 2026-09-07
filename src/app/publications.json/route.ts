import { getPublications } from '@/lib/publications';
import { publicationRecord } from '@/lib/publication-utils';

// Produces a static file in out/, with no deployed API or server runtime.
export const dynamic = 'force-static';

export async function GET() {
  return Response.json((await getPublications()).map(publicationRecord));
}
