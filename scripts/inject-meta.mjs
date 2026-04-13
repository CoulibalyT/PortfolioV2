/**
 * Lightweight meta injection script (no browser needed).
 * Reads dist/index.html and creates per-route copies with correct
 * <title>, <meta description>, <og:*>, <twitter:*>, and <canonical>.
 * Works on Vercel build without Puppeteer/Chrome.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://tene-coulibaly.vercel.app';

const routes = [
  {
    path: '/',
    title: { fr: 'Tene Coulibaly — Développeuse Full Stack | Portfolio' },
    desc: { fr: 'Portfolio de Tene Coulibaly, développeuse Full Stack. Création d\'expériences web fluides, performantes et accessibles.' },
  },
  {
    path: '/projects',
    title: { fr: 'Projets — Tene Coulibaly' },
    desc: { fr: 'Découvrez les projets réalisés par Tene Coulibaly : applications web, SaaS, modules carbone et plus encore.' },
  },
  {
    path: '/skills',
    title: { fr: 'Compétences — Tene Coulibaly' },
    desc: { fr: 'Stack technique et compétences de Tene Coulibaly : Vue.js, React, Node.js, TypeScript, Docker et plus.' },
  },
  {
    path: '/timeline',
    title: { fr: 'Parcours — Tene Coulibaly' },
    desc: { fr: 'Parcours professionnel et formations de Tene Coulibaly : INSEAD, CAPTAG, Sayse, Epitech, ETNA.' },
  },
  {
    path: '/contact',
    title: { fr: 'Contact — Tene Coulibaly' },
    desc: { fr: 'Contactez Tene Coulibaly pour discuter de vos projets web ou simplement dire bonjour.' },
  },
  {
    path: '/playground',
    title: { fr: 'Le Labo — Tene Coulibaly' },
    desc: { fr: 'Expérimentations créatives et explorations 3D par Tene Coulibaly.' },
  },
];

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const route of routes) {
  const title = route.title.fr;
  const desc = route.desc.fr;
  const url = `${SITE}${route.path === '/' ? '' : route.path}`;
  const canonical = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`;

  let html = baseHtml;

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc}">`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`
  );

  // Replace OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${desc}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);

  // Replace Twitter tags
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${desc}"`);

  // Write file
  if (route.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html, 'utf-8');
    console.log(`  -> / (index.html)`);
  } else {
    const dir = join(DIST, route.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf-8');
    console.log(`  -> ${route.path}/index.html`);
  }
}

console.log('Meta injection complete!');
