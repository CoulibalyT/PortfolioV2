// Single source of truth for the /offre landing page (freelance positioning).
// Imported by src/components/OfferComponent.vue (runtime) AND scripts/inject-meta.mjs
// (build-time meta + JSON-LD), so keep it plain JS: no Vite/browser-only APIs.

export const OFFER_EMAIL = 'contact@tenecoulibaly.fr'

// Phone — edit here only. Used for tel:, WhatsApp and the JSON-LD "telephone".
export const OFFER_PHONE = {
  e164: '+33658286380',
  display: '06 58 28 63 80',
}
export const OFFER_PHONE_HREF = `tel:${OFFER_PHONE.e164}`

const WHATSAPP_MESSAGE = 'Bonjour, je suis intéressé(e) par un site web pour mon activité'
export const OFFER_WHATSAPP_URL =
  `https://wa.me/${OFFER_PHONE.e164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

// Pack prices (€ HT, "à partir de") and the 3-installment amount shown under each price.
export const OFFER_PRICES = {
  vitrine: 800,
  business: 1500,
}
export const OFFER_INSTALLMENTS = {
  count: 3,
  vitrine: 270,
  business: 500,
}

// "À partir de" prices for custom (Premium) projects, shown by the guided finder.
export const OFFER_CUSTOM_FROM = {
  shop: 2500,
  booking: 2500, // booking with online payment, client accounts or several calendars
  app: 5000,
}

// Monthly maintenance & hosting plans (€ / month, no commitment).
export const OFFER_MAINTENANCE = {
  essentiel: 29,
  suivi: 59,
}

// Hourly rate for out-of-plan changes.
export const OFFER_HOURLY_RATE = 60

export const AUTOOMAT_URL = 'https://www.autoomat.fr'

// SEO — shared by the client-side useHead() and the static HTML written at build time.
export const OFFER_SEO = {
  siteName: 'Tene Coulibaly — Création de sites web',
  title: 'Création de sites web pour indépendants, commerces et artisans à Paris — Tene Coulibaly',
  socialTitle: 'Création de sites web pour indépendants, commerces et artisans — Tene Coulibaly',
  description:
    `Développeuse web freelance à Paris et Seine-Saint-Denis. Création de site internet pour indépendants, commerces, artisans et associations : site vitrine dès ${OFFER_PRICES.vitrine} €, RDV en ligne, SEO local.`,
  keywords: [
    'création site web artisan Paris',
    'site internet commerce Île-de-France',
    'site internet garage Seine-Saint-Denis',
    'création site vitrine Montreuil',
    'site web coiffeur Paris',
    'site web restaurant Paris',
    'site web indépendant Paris',
    'site internet association Seine-Saint-Denis',
    'site web auteur artiste',
    'développeuse web freelance Les Lilas',
    'développeuse web indépendante Paris',
    'prise de rendez-vous en ligne',
    'SEO local',
  ].join(', '),
}

// Answer-first FAQ entries shown at the top of the /offre FAQ. Shared by the page
// (OfferComponent.vue) and the build-time static HTML + FAQPage JSON-LD (inject-meta.mjs),
// so search engines and AI assistants read the same short, factual answers.
export const OFFER_FAQ_TOP = [
  {
    q: 'Combien coûte la création d’un site web ?',
    a: `Un site vitrine démarre à ${OFFER_PRICES.vitrine} € (ou ${OFFER_INSTALLMENTS.count} × ${OFFER_INSTALLMENTS.vitrine} € sans frais). Un site de plusieurs pages avec blog et prise de rendez-vous démarre à ${OFFER_PRICES.business} € (ou ${OFFER_INSTALLMENTS.count} × ${OFFER_INSTALLMENTS.business} €). Une boutique en ligne ou une réservation avec paiement démarre à ${OFFER_CUSTOM_FROM.shop} €, une application sur mesure à ${OFFER_CUSTOM_FROM.app} €. La maintenance et l’hébergement sont à partir de ${OFFER_MAINTENANCE.essentiel} € par mois, sans engagement.`,
  },
  {
    q: 'Pour qui créez-vous des sites web ?',
    a: 'Pour toute activité qui veut être trouvée et contactée en ligne : commerces, artisans, indépendants et professions libérales, associations, auteurs, artistes et créateurs. Le projet peut être un site vitrine, une boutique en ligne, un système de réservation ou une application sur mesure.',
  },
  {
    q: 'Travaillez-vous uniquement à Paris ?',
    a: 'Non. Je suis basée à Paris et en Seine-Saint-Denis et je travaille avec des clients de toute l’Île-de-France. Tout le projet peut aussi se faire à distance (appel, visio, validation en ligne), donc je travaille avec des clients partout en France.',
  },
]
