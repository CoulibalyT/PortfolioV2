/**
 * Renders the project covers (1600x1000) shown in the /projects "Tous" wall.
 * Each <name>.html is a cover template (shared layout in base.css) and is
 * written to public/images/projects/<name>/cover.webp.
 *
 * Usage: npm run covers            (all covers)
 *        npm run covers -- skywalk (only some)
 */
import puppeteer from 'puppeteer';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = ['noir-haus', 'skywalk', 'bento', 'scholarship', 'intake', 'autoomat'];
const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

const browser = await puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

for (const name of names) {
  const output = join(__dirname, '..', '..', 'public', 'images', 'projects', name, 'cover.webp');
  await page.goto(pathToFileURL(join(__dirname, `${name}.html`)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: output, type: 'webp', quality: 82 });
  console.log(`✓ ${name} → ${output}`);
}

await browser.close();
