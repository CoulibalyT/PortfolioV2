// ============================================================
// Project declarations — edit ONLY this array to add/remove images
// ============================================================

export const projects = [
  {
    name: 'NØIR HAUS',
    folder: 'noir-haus',
    role: {
      fr: 'Projet personnel · conçu et développé seule',
      en: 'Personal project · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "NØIR HAUS, défilé de mode 3D réalisé avec Three.js et WebGL",
    url: 'https://noir-inky.vercel.app/',
    urlLabel: 'Voir le défilé',
    urlSecondary: 'https://github.com/CoulibalyT/noir',
    urlSecondaryLabel: 'Voir sur GitHub',
    description: {
      fr: 'Défilé de haute couture en 3D, scrollable et bilingue. Quatre looks CLO3D mis en scène avec caméra orbitale, post-FX cinématographique et finale T-bar. Audio procédural Web Audio, transitions GSAP scroll-driven, soumissions ouvertes aux créateurs.',
      en: 'Scroll-driven 3D haute couture runway, bilingual. Four CLO3D looks staged with orbital camera, cinematic post-FX and T-bar finale. Procedural Web Audio, GSAP scroll-driven transitions, open submissions for creators.',
    },
    tech: {
      'Langage & build': ['TypeScript (strict)', 'Vite', 'HTML5', 'CSS3'],
      'Rendu 3D': ['Three.js r170', 'WebGLRenderer', 'PBR materials', 'IBL', 'GLSL shaders'],
      'Post-FX': ['postprocessing (pmndrs)', 'Bloom', 'Chromatic Aberration', 'Vignette', 'Noise', 'Dissolve custom', 'ColorGrade custom', 'Anamorphic'],
      'Loaders & assets': ['GLTFLoader', 'MeshoptDecoder', 'EXRLoader', 'PMREMGenerator', 'Reflector', 'RectAreaLight', 'InstancedMesh'],
      'Animation': ['GSAP', 'ScrollTrigger', 'AnimationMixer', 'CSS keyframes'],
      'Audio': ['Web Audio API', 'OscillatorNode', 'ConvolverNode', 'LFO'],
      'i18n & UX': ['Dictionnaire FR/EN maison', 'navigator.language', 'localStorage', 'Feature flags URL-driven'],
      'Déploiement': ['Vercel', 'GitHub', 'Cache immutable', 'Preload HDR + GLB'],
    },
    images: [
      { file: 'noir-haus-aw26-heritage.webp', label: 'Héritage', alt: "Défilé de mode 3D NØIR HAUS réalisé avec Three.js : look « Héritage »" },
      { file: 'noir-haus-aw26-dentelle.webp', label: 'Dentelle', alt: "Look « Dentelle » du défilé haute couture 3D NØIR HAUS, rendu en WebGL" },
      { file: 'noir-haus-aw26-givre.webp',    label: 'Givre', alt: "Look « Givre » du défilé de mode 3D NØIR HAUS" },
      { file: 'noir-haus-aw26-clown.webp',    label: 'Clown', alt: "Look « Clown » du défilé 3D NØIR HAUS, collection AW26" },
    ]
  },
  {
    name: 'Skywalk',
    folder: 'skywalk',
    role: {
      fr: 'Projet personnel · conçu et développé seule',
      en: 'Personal project · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "Skywalk, plateforme full-stack d'aide à l'expatriation (React et NestJS)",
    url: 'https://skywalk-chi.vercel.app',
    urlLabel: 'Voir le site',
    description: {
      fr: 'Plateforme full-stack d\'aide à l\'expatriation. Exploration de destinations, gestion de projet, comparaison de villes, recherche d\'emploi, coût de la vie et forum communautaire modéré par IA. 24 modules backend, 110+ endpoints, 8 APIs externes.',
      en: 'Full-stack expatriation platform. Destination exploration, project management, city comparison, job search, cost of living and AI-moderated community forum. 24 backend modules, 110+ endpoints, 8 external APIs.',
    },
    tech: {
      'Frontend': ['React 19', 'TypeScript', 'Vite', 'React Router', 'TanStack Query', 'Tailwind CSS', 'i18next', '@dnd-kit', 'Axios'],
      'Backend': ['NestJS', 'TypeScript', 'TypeORM', 'PostgreSQL', 'Passport JWT', 'Swagger', 'Nodemailer', 'node-cache'],
      'APIs externes': ['OpenAI Moderation', 'Adzuna Jobs', 'Numbeo', 'GeoDB Cities', 'REST Countries', 'OECD', 'OpenWeather', 'ExchangeRate'],
      'Sécurité': ['JWT', 'bcrypt', 'Helmet', 'CORS', 'Rate Limiting', 'RBAC', 'Modération IA'],
      'DevOps': ['Docker', 'Docker Compose', 'Nginx', 'GitHub Actions', 'GitLab CI', 'Render', 'Vercel', 'Supabase'],
      'Testing / Qualité': ['Jest', 'Vitest', 'Playwright', 'Testing Library', 'Supertest', 'ESLint', 'Prettier', 'Husky', 'Commitlint'],
    },
    images: [
      { file: 'home.webp',         label: 'Home', alt: "Page d'accueil de Skywalk, plateforme d'aide à l'expatriation" },
      { file: 'destinations.webp', label: 'Destinations', alt: "Exploration des destinations d'expatriation sur Skywalk" },
      { file: 'forum.webp',        label: 'Forum', alt: "Forum communautaire de Skywalk, modéré par IA" },
      { file: 'projects.webp',     label: 'Projets', alt: "Suivi d'un projet d'expatriation dans l'application Skywalk" },
      { file: 'dashboard.webp',    label: 'Dashboard', alt: "Tableau de bord utilisateur de la plateforme Skywalk" },
    ]
  },
  {
    name: 'Bento',
    folder: 'bento',
    role: {
      fr: 'Projet personnel · conçu et développé seule',
      en: 'Personal project · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "Bento, plateforme de challenges créatifs pour designers",
    url: 'https://bento-sable.vercel.app/',
    urlLabel: 'Voir le site',
    urlSecondary: 'https://x.com/bento_designApp',
    urlSecondaryLabel: 'Voir sur X',
    description: {
      fr: 'Plateforme de challenges créatifs pour designers. Soumission de projets, votes, classements, détection anti-IA multi-couches et plugin Figma intégré.',
      en: 'Creative challenge platform for designers. Project submissions, voting, rankings, multi-layer AI detection and integrated Figma plugin.',
    },
    tech: {
      'Frontend': ['Vue 3', 'Vite', 'Vue Router', 'Pinia', 'TanStack Query', 'Tailwind CSS', 'i18n'],
      'Backend': ['Node.js', 'NestJS', 'Express', 'Prisma ORM', 'PostgreSQL', 'JWT', 'OAuth 2.0', 'Socket.io', 'Zod'],
      'IA / Sécurité': ['Hugging Face API', 'Détection IA multi-couches', 'FFT Analysis', 'Anti-plagiat', 'Helmet', 'Rate Limiting'],
      'Cloud / DevOps': ['Cloudinary', 'SendGrid', 'Vercel', 'Heroku', 'Docker', 'PM2', 'CI/CD'],
      'Plugin': ['Figma Plugin API', 'TypeScript'],
      'Testing / Qualité': ['Jest', 'Supertest', 'SEO', 'Web Vitals', 'GA4'],
    },
    images: [
      { file: 'home.webp',       label: 'Home', alt: "Page d'accueil de Bento, plateforme de challenges créatifs pour designers" },
      { file: 'login.webp',      label: 'Login', alt: "Écran de connexion de l'application Bento" },
      { file: 'challenges.webp', label: 'Challenges', alt: "Liste des challenges de design proposés sur Bento" },
      { file: 'create-challenge.webp', label: 'Création de challenge', alt: "Formulaire de création d'un challenge de design sur Bento" },
      { file: 'explore.webp',    label: 'Explorer', alt: "Page Explorer de Bento : projets de designers à découvrir" },
      { file: 'community.webp',  label: 'Communauté', alt: "Espace communauté de Bento : votes et classements des designers" },
      { file: 'projects.webp',   label: 'Projets', alt: "Galerie des projets soumis par les designers sur Bento" },
      { file: 'settings.webp',   label: 'Paramètres', alt: "Paramètres du compte utilisateur sur Bento" },
    ]
  },
  {
    name: 'Joy of Simple',
    tier: 'secondary',
    folder: 'joyofsimple',
    url: 'https://joyofsimple-site.vercel.app',
    urlLabel: 'Voir le site',
    description: {
      fr: 'Site vitrine pour un studio de design minimaliste. Présentation de l\'approche créative et formulaire de contact.',
      en: 'Showcase website for a minimalist design studio. Creative approach presentation and contact form.',
    },
    tech: ['Vue.js', 'GSAP', 'Tailwind CSS'],
    images: [
      { file: 'home.webp',     label: 'Home', alt: "Page d'accueil du site vitrine Joy of Simple, studio de design minimaliste" },
      { file: 'contact.webp',  label: 'Contact', alt: "Page contact du site vitrine Joy of Simple" },
      { file: 'approche.webp', label: 'Approche', alt: "Page « Approche » du site vitrine Joy of Simple" },
    ]
  },
  {
    name: 'APOL (INSEAD)',
    folder: 'scholarship',
    role: {
      fr: 'INSEAD · alternance · équipe de 3 développeurs, 1 testeur et 1 chef de projet',
      en: 'INSEAD · work-study · team of 3 developers, 1 tester and 1 project manager',
    },
    cover: 'cover.webp',
    coverAlt: "APOL, application de gestion des candidatures et des bourses d'INSEAD",
    url: null,
    urlLabel: null,
    description: {
      fr: 'Application web d\'entreprise développée pour INSEAD gérant le cycle complet des candidatures aux programmes diplômants (MBA, EMBA, MIM), les admissions et la gestion des bourses. 6 bundles Symfony, SSO ADFS, intégrations PeopleSoft, DocuSign, Kira Talent. Dématérialisation du « Company Application Form » : d\'un formulaire Word à un processus 100 % digital. Refonte de l\'interface Scholarships (étudiant et administrateur).',
      en: 'Enterprise web application built for INSEAD managing the full application cycle for degree programs (MBA, EMBA, MIM), admissions and scholarship management. 6 Symfony bundles, ADFS SSO, PeopleSoft, DocuSign, Kira Talent integrations. Digitised the « Company Application Form »: from a Word document to a 100% digital process. Redesigned the Scholarships interface (student and admin).',
    },
    tech: {
      'Backend': ['Symfony 6.4', 'PHP 8.1', 'Doctrine ORM', 'Twig', 'PHPUnit'],
      'Base de données': ['Microsoft SQL Server', 'Doctrine Migrations'],
      'Frontend': ['jQuery', 'Bootstrap', 'DataTables', 'Select2', 'Chart.js', 'CKEditor'],
      'Auth / Sécurité': ['ADFS', 'SAML 2.0', 'SSO', 'RBAC', 'CSRF', 'SHA512', 'Snyk', 'BurpSuite'],
      'Intégrations': ['PeopleSoft (SOAP)', 'DocuSign', 'Kira Talent', 'Eloqua', 'Worldpay', 'MuleSoft'],
      'DevOps': ['Jenkins', 'Windows IIS', 'INT/UAT/PROD', 'PHPSpreadsheet', 'dompdf', 'wkhtmltopdf'],
    },
    images: [
      { file: 'main.webp',              label: 'Dashboard', alt: "Tableau de bord d'APOL, application de gestion des candidatures d'INSEAD" },
      { file: 'list.webp',              label: 'Liste des candidatures', alt: "Liste des candidatures aux programmes INSEAD dans APOL" },
      { file: 'scholarship-create.webp', label: 'Création de bourse', alt: "Création d'une bourse dans l'application APOL (INSEAD)" },
      { file: 'evaluator.webp',         label: 'Évaluation', alt: "Interface d'évaluation des candidatures dans APOL" },
      { file: 'reports.webp',           label: 'Rapports', alt: "Rapports sur les candidatures et les bourses dans APOL" },
    ]
  },
  {
    name: 'ePortal (INSEAD)',
    folder: 'eportal',
    role: {
      fr: 'INSEAD · alternance · conçu et développé seule',
      en: 'INSEAD · work-study · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "ePortal, portail Executive Education d'INSEAD refondu sur Salesforce",
    url: null,
    urlLabel: null,
    description: {
      fr: 'Refonte complète du portail Executive Education d\'INSEAD, où entreprises (B2B) et particuliers (B2C) achètent leurs formations puis les suivent. Un portail construit page après page pendant des années, sans cohérence d\'ensemble : j\'ai redonné une charte unique aux deux parcours, sans toucher au fonctionnement. Composants réutilisables, une seule couleur d\'action par écran, migration écran par écran et documentation complète pour l\'équipe. Intégré à Salesforce.',
      en: 'Full redesign of INSEAD\'s Executive Education portal, where organisations (B2B) and individuals (B2C) buy their programmes and then follow them. A portal built page by page over the years with no overall consistency: I brought both journeys under a single design system without changing how anything works. Reusable components, one action colour per screen, screen-by-screen migration and full documentation for the team. Integrated into Salesforce.',
    },
    tech: {
      'Plateforme': ['Salesforce', 'Lightning Web Components', 'Aura Components', 'Apex'],
      'Design': ['UI/UX', 'Charte INSEAD 2025'],
    },
    images: [
      { file: 'b2b.webp',                     label: 'Accueil B2B', alt: "Accueil B2B d'ePortal, portail Executive Education d'INSEAD" },
      { file: 'mylearning-enrolled.webp',     label: 'My Learning', alt: "Espace My Learning d'ePortal : formations suivies par l'apprenant" },
      { file: 'mylearning-applications.webp', label: 'Candidatures', alt: "Suivi des candidatures aux formations dans ePortal (INSEAD)" },
      { file: 'mylearning-reco.webp',         label: 'Recommandations', alt: "Recommandations de formations personnalisées dans ePortal" },
      { file: 'search-certificates.webp',     label: 'Recherche certificats', alt: "Recherche de certificats Executive Education dans ePortal" },
      { file: 'search-advancing.webp',        label: 'Recherche programmes', alt: "Recherche de programmes de formation dans ePortal (INSEAD)" },
    ]
  },
  {
    name: 'Intake (INSEAD)',
    folder: 'intake',
    role: {
      fr: 'Mission freelance · conçue et développée seule',
      en: 'Freelance project · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "Intake, application de support informatique développée pour INSEAD",
    url: null,
    urlLabel: null,
    description: {
      fr: 'Application interne de gestion du support IT pour INSEAD. Check-in étudiants par badge/email, file d\'attente technicien temps réel, dashboards manager (KPIs, tendances, word cloud) et outils admin (configuration, exports CSV). Architecture multi-base (MySQL local / PostgreSQL-Supabase prod) avec accès role-based scoped par campus.',
      en: 'Internal IT support operations app for INSEAD. Badge/email student check-in, live technician queue, manager analytics dashboards (KPIs, trends, word cloud) and admin tooling (config, CSV exports). Multi-database architecture (MySQL local / PostgreSQL-Supabase prod) with campus-aware role-based access.',
    },
    tech: {
      'Frontend': ['Next.js 15', 'React 19', 'TypeScript 5', 'Tailwind CSS 3', 'Framer Motion', 'Recharts'],
      'Backend': ['Route Handlers', 'Server Actions', 'Zod'],
      'Data': ['Prisma 6', 'MySQL', 'PostgreSQL', 'Supabase'],
      'Auth / Sécurité': ['NextAuth v5', 'Microsoft Entra ID (SSO)', 'JWT', 'RBAC', 'Campus-aware middleware'],
      'Intégrations': ['Power BI Embed', 'SMTP', 'Alertes email'],
      'Observabilité': ['Sentry'],
      'Testing': ['Playwright (E2E)', 'ESLint'],
      'Déploiement': ['Vercel', 'Supabase'],
    },
    images: [
      { file: 'home.webp',        label: 'Accueil', alt: "Accueil d'Intake, application de support informatique pour les étudiants d'INSEAD" },
      { file: 'check-in.webp',    label: 'Check-in étudiant', alt: "Check-in étudiant par badge ou e-mail dans Intake" },
      { file: 'technician.webp',  label: 'Queue technicien', alt: "File d'attente des techniciens en temps réel dans Intake" },
      { file: 'manager.webp',     label: 'Dashboard analytics', alt: "Tableau de bord analytique d'Intake pour les responsables du support IT" },
      { file: 'maintenance.webp', label: 'Admin hub', alt: "Hub d'administration de l'application Intake" },
      { file: 'programmes.webp',  label: 'Gestion programmes', alt: "Gestion des programmes étudiants dans Intake" },
      { file: 'export.webp',      label: 'Export CSV', alt: "Export CSV des données du support IT dans Intake" },
    ]
  },
  {
    name: 'Autoomat',
    folder: 'autoomat',
    role: {
      fr: 'Mission freelance pour un carrossier · conçue et développée seule',
      en: 'Freelance project for a body shop · designed and built solo',
    },
    cover: 'cover.webp',
    coverAlt: "Site vitrine du garage Autoomat à Ivry-sur-Seine",
    url: 'https://www.autoomat.fr',
    urlLabel: 'Voir le site',
    description: {
      fr: 'Site vitrine & outil métier pour un carrossier. Parcours sinistre guidé multi-étapes, devis en ligne avec upload photos et identification véhicule par plaque (API SIV), gestion assurance avec Google Sheets et emails automatisés. SEO local optimisé.',
      en: 'Showcase website & business tool for an auto body shop. Multi-step claim journey, online quote with photo upload and vehicle lookup by plate (SIV API), insurance management with Google Sheets and automated emails. Local SEO optimized.',
    },
    tech: {
      'Frontend': ['Next.js 15', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion'],
      'Backend': ['Server Actions', 'Route Handlers', 'Rate Limiting', 'API SIV'],
      'Intégrations': ['Google Sheets', 'Google Drive', 'Calendly', 'WhatsApp Business'],
      'SEO': ['JSON-LD', 'Open Graph', 'Sitemap dynamique', 'Schema.org'],
      'Déploiement': ['Vercel', 'SSG'],
    },
    images: [
      { file: 'home.webp', label: 'Accueil', alt: "Page d'accueil du site vitrine de la carrosserie Autoomat à Ivry-sur-Seine" },
      { file: 'parcours-sinistre.webp', label: 'Parcours Sinistre', alt: "Parcours sinistre guidé sur le site du garage Autoomat" },
      { file: 'devis-en-ligne.webp', label: 'Devis en ligne', alt: "Devis en ligne avec identification du véhicule par plaque sur le site Autoomat" },
      { file: 'assurance.webp', label: 'Assurance', alt: "Outil de gestion des dossiers d'assurance développé pour la carrosserie Autoomat" },
    ]
  },
  {
    name: 'Portfolio Sync',
    tier: 'secondary',
    folder: 'portfolio-sync',
    url: 'https://www.npmjs.com/package/portfolio-sync',
    urlLabel: 'Voir sur npm',
    description: {
      fr: 'Outil CLI Node.js qui capture automatiquement des screenshots de projets web déployés, les optimise et détecte les changements via hash MD5. Supporte 5 types d\'authentification, CI/CD via GitHub Actions et 4 formats d\'image.',
      en: 'Node.js CLI tool that automatically captures screenshots of deployed web projects, optimizes them and detects changes via MD5 hash. Supports 5 auth types, CI/CD via GitHub Actions and 4 image formats.',
    },
    tech: {
      'Runtime': ['Node.js', 'Commander CLI'],
      'Automation': ['Puppeteer', 'GitHub Actions', 'Cron'],
      'Traitement image': ['Sharp', 'WebP', 'AVIF', 'JPEG', 'PNG'],
      'Auth': ['Form', 'HTTP Basic', 'Bearer Token', 'Cookies', 'Custom Script'],
      'Testing': ['node:test (natif)', 'MD5 hash diff'],
      'UX': ['Chalk', 'Ora spinners', 'dotenv'],
    },
    images: [
      { file: 'cli.webp', label: 'CLI Output', alt: "Sortie terminal de Portfolio Sync, outil CLI Node.js de capture de screenshots" },
    ]
  },
  {
    name: 'Daily Quote',
    tier: 'secondary',
    folder: 'daily-quote',
    url: null,
    urlLabel: null,
    description: {
      fr: 'Application mobile cross-platform affichant des citations inspirantes avec thème dynamique jour/nuit basé sur la météo, synthèse vocale et widgets natifs pour l\'écran d\'accueil.',
      en: 'Cross-platform mobile app displaying inspirational quotes with dynamic day/night theme based on weather, text-to-speech and native home screen widgets.',
    },
    tech: {
      'Mobile': ['Flutter', 'Dart', 'Material 3'],
      'Natif': ['Kotlin', 'Swift', 'WidgetKit', 'AppWidget'],
      'APIs': ['Open-Meteo', 'DummyJSON', 'Geolocator', 'Text-to-Speech'],
      'Fonctionnalités': ['Cache hors-ligne', 'Notifications locales', 'Partage natif'],
    },
    images: [
      { file: 'home.webp', label: 'App', alt: "Écran d'accueil de Daily Quote, application mobile Flutter de citations" },
    ]
  },
]

// ============================================================
// Auto-generation — do NOT edit below
// ============================================================

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function seededRange(seed, min, max) {
  return min + seededRandom(seed) * (max - min)
}

function flattenImages(projectList) {
  const flat = []
  for (const project of projectList) {
    for (const image of project.images) {
      flat.push({
        img: `/images/projects/${project.folder}/${image.file}`,
        label: image.label,
        alt: image.alt,
        project: project.name,
        url: project.url || null,
        urlLabel: project.urlLabel || null,
      })
    }
  }
  return flat
}

// One card per project: its presentation cover (opens the project on click)
function flattenCovers(projectList) {
  return projectList.filter(p => p.cover).map(project => ({
    img: `/images/projects/${project.folder}/${project.cover}`,
    label: project.name,
    alt: project.coverAlt,
    project: project.name,
    url: project.url || null,
    urlLabel: project.urlLabel || null,
    isCover: true,
  }))
}

function generateCards(flat, cols = 5, size = {}) {

  // 2. Deterministic interleaved shuffle (spread projects apart)
  const shuffled = interleaveShuffle(flat)

  // 2.5 Pad to fill last row — duplicate random cards so no empty cells
  const remainder = shuffled.length % cols
  if (remainder !== 0) {
    const needed = cols - remainder
    for (let i = 0; i < needed; i++) {
      shuffled.push({ ...shuffled[i] })
    }
  }

  // 3. Layout constants
  const GAP = 16
  const MARGIN = 10
  const { MIN_W = 250, MAX_W = 320, MIN_H = 190, MAX_H = 250, ratio = null } = size
  const JITTER = 8

  // 4. Generate card sizes first to compute grid cell dimensions
  // (a fixed ratio keeps covers uncropped, since cards use object-fit: cover)
  const cardSizes = shuffled.map((_, i) => {
    const w = Math.round(seededRange(i * 3, MIN_W, MAX_W))
    return { w, h: ratio ? Math.round(w * ratio) : Math.round(seededRange(i * 3 + 1, MIN_H, MAX_H)) }
  })

  const rows = Math.ceil(shuffled.length / cols)

  // 5. Compute column widths (max card width in each column)
  const colWidths = []
  for (let c = 0; c < cols; c++) {
    let maxW = 0
    for (let r = 0; r < rows; r++) {
      const idx = r * cols + c
      if (idx < cardSizes.length) {
        maxW = Math.max(maxW, cardSizes[idx].w)
      }
    }
    colWidths.push(maxW)
  }

  // 6. Compute row heights (max card height in each row)
  const rowHeights = []
  for (let r = 0; r < rows; r++) {
    let maxH = 0
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      if (idx < cardSizes.length) {
        maxH = Math.max(maxH, cardSizes[idx].h)
      }
    }
    rowHeights.push(maxH)
  }

  // 7. Compute cell origins (top-left of each cell)
  const colX = [MARGIN]
  for (let c = 1; c < cols; c++) {
    colX.push(colX[c - 1] + colWidths[c - 1] + GAP)
  }

  const rowY = [MARGIN]
  for (let r = 1; r < rows; r++) {
    rowY.push(rowY[r - 1] + rowHeights[r - 1] + GAP)
  }

  // 8. Tile dimensions
  const tileW = colX[cols - 1] + colWidths[cols - 1] + MARGIN
  const tileH = rowY[rows - 1] + rowHeights[rows - 1] + MARGIN

  // 9. Place each card centered in its cell with jitter
  const cards = []
  for (let i = 0; i < shuffled.length; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const { w, h } = cardSizes[i]

    // Center in cell
    const centerX = colX[c] + (colWidths[c] - w) / 2
    const centerY = rowY[r] + (rowHeights[r] - h) / 2

    // Add jitter
    const jx = Math.round(seededRange(i * 7 + 2, -JITTER, JITTER))
    const jy = Math.round(seededRange(i * 7 + 3, -JITTER, JITTER))

    // Clamp to stay inside tile with margin
    let tx = Math.max(MARGIN, Math.min(centerX + jx, tileW - w - MARGIN))
    let ty = Math.max(MARGIN, Math.min(centerY + jy, tileH - h - MARGIN))

    // Rotation
    const rot = Math.round(seededRange(i * 7 + 4, -2.5, 2.5) * 10) / 10

    cards.push({
      w, h, tx, ty, rot,
      img: shuffled[i].img,
      label: shuffled[i].label,
      alt: shuffled[i].alt,
      project: shuffled[i].project,
      url: shuffled[i].url,
      urlLabel: shuffled[i].urlLabel,
      isCover: !!shuffled[i].isCover,
    })
  }

  return { cards, tileW, tileH }
}

// Interleave projects so no two adjacent cards are from the same project
function interleaveShuffle(items) {
  // Group by project
  const groups = {}
  for (const item of items) {
    if (!groups[item.project]) groups[item.project] = []
    groups[item.project].push(item)
  }

  // Sort groups by size (largest first) for better interleaving
  const sortedKeys = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length)
  const queues = sortedKeys.map(k => [...groups[k]])

  // Round-robin pick from each project
  const result = []
  let round = 0
  while (result.length < items.length) {
    let picked = false
    for (const queue of queues) {
      if (queue.length > 0) {
        result.push(queue.shift())
        picked = true
      }
    }
    if (!picked) break
    round++
  }

  return result
}

// ============================================================
// Generate and export
// ============================================================

// Le collage principal (bento) ne contient QUE les couvertures des projets primaires
// (1 carte par projet, format 16:10 des couvertures).
// Les captures de chaque projet et les projets "secondary" sont rendus
// à la demande depuis allImageCards via les filtres.
const primaryProjects = projects.filter(p => p.tier !== 'secondary')
const { cards, tileW, tileH } = generateCards(flattenCovers(primaryProjects), 3, { MIN_W: 440, MAX_W: 520, ratio: 0.625 })

export const projectCards = cards
export const TILE_W = tileW
export const TILE_H = tileH

// Liste plate de TOUTES les images (primaires + secondaires) pour la vue filtrée
export const allImageCards = flattenImages(projects)

// Texte alternatif de chaque image de projet, indexé par son chemin public (ex. polaroids de /skills)
export const imageAlts = Object.fromEntries(
  [...flattenCovers(projects), ...allImageCards].map(c => [c.img, c.alt])
)

// Title + description d'une page projet (/projects/<folder>). Partagé par ProjectView.vue (runtime)
// et scripts/inject-meta.mjs (HTML statique) pour que les deux versions de la page disent la même chose.
export function projectSeo(project, locale = 'fr') {
  const en = locale === 'en'
  const desc = en ? project.description.en : project.description.fr
  return {
    title: `${project.name} — ${en ? 'Full Stack Project by Tene Coulibaly' : 'Projet Full Stack par Tene Coulibaly'}`,
    description: desc.length > 160 ? desc.substring(0, 159).trimEnd() + '…' : desc,
  }
}
