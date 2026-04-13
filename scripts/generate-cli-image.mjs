/**
 * Generate a terminal-style screenshot for Portfolio Sync CLI project
 */
import puppeteer from 'puppeteer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'images', 'projects', 'portfolio-sync', 'cli.webp');

const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1920px;
    height: 1080px;
    background: #0a0a12;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  }

  .terminal {
    width: 900px;
    background: #1a1a2e;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
    overflow: hidden;
  }

  .terminal-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green { background: #28c840; }

  .terminal-title {
    margin-left: 12px;
    color: rgba(255,255,255,0.4);
    font-size: 13px;
  }

  .terminal-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.8;
    color: #e0e0e0;
  }

  .prompt { color: #c8ff00; }
  .cmd { color: #ffffff; }
  .dim { color: rgba(255,255,255,0.35); }
  .green { color: #28c840; }
  .blue { color: #5b9aff; }
  .yellow { color: #febc2e; }
  .cyan { color: #00d4aa; }
  .bold { font-weight: bold; }

  .line { margin-bottom: 2px; }
</style>
</head>
<body>
  <div class="terminal">
    <div class="terminal-bar">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
      <span class="terminal-title">portfolio-sync — zsh</span>
    </div>
    <div class="terminal-body">
      <div class="line"><span class="prompt">❯</span> <span class="cmd">npx portfolio-sync capture</span></div>
      <div class="line"><br></div>
      <div class="line"><span class="yellow">📸</span> <span class="bold">Portfolio Sync</span> <span class="dim">— Starting capture...</span></div>
      <div class="line"><br></div>
      <div class="line"><span class="dim">-</span> Launching browser...</div>
      <div class="line"><span class="green">✔</span> Browser launched</div>
      <div class="line"><br></div>
      <div class="line"><span class="blue">📦</span> Processing project: <span class="cyan">skywalk</span></div>
      <div class="line">   URL: <span class="dim">https://skywalk-chi.vercel.app</span></div>
      <div class="line"><span class="dim">-</span> Authenticating via form...</div>
      <div class="line"><span class="green">✔</span> Authenticated</div>
      <div class="line"><span class="green">✔</span> home <span class="dim">— home.webp</span></div>
      <div class="line"><span class="green">✔</span> destinations <span class="dim">— destinations.webp</span></div>
      <div class="line"><span class="green">✔</span> dashboard <span class="dim">— dashboard.webp</span></div>
      <div class="line"><br></div>
      <div class="line"><span class="blue">📦</span> Processing project: <span class="cyan">bento</span></div>
      <div class="line">   URL: <span class="dim">https://bento-sable.vercel.app</span></div>
      <div class="line"><span class="green">✔</span> home <span class="dim">— home.webp</span></div>
      <div class="line"><span class="green">✔</span> challenges <span class="dim">— challenges.webp</span></div>
      <div class="line"><span class="green">✔</span> explore <span class="dim">— unchanged</span></div>
      <div class="line"><br></div>
      <div class="line"><span class="dim">📊</span> Summary: <span class="green">5 updated</span>, <span class="dim">1 unchanged</span>, <span class="dim">0 failed</span></div>
      <div class="line"><br></div>
      <div class="line"><span class="green">✅</span> <span class="bold">All screenshots captured successfully!</span></div>
    </div>
  </div>
</body>
</html>
`;

async function generate() {
  mkdirSync(join(__dirname, '..', 'public', 'images', 'projects', 'portfolio-sync'), { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUTPUT, type: 'webp', quality: 90 });
  await browser.close();
  console.log(`CLI image saved to ${OUTPUT}`);
}

generate().catch(console.error);
