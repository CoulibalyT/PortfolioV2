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
    a: 'Non. Je suis basée à Paris et je travaille avec des clients à Paris, en Seine-Saint-Denis, dans toute l’Île-de-France et à distance partout en France.',
  },
]

// Full /offre FAQ, in display order. Single source for the page AND the FAQPage JSON-LD,
// so the structured data always repeats the exact questions/answers shown to visitors.
export const OFFER_FAQ = [
  ...OFFER_FAQ_TOP,
  {
    q: "Combien de temps ça prend de A à Z ?",
    a: "Entre 2 semaines (Pack Vitrine) et 4 semaines (Pack Business). Le Pack Premium dépend du périmètre, on en discute lors du premier appel.",
  },
  {
    q: "Je n'y connais rien en informatique, c'est un problème ?",
    a: "Pas du tout. Mon rôle est justement de m'occuper de toute la partie technique. On parle ensemble de votre activité, de vos clients, de ce que vous voulez transmettre — je traduis ça en site web. Vous n'avez aucune ligne de code à voir.",
  },
  {
    q: "Est-ce que je pourrai modifier mon site moi-même ?",
    a: "Oui. Selon le pack, je vous mets en place une interface simple (style Notion ou Strapi) pour modifier vos textes, ajouter des photos ou un article de blog. Je vous forme à la livraison.",
  },
  {
    q: "Pourquoi pas juste une page Facebook ou Instagram ?",
    a: "Parce que vous n'êtes pas propriétaire de votre audience. Demain, Meta change l'algorithme ou ferme votre page — vous perdez tout. Un site web vous appartient, apparaît sur Google quand on cherche votre métier, et donne confiance (90% des gens vérifient sur Google avant de pousser la porte d'un commerce inconnu).",
  },
  {
    q: "C'est quoi le SEO dont tu parles ?",
    a: "C'est tout ce qui fait que votre site apparaît dans les résultats Google quand un client tape « coiffeur Paris 11 » ou « garage Paris 12 ». Je configure ça à la livraison : titres, descriptions, fiche Google Business, balisage local. L'objectif : être trouvé par les bonnes personnes près de chez vous.",
  },
  {
    q: "Et si je veux des modifications après la livraison ?",
    a: `Les Packs Vitrine et Business incluent 15 jours de retouches gratuites après mise en ligne. Au-delà, je propose des forfaits maintenance (à partir de ${OFFER_MAINTENANCE.essentiel} €/mois) ou des interventions à la demande (${OFFER_HOURLY_RATE} €/h). Pas d'abonnement obligatoire.`,
  },
]
