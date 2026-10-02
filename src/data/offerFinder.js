// Guided "find my offer" questionnaire for /offre (FR-only).
// Each step: { q, hint?, multi?, next?, options: [{ value, label, sub?, next? }] }.
// The next step is option.next (single choice) or step.next; 'result' ends the flow.
// Edit the copy freely; keep the values, they drive recommendOffer() below.

import { OFFER_PRICES, OFFER_CUSTOM_FROM } from './offer.js'

export const FINDER_START = 'start'

export const FINDER_STEPS = {
  start: {
    q: 'Quel est votre projet ?',
    options: [
      { value: 'vitrine', label: 'Un site pour présenter mon activité', sub: 'Être trouvé·e sur Google, montrer mes services, être contacté·e', next: 'v_size' },
      { value: 'shop', label: 'Une boutique en ligne', sub: 'Vendre des produits ou des services sur Internet', next: 's_catalog' },
      { value: 'booking', label: 'Un système de réservation', sub: 'Rendez-vous, tables, cours, locations…', next: 'b_type' },
      { value: 'app', label: 'Une application ou un outil sur mesure', sub: 'Espace client, plateforme, outil interne…', next: 'a_who' },
      { value: 'redo', label: 'Refaire mon site actuel', sub: 'Il est lent, daté, introuvable ou difficile à modifier', next: 'r_issue' },
      { value: 'landing', label: 'Une page de lancement', sub: 'Pour un produit, un événement, une campagne', next: 'l_goal' },
      { value: 'unsure', label: 'Je ne sais pas encore', sub: 'On va le découvrir ensemble', next: 'u_goal' },
    ],
  },

  u_goal: {
    q: 'Qu’aimeriez-vous que vos clients puissent faire ?',
    options: [
      { value: 'contact', label: 'Me trouver et me contacter', next: 'v_size' },
      { value: 'buy', label: 'Acheter en ligne', next: 's_catalog' },
      { value: 'book', label: 'Réserver un créneau', next: 'b_type' },
      { value: 'login', label: 'Se connecter à un espace personnel', next: 'a_who' },
    ],
  },

  // --- Showcase site (also reused by "redo") ---
  v_size: {
    q: 'Combien de contenu à présenter ?',
    next: 'v_extras',
    options: [
      { value: 'one', label: 'L’essentiel sur une page', sub: 'Services, horaires, contact' },
      { value: 'few', label: 'Quelques pages', sub: '2 à 5 : prestations, galerie, à propos…' },
      { value: 'many', label: 'Un site plus complet', sub: 'Plus de 5 pages, plusieurs activités' },
    ],
  },
  v_extras: {
    q: 'Vous aimeriez aussi…',
    hint: 'Plusieurs choix possibles',
    multi: true,
    next: 'v_content',
    options: [
      { value: 'gallery', label: 'Une galerie photos' },
      { value: 'blog', label: 'Un blog ou des actualités' },
      { value: 'reviews', label: 'Les avis de mes clients' },
      { value: 'quote', label: 'Un formulaire de demande de devis' },
      { value: 'booking', label: 'La prise de rendez-vous' },
      { value: 'english', label: 'Une version en anglais' },
    ],
  },
  v_content: {
    q: 'Vos textes et photos sont prêts ?',
    next: 'timing',
    options: [
      { value: 'ready', label: 'Oui, j’ai tout' },
      { value: 'partly', label: 'En partie' },
      { value: 'help', label: 'Non, il faudra m’aider', sub: 'Rédaction, choix des photos' },
    ],
  },

  // --- Online shop ---
  s_catalog: {
    q: 'Combien de produits ?',
    next: 's_kind',
    options: [
      { value: 'small', label: 'Moins de 20' },
      { value: 'medium', label: 'Entre 20 et 200' },
      { value: 'large', label: 'Plus de 200' },
    ],
  },
  s_kind: {
    q: 'Que vendez-vous ?',
    next: 's_extras',
    options: [
      { value: 'delivery', label: 'Des produits à livrer' },
      { value: 'pickup', label: 'Du retrait en boutique', sub: 'Click & collect' },
      { value: 'digital', label: 'Des services ou produits numériques', sub: 'Cours, fichiers, prestations' },
    ],
  },
  s_extras: {
    q: 'Il vous faudrait aussi…',
    hint: 'Plusieurs choix possibles',
    multi: true,
    next: 'timing',
    options: [
      { value: 'stock', label: 'La gestion des stocks' },
      { value: 'promo', label: 'Des codes promo' },
      { value: 'subscription', label: 'Des abonnements' },
      { value: 'accounts', label: 'Des comptes clients' },
      { value: 'pos', label: 'Le lien avec ma caisse ou mon logiciel' },
    ],
  },

  // --- Booking ---
  b_type: {
    q: 'Qu’est-ce qu’on réserve ?',
    next: 'b_pay',
    options: [
      { value: 'appointments', label: 'Des rendez-vous', sub: 'Coiffure, soin, consultation…' },
      { value: 'tables', label: 'Des tables', sub: 'Restaurant, bar' },
      { value: 'classes', label: 'Des cours ou ateliers' },
      { value: 'rentals', label: 'Des locations', sub: 'Matériel, salle, logement' },
    ],
  },
  b_pay: {
    q: 'Côté paiement ?',
    next: 'b_extras',
    options: [
      { value: 'none', label: 'Pas de paiement en ligne' },
      { value: 'deposit', label: 'Un acompte à la réservation' },
      { value: 'full', label: 'Le paiement complet en ligne' },
    ],
  },
  b_extras: {
    q: 'Il vous faudrait aussi…',
    hint: 'Plusieurs choix possibles',
    multi: true,
    next: 'timing',
    options: [
      { value: 'reminders', label: 'Des rappels par e-mail ou SMS' },
      { value: 'staff', label: 'Plusieurs agendas', sub: 'Une équipe, plusieurs salles' },
      { value: 'accounts', label: 'Un espace client' },
      { value: 'site', label: 'Un site vitrine autour' },
    ],
  },

  // --- Custom web app ---
  a_who: {
    q: 'C’est pour qui ?',
    next: 'a_features',
    options: [
      { value: 'clients', label: 'Mes clients', sub: 'Un espace client, un suivi de commande…' },
      { value: 'team', label: 'Mon équipe', sub: 'Un outil interne, un back-office' },
      { value: 'platform', label: 'Plusieurs types d’utilisateurs', sub: 'Une plateforme, une marketplace' },
    ],
  },
  a_features: {
    q: 'De quoi a-t-elle besoin ?',
    hint: 'Plusieurs choix possibles',
    multi: true,
    next: 'a_stage',
    options: [
      { value: 'auth', label: 'Des comptes et une connexion' },
      { value: 'payments', label: 'Des paiements ou abonnements' },
      { value: 'dashboard', label: 'Un tableau de bord' },
      { value: 'messaging', label: 'Une messagerie ou des notifications' },
      { value: 'integrations', label: 'Le lien avec d’autres outils', sub: 'API, Google Sheets, logiciel métier…' },
      { value: 'mobile', label: 'Une application mobile' },
    ],
  },
  a_stage: {
    q: 'Où en est le projet ?',
    next: 'timing',
    options: [
      { value: 'idea', label: 'C’est une idée' },
      { value: 'specs', label: 'J’ai une maquette ou un cahier des charges' },
      { value: 'existing', label: 'Une application existe déjà', sub: 'À reprendre ou à faire évoluer' },
    ],
  },

  // --- Redesign ---
  r_issue: {
    q: 'Qu’est-ce qui ne va pas aujourd’hui ?',
    hint: 'Plusieurs choix possibles',
    multi: true,
    next: 'r_platform',
    options: [
      { value: 'slow', label: 'Il est lent ou mal affiché sur mobile' },
      { value: 'seo', label: 'On ne me trouve pas sur Google' },
      { value: 'dated', label: 'Le design est daté' },
      { value: 'edit', label: 'Je n’arrive pas à le modifier' },
      { value: 'features', label: 'Il manque des fonctionnalités' },
    ],
  },
  r_platform: {
    q: 'Il est fait avec quoi ?',
    next: 'r_kind',
    options: [
      { value: 'wordpress', label: 'WordPress' },
      { value: 'builder', label: 'Wix, Squarespace ou Shopify' },
      { value: 'custom', label: 'Développé sur mesure' },
      { value: 'unknown', label: 'Je ne sais pas' },
    ],
  },

  // Routes a redesign to the right branch (a shop redo is not a showcase redo)
  r_kind: {
    q: 'Aujourd’hui, c’est surtout…',
    options: [
      { value: 'site', label: 'Un site de présentation', next: 'v_size' },
      { value: 'shop', label: 'Une boutique en ligne', next: 's_catalog' },
      { value: 'booking', label: 'Un site avec réservation', next: 'b_type' },
      { value: 'app', label: 'Une application ou un espace client', next: 'a_who' },
    ],
  },

  // --- Landing page ---
  l_goal: {
    q: 'Quel est l’objectif de la page ?',
    next: 'timing',
    options: [
      { value: 'leads', label: 'Récolter des inscriptions ou des e-mails' },
      { value: 'sell', label: 'Vendre un produit' },
      { value: 'event', label: 'Annoncer un événement' },
    ],
  },

  // --- Common ending ---
  timing: {
    q: 'Pour quand ?',
    next: 'budget',
    options: [
      { value: 'asap', label: 'Dès que possible', sub: 'Moins d’un mois' },
      { value: 'soon', label: 'Dans 1 à 3 mois' },
      { value: 'later', label: 'Pas pressé·e', sub: 'Je me renseigne' },
    ],
  },
  budget: {
    q: 'Vous avez un budget en tête ?',
    next: 'after',
    options: [
      { value: 'lt1k', label: 'Moins de 1 000 €' },
      { value: '1k3k', label: '1 000 à 3 000 €' },
      { value: '3k8k', label: '3 000 à 8 000 €' },
      { value: 'gt8k', label: 'Plus de 8 000 €' },
      { value: 'unknown', label: 'Je ne sais pas encore' },
    ],
  },
  after: {
    q: 'Et après la mise en ligne ?',
    next: 'result',
    options: [
      { value: 'self', label: 'Je m’en occupe moi-même', sub: 'Je modifie mes textes et photos seul·e' },
      { value: 'managed', label: 'Je préfère vous confier le suivi', sub: 'Mises à jour, photos, horaires…' },
      { value: 'later', label: 'On verra plus tard' },
    ],
  },
}

