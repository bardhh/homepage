import { performance } from 'perf_hooks';

interface Publication {
  citationKey: string;
  entryType: string;
  entryTags: {
    title?: string;
    author?: string;
    booktitle?: string;
    keywords?: string;
    [key: string]: string | undefined;
  };
}

// Generate mock data
const generatePubs = (count: number): Publication[] => {
  const pubs: Publication[] = [];
  for (let i = 0; i < count; i++) {
    pubs.push({
      citationKey: `pub${i}`,
      entryType: i % 3 === 0 ? 'article' : 'inproceedings',
      entryTags: {
        title: `Publication Title ${i} with some random words like Machine Learning and AI`,
        author: `Author Name ${i} and Co-Author`,
        booktitle: `Proceedings of the Conference ${i}`,
        keywords: `keyword${i}, machine learning, optimization`,
      },
    });
  }
  return pubs;
};

const NUM_PUBS = 10000;
const SEARCH_QUERIES = ['Machine', 'Author', 'Conference', 'optimization', 'random', 'learning', 'planning', 'verification', 'testing', 'risk'];
// Simulating user typing "Machine" -> "M", "Ma", "Mac", ... but here just full words for simplicity
const ITERATIONS = 100;

const pubs = generatePubs(NUM_PUBS);

// Baseline implementation
const runBaseline = () => {
  let matchCount = 0;
  for (const search of SEARCH_QUERIES) {
    const results = pubs.filter(pub => {
        if (search) {
            const searchLower = search.toLowerCase();
            const title = pub.entryTags.title?.toLowerCase() || '';
            const author = pub.entryTags.author?.toLowerCase() || '';
            const venue = pub.entryTags.booktitle?.toLowerCase() || '';
            const keywords = pub.entryTags.keywords?.toLowerCase() || '';

            return title.includes(searchLower) ||
                   author.includes(searchLower) ||
                   venue.includes(searchLower) ||
                   keywords.includes(searchLower);
        }
        return true;
    });
    matchCount += results.length;
  }
  return matchCount;
};

// Optimized implementation (Separate Fields - Exact Match Behavior)
const startPrecalc = performance.now();
const preparedPubs = pubs.map(pub => ({
    original: pub,
    lower: {
        title: pub.entryTags.title?.toLowerCase() || '',
        author: pub.entryTags.author?.toLowerCase() || '',
        venue: pub.entryTags.booktitle?.toLowerCase() || '',
        keywords: pub.entryTags.keywords?.toLowerCase() || ''
    }
}));
const endPrecalc = performance.now();
console.log(`Pre-calculation time: ${(endPrecalc - startPrecalc).toFixed(2)} ms`);

const runOptimized = () => {
    let matchCount = 0;

    // 2. Filter step (simulating useMemo [preparedPubs, search])
    for (const search of SEARCH_QUERIES) {
        const searchLower = search.toLowerCase();
        const results = preparedPubs.filter(item => {
            return item.lower.title.includes(searchLower) ||
                   item.lower.author.includes(searchLower) ||
                   item.lower.venue.includes(searchLower) ||
                   item.lower.keywords.includes(searchLower);
        });
        matchCount += results.length;
    }
    return matchCount;
};

console.log(`Benchmarking with ${NUM_PUBS} publications and ${SEARCH_QUERIES.length} search queries over ${ITERATIONS} iterations...`);

const startBaseline = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runBaseline();
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runOptimized();
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Baseline Time (Total): ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized Time (Filtering only): ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${(baselineTime / optimizedTime).toFixed(2)}x`);
