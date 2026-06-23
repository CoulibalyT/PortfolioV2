/**
 * Lightweight SEO injection script (no browser needed).
 * Injects per-route meta tags AND static HTML content into each page
 * so search engines see real content without executing JavaScript.
 * Works on Vercel build without Puppeteer/Chrome.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects as projectsData } from '../src/data/projects.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Load VITE_SITE_URL from .env locally, fallback to process.env (Vercel)
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}
const SITE = process.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr';

// Helpers for per-project pages
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function truncate(s, n = 160) {
  return s.length > n ? s.substring(0, n - 1).trimEnd() + '…' : s;
}
function renderTech(project) {
  if (Array.isArray(project.tech)) {
    return `<ul>${project.tech.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;
  }
  return Object.entries(project.tech).map(([cat, items]) =>
    `<h3>${escapeHtml(cat)}</h3><ul>${items.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
  ).join('');
}
function renderImages(project, limit = null) {
  const imgs = limit ? project.images.slice(0, limit) : project.images;
  return imgs.map(img =>
    `<img src="/images/projects/${project.folder}/${img.file}" alt="${escapeHtml(project.name)} — ${escapeHtml(img.label)}" loading="lazy" width="1280" height="800">`
  ).join('');
}
function flatTechList(project) {
  return Array.isArray(project.tech)
    ? project.tech
    : Object.values(project.tech).flat();
}

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
  {
    // Commercial landing page, FR-only (no EN equivalent)
    path: '/offre',
    title: 'Création de sites web pour commerces et artisans à Paris — Tene Coulibaly',
    desc: "Sites web sur mesure pour commerçants, artisans et entrepreneurs locaux. Design moderne, SEO local, à partir de 800€. Premier appel gratuit.",
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Création de sites web pour commerces et artisans à Paris</h1>
        <p>Je suis Tene Coulibaly, développeuse Full Stack freelance basée à Paris. Je crée des sites web sur mesure pour commerçants, artisans et entrepreneurs locaux qui veulent enfin exister en ligne.</p>
        <h2>Mes offres</h2>
        <ul>
          <li><strong>Pack Vitrine — à partir de 800€</strong> : site one-page moderne, responsive, SEO de base, formulaire de contact, livraison en 2 semaines.</li>
          <li><strong>Pack Business — à partir de 1500€</strong> : site multi-pages, blog intégré, fiche Google Business, réservation en ligne, livraison en 3-4 semaines.</li>
          <li><strong>Pack Premium — sur devis</strong> : application web sur mesure, espace client, paiement en ligne, accompagnement SEO 3 mois, maintenance 6 mois.</li>
        </ul>
        <h2>Pour qui</h2>
        <p>Coiffeurs, garages, restaurants, boutiques, artisans BTP, professions libérales. Toute petite entreprise qui veut être trouvée sur Google par ses futurs clients locaux.</p>
        <h2>Cas client — Autoomat (garage à Ivry-sur-Seine)</h2>
        <p>Site moderne en Next.js avec SEO local, système de prise de RDV en ligne via Calendly, blog avec articles SEO et API plaque d'immatriculation intégrée pour des devis automatiques.</p>
        <h2>Comment ça marche</h2>
        <ol>
          <li>Appel découverte (15 min gratuit)</li>
          <li>Maquette validée avant développement</li>
          <li>Développement avec suivi</li>
          <li>Mise en ligne + formation</li>
        </ol>
        <h2>Contact</h2>
        <p>Email : <a href="mailto:contact@tenecoulibaly.fr">contact@tenecoulibaly.fr</a>. Auto-entrepreneuse, TVA non applicable (art. 293 B du CGI).</p>
      </main>`,
    frPath: null,
  },
];

// Mark French routes with locale + frPath (used for hreflang pair resolution)
// Pages with explicit frPath: null are FR-only (no EN equivalent) and skip hreflang.
for (const r of routes) {
  r.locale = 'fr';
  if (r.frPath === undefined) r.frPath = r.path;
}

// Build per-project routes dynamically from src/data/projects.js (FR)
const projectRoutes = projectsData.map(project => ({
  path: `/projects/${project.folder}`,
  title: `${project.name} — Projet Full Stack par Tene Coulibaly`,
  desc: truncate(project.description.fr, 160),
  content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <nav><a href="/">Accueil</a> &rsaquo; <a href="/projects">Projets</a> &rsaquo; ${escapeHtml(project.name)}</nav>
        <h1>${escapeHtml(project.name)}</h1>
        <p>${escapeHtml(project.description.fr)}</p>
        ${project.url ? `<p><a href="${project.url}" rel="noopener" target="_blank">${escapeHtml(project.urlLabel)}</a></p>` : ''}
        ${project.urlSecondary ? `<p><a href="${project.urlSecondary}" rel="noopener" target="_blank">${escapeHtml(project.urlSecondaryLabel)}</a></p>` : ''}
        <h2>Stack technique</h2>
        ${renderTech(project)}
        <h2>Captures d'écran</h2>
        <div>${renderImages(project)}</div>
      </main>`,
  project,
  locale: 'fr',
  frPath: `/projects/${project.folder}`,
}));

// English mirror of the 6 main pages — content fully translated for indexability
const enRoutes = [
  {
    path: '/en',
    title: 'Tene Coulibaly — Full Stack Developer in Paris | Portfolio',
    desc: "Tene Coulibaly, Full Stack Developer in Paris. Vue.js, React, Next.js, Node.js, NestJS, TypeScript. Looking for a permanent position starting September 2026.",
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Tene Coulibaly — Full Stack Developer in Paris</h1>
        <p>Hi, I'm Tene. Full Stack Developer (work-study) at INSEAD, studying at ETNA. I build web applications from back-end to interface — clean, performant, and user-focused.</p>
        <p>Create, optimize, innovate: three words that guide my approach to development. Looking for a permanent Full Stack position starting September 2026.</p>
        <h2>Skills</h2>
        <p>Vue.js, Nuxt, React, Next.js, TypeScript, Node.js, NestJS, Express, Symfony, PHP, PostgreSQL, SQL Server, Prisma, TypeORM, Doctrine, Flutter, Dart, Docker, Nginx, Jenkins, Tailwind CSS, GSAP, Figma, Git</p>
        <h2>Projects</h2>
        <ul>
          <li><strong>Skywalk</strong> — Full-stack expatriation platform. React 19, NestJS, TypeORM, PostgreSQL, 8 external APIs, 110+ endpoints. <a href="https://skywalk-chi.vercel.app">Visit the site</a></li>
          <li><strong>Bento</strong> — Creative challenge platform for designers. Vue 3, NestJS, Prisma, PostgreSQL, AI detection, Figma plugin. <a href="https://bento-sable.vercel.app">Visit the site</a></li>
          <li><strong>APOL (INSEAD)</strong> — Enterprise web app for application and scholarship management. Symfony 6.4, PHP 8.1, SQL Server, ADFS SSO, PeopleSoft, DocuSign.</li>
          <li><strong>Autoomat</strong> — Website and business tools for an auto body shop. Next.js 15, TypeScript, Tailwind CSS, SIV API, Google Sheets. <a href="https://autoomat.vercel.app">Visit the site</a></li>
          <li><strong>Portfolio Sync</strong> — Node.js CLI for automatic project screenshot capture. Puppeteer, Sharp, GitHub Actions. <a href="https://www.npmjs.com/package/portfolio-sync">View on npm</a></li>
          <li><strong>Daily Quote</strong> — Cross-platform mobile app. Flutter, Dart, Kotlin, Swift, WidgetKit.</li>
          <li><strong>Joy of Simple</strong> — Minimalist design studio website. Vue.js, GSAP, Tailwind CSS. <a href="https://joyofsimple-site.vercel.app">Visit the site</a></li>
        </ul>
        <h2>Experience</h2>
        <ul>
          <li>2025 - Present: Full Stack Developer (Student) — INSEAD</li>
          <li>2023 - 2025: Full Stack Developer — CAPTAG</li>
          <li>2022 - 2023: Full Stack Developer — Sayse</li>
        </ul>
        <h2>Education</h2>
        <ul>
          <li>2025 - 2026: Information Systems Architect (Master's) — ETNA</li>
          <li>2023 - 2025: Application Designer Developer (BSc+3) — ETNA</li>
          <li>2021 - 2023: Web Developer (BSc+2) — Epitech</li>
        </ul>
        <h2>Contact</h2>
        <p>Email: coulibaly.tene00@gmail.com | <a href="https://www.linkedin.com/in/tenecoulibaly/">LinkedIn</a> | <a href="https://github.com/CoulibalyT">GitHub</a></p>
      </main>`,
  },
  {
    path: '/en/projects',
    title: 'Projects — Tene Coulibaly',
    desc: 'Explore projects by Tene Coulibaly: web applications, SaaS, carbon modules and more.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Projects by Tene Coulibaly</h1>
        <article><h2>Skywalk</h2><p>Full-stack expatriation platform. Destination exploration, project management, city comparison, job search, AI-moderated community forum. React 19, NestJS, TypeORM, PostgreSQL, 8 external APIs, 110+ endpoints, Docker, GitHub Actions.</p></article>
        <article><h2>Bento</h2><p>Creative challenge platform for designers. Project submissions, voting, rankings, multi-layer AI detection and integrated Figma plugin. Vue 3, NestJS, Prisma, PostgreSQL, Socket.io, Cloudinary, Jest.</p></article>
        <article><h2>APOL (INSEAD)</h2><p>Enterprise web app managing the full cycle of degree program applications, admissions and scholarship management. Symfony 6.4, PHP 8.1, SQL Server, ADFS SSO, SAML 2.0, PeopleSoft, DocuSign, Jenkins.</p></article>
        <article><h2>Autoomat</h2><p>Website and business tools for an auto body shop. Guided claim journey, online quote with SIV API, insurance management via Google Sheets. Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Vercel.</p></article>
        <article><h2>Portfolio Sync</h2><p>Node.js CLI tool for automatic web project screenshot capture. Puppeteer, Sharp, Commander, GitHub Actions.</p></article>
        <article><h2>Daily Quote</h2><p>Cross-platform mobile app with dynamic day/night theme, text-to-speech and native widgets. Flutter, Dart, Kotlin, Swift, WidgetKit.</p></article>
        <article><h2>Joy of Simple</h2><p>Showcase website for a minimalist design studio. Vue.js, GSAP, Tailwind CSS.</p></article>
      </main>`,
  },
  {
    path: '/en/skills',
    title: 'Skills — Tene Coulibaly',
    desc: 'Tech stack and skills of Tene Coulibaly: Vue.js, React, Node.js, TypeScript, Docker and more.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Technical Skills of Tene Coulibaly</h1>
        <h2>Tech Stack</h2>
        <p>Vue.js, Nuxt, React, Next.js, TypeScript, Tailwind CSS, GSAP, Node.js, NestJS, Express, Symfony, PHP, PostgreSQL, SQL Server, Prisma, TypeORM, Doctrine, Flutter, Dart, Docker, Nginx, Jenkins, Git/GitHub, Figma, Postman, Vercel</p>
        <h2>Workflow</h2>
        <p>Agile methodology, CI/CD, Testing (Jest, Vitest, Playwright), Security (JWT, SAML, RBAC), REST API architecture, Problem solving, Autonomy</p>
        <h2>Currently learning</h2>
        <p>Three.js, Deep AI</p>
      </main>`,
  },
  {
    path: '/en/timeline',
    title: 'Timeline — Tene Coulibaly',
    desc: 'Professional journey and education of Tene Coulibaly: INSEAD, CAPTAG, Sayse, Epitech, ETNA.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Tene Coulibaly's Journey</h1>
        <h2>Professional Experience</h2>
        <article><h3>Full Stack Developer (Student) — INSEAD (2025 - Present)</h3></article>
        <article><h3>Full Stack Developer — CAPTAG (2023 - 2025)</h3><p>Carbon module (Vue 3, Node.js, Climeet API). Autonomous project, agile collaboration.</p></article>
        <article><h3>Full Stack Developer — Sayse (2022 - 2023)</h3><p>SaaS development (React.js, TypeScript, Node.js, Docker).</p></article>
        <article><h3>Volunteer — French Red Cross (2019 - 2020)</h3></article>
        <h2>Education</h2>
        <article><h3>Information Systems Architect (Master's) — ETNA (2025 - 2026)</h3></article>
        <article><h3>Application Designer Developer (BSc+3) — ETNA (2023 - 2025)</h3></article>
        <article><h3>Web Developer (BSc+2) — Epitech (2021 - 2023)</h3></article>
      </main>`,
  },
  {
    path: '/en/contact',
    title: 'Contact — Tene Coulibaly',
    desc: 'Get in touch with Tene Coulibaly, Full Stack Developer in Paris, to discuss opportunities or just say hello.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>Contact Tene Coulibaly</h1>
        <p>Currently looking for a permanent Full Stack Developer position starting September 2026. Feel free to reach out to discuss opportunities or simply say hello.</p>
        <ul>
          <li>Email: <a href="mailto:coulibaly.tene00@gmail.com">coulibaly.tene00@gmail.com</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/tenecoulibaly/">linkedin.com/in/tenecoulibaly</a></li>
          <li>GitHub: <a href="https://github.com/CoulibalyT">github.com/CoulibalyT</a></li>
        </ul>
      </main>`,
  },
  {
    path: '/en/playground',
    title: 'The Lab — Tene Coulibaly',
    desc: 'Creative experiments and 3D explorations by Tene Coulibaly: interactive globe, solar system, morphing particles.',
    content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <h1>The Lab — 3D Experiments</h1>
        <p>A space for my creative experiments and 3D explorations with Three.js.</p>
        <ul>
          <li>Interactive Earth globe with Paris location marker</li>
          <li>Navigable solar system with 8 planets</li>
          <li>Particles morphing between sphere, cube, torus, DNA and heart</li>
        </ul>
      </main>`,
  },
];

for (const r of enRoutes) {
  r.locale = 'en';
  r.frPath = r.path === '/en' ? '/' : r.path.replace(/^\/en/, '');
}

// English per-project pages — use project.description.en already present in src/data/projects.js
const enProjectRoutes = projectsData.map(project => ({
  path: `/en/projects/${project.folder}`,
  title: `${project.name} — Full Stack Project by Tene Coulibaly`,
  desc: truncate(project.description.en, 160),
  content: `
      <main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false">
        <nav><a href="/en">Home</a> &rsaquo; <a href="/en/projects">Projects</a> &rsaquo; ${escapeHtml(project.name)}</nav>
        <h1>${escapeHtml(project.name)}</h1>
        <p>${escapeHtml(project.description.en)}</p>
        ${project.url ? `<p><a href="${project.url}" rel="noopener" target="_blank">${escapeHtml(project.urlLabel)}</a></p>` : ''}
        ${project.urlSecondary ? `<p><a href="${project.urlSecondary}" rel="noopener" target="_blank">${escapeHtml(project.urlSecondaryLabel)}</a></p>` : ''}
        <h2>Tech stack</h2>
        ${renderTech(project)}
        <h2>Screenshots</h2>
        <div>${renderImages(project)}</div>
      </main>`,
  project,
  locale: 'en',
  frPath: `/projects/${project.folder}`,
}));

const allRoutes = [...routes, ...projectRoutes, ...enRoutes, ...enProjectRoutes];

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const route of allRoutes) {
  const { title, desc, content, path } = route;
  const locale = route.locale || 'fr';
  const isEn = locale === 'en';
  const url = `${SITE}${path === '/' ? '' : path}`;
  const canonical = path === '/' ? `${SITE}/` : `${SITE}${path}`;

  // hreflang pair — skipped for FR-only pages where frPath is explicitly null
  const hasAlternate = route.frPath !== null && route.frPath !== undefined;
  const frHref = hasAlternate
    ? (route.frPath === '/' ? `${SITE}/` : `${SITE}${route.frPath}`)
    : null;
  const enHref = hasAlternate
    ? (route.frPath === '/' ? `${SITE}/en` : `${SITE}/en${route.frPath}`)
    : null;

  let html = baseHtml;

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc}">`
  );

  // Replace canonical AND inject hreflang block right after it (only when applicable)
  if (hasAlternate) {
    const hreflang = [
      `<link rel="alternate" hreflang="fr" href="${frHref}">`,
      `    <link rel="alternate" hreflang="en" href="${enHref}">`,
      `    <link rel="alternate" hreflang="x-default" href="${frHref}">`,
    ].join('\n    ');
    html = html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${canonical}">\n    ${hreflang}`
    );
  } else {
    html = html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${canonical}">`
    );
  }

  // Replace OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${desc}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*"/, `$1${isEn ? 'en_US' : 'fr_FR'}"`);
  if (hasAlternate) {
    html = html.replace(/(<meta property="og:locale:alternate" content=")[^"]*"/, `$1${isEn ? 'fr_FR' : 'en_US'}"`);
  } else {
    // Drop the og:locale:alternate tag entirely for single-locale pages
    html = html.replace(/\s*<meta property="og:locale:alternate" content="[^"]*">\n?/, '\n    ');
  }

  // Replace lang attribute on html tag
  html = html.replace(/<html[^>]*\blang="[^"]*"/, m => m.replace(/lang="[^"]*"/, `lang="${locale}"`));

  // Replace Twitter tags
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${desc}"`);

  // Inject JSON-LD structured data
  const jsonLd = [];

  // WebSite schema (all pages)
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tene Coulibaly — Portfolio',
    url: SITE,
    description: isEn
      ? 'Portfolio of Tene Coulibaly, Full Stack Developer in Paris'
      : 'Portfolio de Tene Coulibaly, développeuse Full Stack à Paris',
    author: { '@type': 'Person', name: 'Tene Coulibaly' },
    inLanguage: ['fr', 'en'],
  });

  // BreadcrumbList (subpages — skip the two locale roots)
  if (path !== '/' && path !== '/en') {
    const pageName = title.split('—')[0].trim();
    const homeName = isEn ? 'Home' : 'Accueil';
    const projectsName = isEn ? 'Projects' : 'Projets';
    const homeUrl = isEn ? `${SITE}/en` : SITE;
    const projectsUrl = isEn ? `${SITE}/en/projects` : `${SITE}/projects`;
    const items = [{ '@type': 'ListItem', position: 1, name: homeName, item: homeUrl }];
    if (route.project) {
      items.push({ '@type': 'ListItem', position: 2, name: projectsName, item: projectsUrl });
      items.push({ '@type': 'ListItem', position: 3, name: route.project.name, item: url });
    } else {
      items.push({ '@type': 'ListItem', position: 2, name: pageName, item: url });
    }
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    });
  }

  // Service + FAQ schemas for the commercial /offre landing page
  if (path === '/offre') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${SITE}/offre#service`,
      name: 'Tene Coulibaly — Création de sites web',
      description: "Création de sites web sur mesure pour commerçants, artisans et entrepreneurs locaux en Île-de-France.",
      url: `${SITE}/offre`,
      image: `${SITE}/images/og-image.webp`,
      provider: { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Tene Coulibaly' },
      areaServed: [
        { '@type': 'City', name: 'Paris' },
        { '@type': 'AdministrativeArea', name: 'Île-de-France' },
        { '@type': 'Country', name: 'France' },
      ],
      priceRange: '€€',
      offers: [
        { '@type': 'Offer', name: 'Pack Vitrine', description: 'Site one-page moderne, responsive, optimisé Google, formulaire de contact.', price: 800, priceCurrency: 'EUR', priceSpecification: { '@type': 'PriceSpecification', valueAddedTaxIncluded: false } },
        { '@type': 'Offer', name: 'Pack Business', description: 'Site multi-pages, blog, fiche Google Business, intégration réservation.', price: 1500, priceCurrency: 'EUR', priceSpecification: { '@type': 'PriceSpecification', valueAddedTaxIncluded: false } },
        { '@type': 'Offer', name: 'Pack Premium', description: 'Application web sur mesure avec fonctionnalités avancées et accompagnement SEO.', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'EUR', description: 'Sur devis' } },
      ],
      contactPoint: { '@type': 'ContactPoint', email: 'contact@tenecoulibaly.fr', contactType: 'sales', availableLanguage: ['French'] },
    });
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: "Combien de temps ça prend de A à Z ?", acceptedAnswer: { '@type': 'Answer', text: "Entre 2 semaines (Pack Vitrine) et 4 semaines (Pack Business). Le Pack Premium dépend du périmètre, on en discute lors du premier appel." } },
        { '@type': 'Question', name: "Je n'y connais rien en informatique, c'est un problème ?", acceptedAnswer: { '@type': 'Answer', text: "Pas du tout. Mon rôle est justement de m'occuper de toute la partie technique. On parle ensemble de votre commerce, de vos clients, de ce que vous voulez transmettre — je traduis ça en site web. Vous n'avez aucune ligne de code à voir." } },
        { '@type': 'Question', name: "Est-ce que je pourrai modifier mon site moi-même ?", acceptedAnswer: { '@type': 'Answer', text: "Oui. Selon le pack, je vous mets en place une interface simple (style Notion ou Strapi) pour modifier vos textes, ajouter des photos ou un article de blog. Je vous forme à la livraison." } },
        { '@type': 'Question', name: "Pourquoi pas juste une page Facebook ou Instagram ?", acceptedAnswer: { '@type': 'Answer', text: "Parce que vous n'êtes pas propriétaire de votre audience. Demain, Meta change l'algorithme ou ferme votre page — vous perdez tout. Un site web vous appartient, apparaît sur Google quand on cherche votre métier, et donne confiance." } },
        { '@type': 'Question', name: "C'est quoi le SEO dont tu parles ?", acceptedAnswer: { '@type': 'Answer', text: "C'est tout ce qui fait que votre site apparaît dans les résultats Google quand un client tape « coiffeur Paris 11 » ou « garage Paris 12 ». Je configure ça à la livraison : titres, descriptions, fiche Google Business, balisage local." } },
        { '@type': 'Question', name: "Et si je veux des modifications après la livraison ?", acceptedAnswer: { '@type': 'Answer', text: "Les Packs Vitrine et Business incluent 15 jours de retouches gratuites après mise en ligne. Au-delà, je propose des forfaits maintenance ou des interventions à la demande. Pas d'abonnement obligatoire." } },
      ],
    });
  }

  // CreativeWork schema for project detail pages (description matches page locale)
  if (route.project) {
    const p = route.project;
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.name,
      url: url,
      description: isEn ? p.description.en : p.description.fr,
      creator: { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Tene Coulibaly' },
      inLanguage: locale,
      image: p.images.map(img => `${SITE}/images/projects/${p.folder}/${img.file}`),
      keywords: flatTechList(p).join(', '),
      ...(p.url && { sameAs: [p.url] }),
    });
  }

  // Person schema (home only — both FR and EN root)
  if (path === '/' || path === '/en') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      inLanguage: locale,
      mainEntity: {
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Tene Coulibaly',
        url: SITE,
        image: `${SITE}/images/og-image.webp`,
        jobTitle: isEn ? 'Full Stack Developer' : 'Développeuse Full Stack',
        description: isEn
          ? 'Full Stack Developer based in Paris, looking for a permanent position starting September 2026.'
          : 'Développeuse Full Stack à Paris, en recherche de CDI dès septembre 2026.',
        knowsAbout: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Express', 'Symfony', 'PHP', 'PostgreSQL', 'Docker', 'Flutter', 'Prisma', 'Tailwind CSS', 'Three.js', 'GSAP'],
        address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressRegion: 'Île-de-France', addressCountry: 'FR' },
        nationality: { '@type': 'Country', name: 'France' },
        alumniOf: [
          { '@type': 'EducationalOrganization', name: 'ETNA' },
          { '@type': 'EducationalOrganization', name: 'Epitech' },
        ],
        worksFor: { '@type': 'Organization', name: 'INSEAD' },
        sameAs: [
          'https://github.com/CoulibalyT',
          'https://www.linkedin.com/in/tenecoulibaly/',
          'https://www.npmjs.com/package/portfolio-sync',
        ],
        email: 'coulibaly.tene00@gmail.com',
      }
    });
  }

  const jsonLdScript = jsonLd.map(schema =>
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  ).join('\n    ');

  html = html.replace('</head>', `    ${jsonLdScript}\n  </head>`);

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

// Generate sitemap.xml dynamically — includes FR + EN URLs with xhtml:link hreflang annotations
const today = new Date().toISOString().split('T')[0];
const sitemapEntries = allRoutes.map(r => {
  const loc = r.path === '/' ? `${SITE}/` : `${SITE}${r.path}`;
  const hasAlt = r.frPath !== null && r.frPath !== undefined;
  const basePath = r.frPath ?? r.path;
  let priority = '0.7';
  if (basePath === '/') priority = '1.0';
  else if (basePath === '/projects') priority = '0.9';
  else if (basePath === '/offre') priority = '0.95';
  else if (r.project) priority = '0.7';
  else if (basePath === '/contact') priority = '0.6';
  else if (basePath === '/playground') priority = '0.5';
  // EN pages slightly lower than FR canonical (signals FR is primary)
  if (r.locale === 'en') priority = (parseFloat(priority) - 0.1).toFixed(1);
  const changefreq = basePath === '/contact' ? 'yearly' : 'monthly';
  const altLinks = hasAlt
    ? [
        `    <xhtml:link rel="alternate" hreflang="fr" href="${r.frPath === '/' ? `${SITE}/` : `${SITE}${r.frPath}`}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${r.frPath === '/' ? `${SITE}/en` : `${SITE}/en${r.frPath}`}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${r.frPath === '/' ? `${SITE}/` : `${SITE}${r.frPath}`}"/>`,
      ].join('\n')
    : '';
  return `  <url>
    <loc>${loc}</loc>${altLinks ? '\n' + altLinks : ''}
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
console.log('  -> sitemap.xml');

// Generate robots.txt with named AI bots explicitly allowed
const robots = `User-agent: *
Allow: /

# AI crawlers (explicit allow for clarity)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
writeFileSync(join(DIST, 'robots.txt'), robots, 'utf-8');
console.log('  -> robots.txt');

// Generate 404.html (served by Vercel with HTTP 404 status when no route matches)
const notFoundHtml = baseHtml
  .replace(/<title>[^<]*<\/title>/, '<title>404 — Page introuvable | Tene Coulibaly</title>')
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Cette page n\'existe pas. Retour au portfolio de Tene Coulibaly.">'
  )
  .replace('</head>', '    <meta name="robots" content="noindex">\n  </head>')
  .replace(
    '<div id="app"></div>',
    `<div id="app"><main style="position:absolute;left:-9999px;top:-9999px" aria-hidden="false"><h1>404 — Page introuvable</h1><p>La page demandée n'existe pas. <a href="/">Retour à l'accueil</a></p></main></div>`
  );
writeFileSync(join(DIST, '404.html'), notFoundHtml, 'utf-8');
console.log('  -> 404.html');

console.log('SEO injection complete!');
