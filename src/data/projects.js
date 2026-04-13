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
      fr: 'Plateforme communautaire pour les passionnés de voyage. Découverte de destinations, forum d\'échange et gestion de projets de voyages collaboratifs.',
      en: 'Community platform for travel enthusiasts. Destination discovery, discussion forum and collaborative travel project management.',
    },
    tech: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
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
    url: 'https://x.com/bento_designApp',
    urlLabel: 'Voir sur X',
    description: {
      fr: 'Plateforme de challenges créatifs pour designers. Soumission de projets, votes, classements, détection anti-IA multi-couches et plugin Figma intégré.',
      en: 'Creative challenge platform for designers. Project submissions, voting, rankings, multi-layer AI detection and integrated Figma plugin.',
    },
    tech: ['Vue.js', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Socket.io', 'Cloudinary'],
    images: [
      { file: 'home.webp',       label: 'Home' },
      { file: 'login.webp',      label: 'Login' },
      { file: 'dashboard.webp',  label: 'Dashboard' },
      { file: 'challenges.webp', label: 'Challenges' },
      { file: 'explore.webp',    label: 'Explorer' },
      { file: 'community.webp',  label: 'Communauté' },
      { file: 'projects.webp',   label: 'Projets' },
      { file: 'settings.webp',   label: 'Paramètres' },
      { file: 'values.webp',     label: 'Values' },
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
    name: 'Daily Quote',
    folder: 'daily-quote',
    url: null,
    urlLabel: null,
    description: {
      fr: 'Petite application affichant une citation inspirante différente chaque jour.',
      en: 'Small app displaying a different inspirational quote every day.',
    },
    tech: ['Vue.js', 'CSS'],
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

function generateCards(projectList, cols = 4) {
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

  // 3. Layout constants
  const GAP = 30
  const MARGIN = 20
  const MIN_W = 280, MAX_W = 360
  const MIN_H = 230, MAX_H = 290
  const JITTER = 15

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
