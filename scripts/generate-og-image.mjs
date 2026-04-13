/**
 * Generates the OG image (1200x630) matching the portfolio's
 * dark mode aesthetic with animated color blobs.
 */
import puppeteer from 'puppeteer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'images', 'og-image.png');

const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    background: #08080a;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  /* Animated blobs matching InteractiveBackground.vue */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    mix-blend-mode: screen;
    opacity: 0.35;
  }

  .blob-1 {
    width: 500px;
    height: 500px;
    background: #581c87;
    top: -120px;
    left: -100px;
  }

  .blob-2 {
    width: 450px;
    height: 450px;
    background: #1e3a8a;
    top: -80px;
    right: -50px;
  }

  .blob-3 {
    width: 400px;
    height: 400px;
    background: #312e81;
    bottom: -100px;
    left: 100px;
  }

  .blob-4 {
    width: 350px;
    height: 350px;
    background: #164e63;
    bottom: -60px;
    right: 150px;
  }

  /* Noise texture overlay */
  .noise {
    position: absolute;
    inset: 0;
    opacity: 0.12;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Content */
  .content {
    position: relative;
    z-index: 10;
    text-align: center;
    color: white;
  }

  .name {
    font-size: 72px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    margin-bottom: 20px;
    color: #ffffff;
  }

  .role {
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 36px;
  }

  .accent-line {
    width: 60px;
    height: 3px;
    background: #c8ff00;
    margin: 0 auto 36px;
    border-radius: 2px;
  }

  .url {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }
</style>
</head>
<body>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
  <div class="blob blob-4"></div>
  <div class="noise"></div>

  <div class="content">
    <div class="name">Tene Coulibaly</div>
    <div class="role">Développeuse Full Stack</div>
    <div class="accent-line"></div>
    <div class="url">tene-coulibaly.vercel.app</div>
  </div>
</body>
</html>
`;

async function generate() {
  mkdirSync(join(__dirname, '..', 'public', 'images'), { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.screenshot({ path: OUTPUT, type: 'png' });

  await browser.close();
  console.log(`OG image saved to ${OUTPUT}`);
}

generate().catch(console.error);
