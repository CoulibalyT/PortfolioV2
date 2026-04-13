/**
 * Generate favicon set: SVG, PNG 32x32, PNG 16x16, apple-touch-icon 180x180, PNG 192, PNG 512
 */
import puppeteer from 'puppeteer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #08080a;
    border-radius: 22%;
    font-family: 'Geist', -apple-system, sans-serif;
    color: #c8ff00;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
</style>
</head>
<body>
  <div class="icon">TC</div>
</body>
</html>
`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16, fontSize: 8 },
  { name: 'favicon-32x32.png', size: 32, fontSize: 16 },
  { name: 'apple-touch-icon.png', size: 180, fontSize: 80 },
  { name: 'icon-192x192.png', size: 192, fontSize: 85 },
  { name: 'icon-512x512.png', size: 512, fontSize: 220 },
];

async function generate() {
  const browser = await puppeteer.launch({ headless: true });

  for (const { name, size, fontSize } of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 2 });

    const sizedHtml = html
      .replace('body {', `body { width: ${size}px; height: ${size}px;`)
      .replace('.icon {', `.icon { width: ${size}px; height: ${size}px; font-size: ${fontSize}px;`);

    await page.setContent(sizedHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: join(PUBLIC, name), type: 'png', omitBackground: true });
    await page.close();
    console.log(`  -> ${name} (${size}x${size})`);
  }

  await browser.close();
  console.log('Favicon generation complete!');
}

generate().catch(console.error);
