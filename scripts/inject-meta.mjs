/**
 * Lightweight SEO injection script (no browser needed).
 * Injects per-route meta tags AND static HTML content into each page
 * so search engines see real content without executing JavaScript.
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
    title: 'Tene Coulibaly — Développeuse Full Stack à Paris | Portfolio',
    desc: 'Tene Coulibaly, développeuse Full Stack à Paris. Vue.js, React, Next.js, Node.js, NestJS, TypeScript. En recherche de CDI dès septembre 2026.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Tene Coulibaly — Développeuse Full Stack à Paris</h1>
        <p>Salut, moi c'est Tene. Développeuse Full Stack en alternance chez INSEAD, étudiante à l'ETNA. Je construis des applications web du back-end à l'interface — propres, performantes, et pensées pour les utilisateurs.</p>
        <p>Créer, optimiser, innover : trois mots qui guident ma vision du développement. En recherche d'un CDI en développement Full Stack pour septembre 2026.</p>
        <h2>Compétences</h2>
        <p>Vue.js, Nuxt, React, Next.js, TypeScript, Node.js, NestJS, Express, Symfony, PHP, PostgreSQL, SQL Server, Prisma, TypeORM, Doctrine, Flutter, Dart, Docker, Nginx, Jenkins, Tailwind CSS, GSAP, Figma, Git</p>
        <h2>Projets</h2>
        <ul>
          <li><strong>Skywalk</strong> — Plateforme full-stack d'aide à l'expatriation. React 19, NestJS, TypeORM, PostgreSQL, 8 APIs externes, 110+ endpoints. <a href="https://skywalk-chi.vercel.app">Voir le site</a></li>
          <li><strong>Bento</strong> — Plateforme de challenges créatifs pour designers. Vue 3, NestJS, Prisma, PostgreSQL, détection IA, plugin Figma. <a href="https://bento-sable.vercel.app">Voir le site</a></li>
          <li><strong>APOL (INSEAD)</strong> — Application web d'entreprise pour la gestion des candidatures et bourses. Symfony 6.4, PHP 8.1, SQL Server, ADFS SSO, PeopleSoft, DocuSign.</li>
          <li><strong>Autoomat</strong> — Site vitrine et outils métier pour carrossier. Next.js 15, TypeScript, Tailwind CSS, API SIV, Google Sheets. <a href="https://autoomat.vercel.app">Voir le site</a></li>
          <li><strong>Footprint Calculator</strong> — Module de calcul d'empreinte carbone. Vue.js, Node.js, API Climeet.</li>
          <li><strong>Portfolio Sync</strong> — Outil CLI Node.js de capture automatique de screenshots. Puppeteer, Sharp, GitHub Actions. <a href="https://www.npmjs.com/package/portfolio-sync">Voir sur npm</a></li>
          <li><strong>Daily Quote</strong> — Application mobile cross-platform. Flutter, Dart, Kotlin, Swift, WidgetKit.</li>
          <li><strong>Joy of Simple</strong> — Site vitrine design minimaliste. Vue.js, GSAP, Tailwind CSS. <a href="https://joyofsimple-site.vercel.app">Voir le site</a></li>
        </ul>
        <h2>Parcours</h2>
        <ul>
          <li>2025 - Présent : Développeuse Full Stack Étudiante — INSEAD</li>
          <li>2023 - 2025 : Développeuse Full Stack — CAPTAG</li>
          <li>2022 - 2023 : Développeuse Full Stack — Sayse</li>
        </ul>
        <h2>Formation</h2>
        <ul>
          <li>2025 - 2026 : Architecte de Systèmes d'Information (Master) — ETNA</li>
          <li>2023 - 2025 : Concepteur Développeur d'Applications (Bac +3) — ETNA</li>
          <li>2021 - 2023 : Développeuse Web (Bac +2) — Epitech</li>
        </ul>
        <h2>Contact</h2>
        <p>Email : coulibaly.tene00@gmail.com | <a href="https://www.linkedin.com/in/tenecoulibaly/">LinkedIn</a> | <a href="https://github.com/CoulibalyT">GitHub</a></p>
      </main>`,
  },
  {
    path: '/projects',
    title: 'Projets — Tene Coulibaly',
    desc: 'Découvrez les projets réalisés par Tene Coulibaly : applications web, SaaS, modules carbone et plus encore.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Projets de Tene Coulibaly</h1>
        <article><h2>Skywalk</h2><p>Plateforme full-stack d'aide à l'expatriation. Exploration de destinations, gestion de projet, comparaison de villes, recherche d'emploi, forum communautaire modéré par IA. React 19, NestJS, TypeORM, PostgreSQL, 8 APIs externes, 110+ endpoints, Docker, GitHub Actions.</p></article>
        <article><h2>Bento</h2><p>Plateforme de challenges créatifs pour designers. Soumission de projets, votes, classements, détection anti-IA multi-couches et plugin Figma intégré. Vue 3, NestJS, Prisma, PostgreSQL, Socket.io, Cloudinary, Jest.</p></article>
        <article><h2>APOL (INSEAD)</h2><p>Application web d'entreprise gérant le cycle complet des candidatures aux programmes diplômants, les admissions et la gestion des bourses. Symfony 6.4, PHP 8.1, SQL Server, ADFS SSO, SAML 2.0, PeopleSoft, DocuSign, Jenkins.</p></article>
        <article><h2>Autoomat</h2><p>Site vitrine et outils métier pour carrossier automobile. Parcours sinistre guidé, devis en ligne avec API SIV, gestion assurance Google Sheets. Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Vercel.</p></article>
        <article><h2>Footprint Calculator</h2><p>Module de calcul d'empreinte carbone développé chez CAPTAG. Vue.js, Node.js, API Climeet.</p></article>
        <article><h2>Portfolio Sync</h2><p>Outil CLI Node.js de capture automatique de screenshots de projets web. Puppeteer, Sharp, Commander, GitHub Actions.</p></article>
        <article><h2>Daily Quote</h2><p>Application mobile cross-platform avec thème dynamique jour/nuit, synthèse vocale et widgets natifs. Flutter, Dart, Kotlin, Swift, WidgetKit.</p></article>
        <article><h2>Joy of Simple</h2><p>Site vitrine pour un studio de design minimaliste. Vue.js, GSAP, Tailwind CSS.</p></article>
      </main>`,
  },
  {
    path: '/skills',
    title: 'Compétences — Tene Coulibaly',
    desc: 'Stack technique de Tene Coulibaly : Vue.js, React, Next.js, Node.js, NestJS, Symfony, TypeScript, PostgreSQL, Docker et plus.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Compétences techniques de Tene Coulibaly</h1>
        <h2>Stack Technique</h2>
        <p>Vue.js, Nuxt, React, Next.js, TypeScript, Tailwind CSS, GSAP, Node.js, NestJS, Express, Symfony, PHP, PostgreSQL, SQL Server, Prisma, TypeORM, Doctrine, Flutter, Dart, Docker, Nginx, Jenkins, Git/GitHub, Figma, Postman, Vercel</p>
        <h2>Workflow</h2>
        <p>Méthodologie Agile, CI/CD, Tests (Jest, Vitest, Playwright), Sécurité (JWT, SAML, RBAC), Architecture API REST, Résolution de problèmes, Autonomie</p>
        <h2>En apprentissage</h2>
        <p>Three.js, Deep AI</p>
      </main>`,
  },
  {
    path: '/timeline',
    title: 'Parcours — Tene Coulibaly',
    desc: 'Parcours professionnel et formations de Tene Coulibaly : INSEAD, CAPTAG, Sayse, Epitech, ETNA.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Parcours de Tene Coulibaly</h1>
        <h2>Expériences Professionnelles</h2>
        <article><h3>Développeuse Full Stack Étudiante — INSEAD (2025 - Présent)</h3></article>
        <article><h3>Développeuse Full Stack — CAPTAG (2023 - 2025)</h3><p>Module carbone (Vue 3, Node.js, API Climeet). Projet mené en autonomie, collaboration agile.</p></article>
        <article><h3>Développeuse Full Stack — Sayse (2022 - 2023)</h3><p>Développement SaaS (React.js, TypeScript, Node.js, Docker).</p></article>
        <article><h3>Bénévole — Croix-Rouge Française (2019 - 2020)</h3></article>
        <h2>Formations</h2>
        <article><h3>Architecte de Systèmes d'Information (Master) — ETNA (2025 - 2026)</h3></article>
        <article><h3>Concepteur Développeur d'Applications (Bac +3) — ETNA (2023 - 2025)</h3></article>
        <article><h3>Développeuse Web (Bac +2) — Epitech (2021 - 2023)</h3></article>
      </main>`,
  },
  {
    path: '/contact',
    title: 'Contact — Tene Coulibaly',
    desc: 'Contactez Tene Coulibaly, développeuse Full Stack à Paris, pour discuter d\'opportunités ou simplement échanger.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Contacter Tene Coulibaly</h1>
        <p>Actuellement en recherche d'un CDI en développement Full Stack pour septembre 2026. N'hésitez pas à me contacter pour discuter d'opportunités ou simplement échanger.</p>
        <ul>
          <li>Email : <a href="mailto:coulibaly.tene00@gmail.com">coulibaly.tene00@gmail.com</a></li>
          <li>LinkedIn : <a href="https://www.linkedin.com/in/tenecoulibaly/">linkedin.com/in/tenecoulibaly</a></li>
          <li>GitHub : <a href="https://github.com/CoulibalyT">github.com/CoulibalyT</a></li>
        </ul>
      </main>`,
  },
  {
    path: '/playground',
    title: 'Le Labo — Tene Coulibaly',
    desc: 'Expérimentations créatives et explorations 3D par Tene Coulibaly : globe interactif, système solaire, particules morphing.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Le Labo — Expérimentations 3D</h1>
        <p>Un espace pour mes expérimentations créatives et explorations 3D avec Three.js.</p>
        <ul>
          <li>Globe terrestre interactif avec localisation Paris</li>
          <li>Système solaire navigable avec 8 planètes</li>
          <li>Particules morphing entre sphère, cube, torus, ADN et cœur</li>
        </ul>
      </main>`,
  },
];

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const route of routes) {
  const { title, desc, content, path } = route;
  const url = `${SITE}${path === '/' ? '' : path}`;
  const canonical = path === '/' ? `${SITE}/` : `${SITE}${path}`;

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

  // Inject static HTML content before <div id="app">
  if (content) {
    html = html.replace('<div id="app"></div>', `<div id="app">${content}</div>`);
  }

  // Write file
  if (path === '/') {
    writeFileSync(join(DIST, 'index.html'), html, 'utf-8');
    console.log(`  -> / (index.html)`);
  } else {
    const dir = join(DIST, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf-8');
    console.log(`  -> ${path}/index.html`);
  }
}

console.log('SEO injection complete!');
