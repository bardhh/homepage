import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const output = path.resolve('out');
const filename = 'Bardh-Hoxha-CV.pdf';
const origin = 'https://www.bhoxha.com';
const browser = await chromium.launch({ channel: 'chrome' });

try {
  // Serve the static export at its public origin so PDF links work off-site.
  const page = await browser.newPage({ javaScriptEnabled: false, colorScheme: 'light' });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const pathname = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    await route.fulfill({ path: path.join(output, pathname) });
  });
  await page.emulateMedia({ media: 'print' });
  await page.goto(origin + '/cv/');
  await page.evaluate(async () => {
    const article = document.querySelector('article.cv-page');
    if (!article) throw new Error('CV missing from static export');
    const container = document.createElement('div');
    container.className = 'container';
    container.append(article);
    document.body.replaceChildren(container);
    await document.fonts.ready;
  });
  await page.pdf({ path: path.join(output, filename), format: 'Letter', preferCSSPageSize: true, tagged: true, outline: true });
  // Make the generated download available to next dev as well.
  await mkdir('public', { recursive: true });
  await copyFile(path.join(output, filename), path.join('public', filename));
} finally {
  await browser.close();
}
