// ============================================================
// Project declarations — edit ONLY this array to add/remove images
// ============================================================

export const projects = [
  {
    name: 'Skywalk',
    folder: 'skywalk',
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
      { file: 'home.webp',         label: 'Home' },
      { file: 'destinations.webp', label: 'Destinations' },
      { file: 'forum.webp',        label: 'Forum' },
      { file: 'projects.webp',     label: 'Projets' },
      { file: 'dashboard.webp',    label: 'Dashboard' },
    ]
  },
  {
    name: 'Bento',
    folder: 'bento',
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
      { file: 'home.webp',       label: 'Home' },
      { file: 'login.webp',      label: 'Login' },
      { file: 'challenges.webp', label: 'Challenges' },
      { file: 'create-challenge.webp', label: 'Création de challenge' },
      { file: 'explore.webp',    label: 'Explorer' },
      { file: 'community.webp',  label: 'Communauté' },
      { file: 'projects.webp',   label: 'Projets' },
      { file: 'settings.webp',   label: 'Paramètres' },
    ]
  },
  {
    name: 'Joy of Simple',
    folder: 'joyofsimple',
    url: 'https://joyofsimple-site.vercel.app',
    urlLabel: 'Voir le site',
    description: {
      fr: 'Site vitrine pour un studio de design minimaliste. Présentation de l\'approche créative et formulaire de contact.',
      en: 'Showcase website for a minimalist design studio. Creative approach presentation and contact form.',
    },
    tech: ['Vue.js', 'GSAP', 'Tailwind CSS'],
    images: [
      { file: 'home.webp',     label: 'Home' },
      { file: 'contact.webp',  label: 'Contact' },
      { file: 'approche.webp', label: 'Approche' },
    ]
  },
  {
    name: 'Footprint Calculator',
    folder: 'footprint-calculator',
    url: null,
    urlLabel: null,
    description: {
      fr: 'Module de calcul d\'empreinte carbone développé en alternance chez CAPTAG. Formulaire multi-étapes connecté à l\'API Climeet pour estimer l\'impact environnemental.',
      en: 'Carbon footprint calculator module built during work-study at CAPTAG. Multi-step form connected to the Climeet API to estimate environmental impact.',
    },
    tech: ['Vue.js', 'Node.js', 'API Climeet', 'Tailwind CSS'],
    images: [
      { file: 'home.webp',     label: 'Accueil' },
      { file: 'form.webp',     label: 'Formulaire' },
      { file: 'details.webp',  label: 'Détails' },
      { file: 'finalize.webp', label: 'Résultats' },
      { file: 'choose.webp',   label: 'Sélection' },
      { file: 'overview.webp', label: 'Vue globale' },
    ]
  },
  {
    name: 'APOL (INSEAD)',
    folder: 'scholarship',
    url: null,
    urlLabel: null,
    description: {
      fr: 'Application web d\'entreprise développée pour INSEAD gérant le cycle complet des candidatures aux programmes diplômants (MBA, EMBA, MIM), les admissions et la gestion des bourses. 6 bundles Symfony, SSO ADFS, intégrations PeopleSoft, DocuSign, Kira Talent.',
      en: 'Enterprise web application built for INSEAD managing the full application cycle for degree programs (MBA, EMBA, MIM), admissions and scholarship management. 6 Symfony bundles, ADFS SSO, PeopleSoft, DocuSign, Kira Talent integrations.',
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
      { file: 'main.webp',              label: 'Dashboard' },
      { file: 'list.webp',              label: 'Liste des candidatures' },
      { file: 'scholarship-create.webp', label: 'Création de bourse' },
      { file: 'evaluator.webp',         label: 'Évaluation' },
      { file: 'reports.webp',           label: 'Rapports' },
    ]
  },
  {
    name: 'Autoomat',
    folder: 'autoomat',
    url: 'https://autoomat.vercel.app',
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
      { file: 'home.webp', label: 'Accueil' },
      { file: 'parcours-sinistre.webp', label: 'Parcours Sinistre' },
      { file: 'devis-en-ligne.webp', label: 'Devis en ligne' },
      { file: 'assurance.webp', label: 'Assurance' },
    ]
  },
  {
    name: 'Portfolio Sync',
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
      { file: 'cli.webp', label: 'CLI Output' },
    ]
  },
  {
    name: 'Daily Quote',
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
      { file: 'home.webp', label: 'App' },
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

function generateCards(projectList, cols = 5) {
  // 1. Flatten all images into a single list
  const flat = []
  for (const project of projectList) {
    for (const image of project.images) {
      flat.push({
        img: `/images/projects/${project.folder}/${image.file}`,
        label: image.label,
        project: project.name,
        url: project.url || null,
        urlLabel: project.urlLabel || null,
      })
    }
  }

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
  const MIN_W = 250, MAX_W = 320
  const MIN_H = 190, MAX_H = 250
  const JITTER = 8

  // 4. Generate card sizes first to compute grid cell dimensions
  const cardSizes = shuffled.map((_, i) => ({
    w: Math.round(seededRange(i * 3, MIN_W, MAX_W)),
    h: Math.round(seededRange(i * 3 + 1, MIN_H, MAX_H)),
  }))

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
      project: shuffled[i].project,
      url: shuffled[i].url,
      urlLabel: shuffled[i].urlLabel,
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

const { cards, tileW, tileH } = generateCards(projects)

export const projectCards = cards
export const TILE_W = tileW
export const TILE_H = tileH