// answers: { [stepId]: value | value[] } → { pack: 'vitrine' | 'business' | 'premium', from, price, reason, notes, maintenance }
// price: starting price in € (null = fully on quote); notes: extra sentences driven by budget and timing
// from: key of OFFER_CUSTOM_FROM for Premium projects that have a starting price (null = fully on quote)
export function recommendOffer(answers) {
  const has = (step, v) => [].concat(answers[step] ?? []).includes(v)
  const goal = answers.u_goal
  const start = answers.start
  const kind =
    start === 'unsure'
      ? { contact: 'vitrine', buy: 'shop', book: 'booking', login: 'app' }[goal]
      : start === 'redo'
        ? { site: 'vitrine', shop: 'shop', booking: 'booking', app: 'app' }[answers.r_kind] ?? 'vitrine'
        : start

  let pack = 'vitrine'
  let from = null
  let reason = ''

  if (kind === 'shop') {
    pack = 'premium'
    from = 'shop'
    reason = 'Une boutique en ligne demande un paiement sécurisé, un catalogue et un suivi des commandes : on la construit sur mesure.'
  } else if (kind === 'app') {
    pack = 'premium'
    from = 'app'
    reason = 'Une application sur mesure se chiffre selon ses fonctionnalités : on en définit le périmètre ensemble.'
  } else if (kind === 'booking') {
    const advanced = !has('b_pay', 'none') || has('b_extras', 'accounts') || has('b_extras', 'staff')
    pack = advanced ? 'premium' : 'business'
    if (advanced) from = 'booking'
    reason = advanced
      ? 'Le paiement en ligne, les espaces clients ou plusieurs agendas demandent une réservation sur mesure.'
      : 'Le pack Business intègre la prise de rendez-vous en ligne dans un site complet.'
  } else if (kind === 'landing') {
    if (answers.l_goal === 'sell') {
      pack = 'business'
      reason = 'Une page de vente avec paiement en ligne part du pack Business ; le devis s’ajuste selon le mode de paiement.'
    } else {
      pack = 'vitrine'
      reason = 'Une page unique, pensée pour convertir : c’est le format du pack Vitrine.'
    }
  } else {
    // showcase site or redesign
    const size = answers.v_size
    if (size === 'many') {
      pack = 'business'
      reason = 'Au-delà de 5 pages, on part du pack Business et le devis s’ajuste au nombre de pages et à vos contenus.'
    } else if (size === 'few' || ['blog', 'booking', 'english'].some(v => has('v_extras', v))) {
      pack = 'business'
      reason = size === 'few'
        ? 'Plusieurs pages pour détailler vos prestations : c’est le pack Business.'
        : 'Blog, prise de rendez-vous ou version anglaise : le pack Business les inclut ou les accueille facilement.'
    } else {
      pack = 'vitrine'
      reason = 'Une page claire suffit pour être trouvé·e sur Google et contacté·e : le pack Vitrine.'
    }
  }
  if (start === 'redo') reason = 'Pour refaire votre site : ' + reason.charAt(0).toLowerCase() + reason.slice(1)

  const price = OFFER_PRICES[pack] ?? OFFER_CUSTOM_FROM[from] ?? null

  const notes = []
  const budgetMax = { lt1k: 1000, '1k3k': 3000, '3k8k': 8000 }[answers.budget]
  if (price && budgetMax && budgetMax < price) {
    notes.push('Votre budget est en dessous du prix de départ de cette formule. Parlons-en : on peut commencer par une première version plus simple, puis la faire évoluer.')
  }
  if (answers.timing === 'asap') {
    notes.push({
      vitrine: 'Moins d’un mois, c’est tenable : le pack Vitrine se livre en 2 semaines environ.',
      business: 'Comptez 3 à 4 semaines : pour tenir moins d’un mois, il faut démarrer vite et avoir vos contenus prêts.',
      premium: 'Moins d’un mois, c’est court pour un projet sur mesure : on peut livrer une première version, puis compléter.',
    }[pack])
  }

  const maintenance = { self: 'essentiel', managed: 'suivi' }[answers.after] ?? null
  return { pack, from, price, reason, notes, maintenance }
}
