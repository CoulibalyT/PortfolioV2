/**
 * Post-build prerender script
 * Renders each route with Puppeteer and saves the full HTML
 * so search engines can index content without executing JS.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 4173;

const ROUTES = [
  '/',
  '/projects',
  '/skills',
  '/timeline',
  '/contact',
  '/playground',
];

// Simple static file server for the dist folder (SPA mode)
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp3': 'audio/mpeg',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
  };

  const indexHtml = readFileSync(join(DIST_DIR, 'index.html'));

  const server = createServer((req, res) => {
    const url = req.url.split('?')[0]; // strip query strings
    const filePath = join(DIST_DIR, url);
    const ext = extname(url);

    // If it has a file extension, try to serve the file
    if (ext) {
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
        return;
      } catch {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
    }

    // Otherwise, serve index.html (SPA fallback)
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  console.log('Starting prerender...');

  const server = await startServer();
  console.log(`Server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({ headless: true });

  for (const route of ROUTES) {
    const page = await browser.newPage();

    // Set sessionStorage before any JS runs so splash screen is skipped
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('hasShownSplash', 'true');
    });

    const url = `http://localhost:${PORT}${route}`;
    console.log(`Rendering ${route}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

      // Wait for Vue app to mount, GSAP animations, and @unhead/vue to inject meta tags
      await page.waitForSelector('#app > *', { timeout: 10000 });
      await new Promise((r) => setTimeout(r, 2500));

      let html = await page.content();

      // Clean up: remove scripts that won't work in static context
      // and any inline styles from GSAP animations (opacity:0 etc)
      html = html.replace(/data-v-inspector[^"]*="[^"]*"/g, '');

      // Write the rendered HTML
      const outputDir = route === '/' ? DIST_DIR : join(DIST_DIR, route);
      mkdirSync(outputDir, { recursive: true });

      const outputFile = join(outputDir, 'index.html');
      writeFileSync(outputFile, html, 'utf-8');
      console.log(`  -> Saved ${outputFile}`);
    } catch (err) {
      console.warn(`  -> Warning: Failed to render ${route}: ${err.message}`);
      console.warn(`     Falling back to original index.html for this route`);
    }

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerender complete!');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
