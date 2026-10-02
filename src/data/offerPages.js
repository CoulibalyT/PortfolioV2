// Landing pages by trade, served at /offre/<slug> (FR-only).
// Single source of truth for src/components/OfferNichePage.vue (runtime) AND
// scripts/inject-meta.mjs (build-time static HTML, meta and JSON-LD), so keep it plain JS.
// To add a page: add an entry here, nothing else. Every page needs its own, specific copy:
// near-duplicate pages hurt SEO more than they help.

import { OFFER_PRICES, OFFER_INSTALLMENTS, OFFER_MAINTENANCE } from './offer.js'

const P = OFFER_PRICES
const I = OFFER_INSTALLMENTS
const PACK_LABEL = { vitrine: 'Pack Vitrine', business: 'Pack Business' }

// pack: 'vitrine' | 'business' → recommended starting pack shown on the page
export const OFFER_PAGES = [
  {
    slug: 'site-web-coiffeur',
    label: 'Coiffeurs et instituts de beauté',
    eyebrow: 'Site web · Coiffure et beauté',
    h1: 'Site web pour salon de coiffure et institut de beauté',
    title: 'Site web pour coiffeur et institut de beauté à Paris — Tene Coulibaly',
    description: `Création de site web pour salon de coiffure, barbier et institut de beauté : prise de rendez-vous en ligne, tarifs, photos, fiche Google. Dès ${P.vitrine} €.`,
    intro: 'Vos clientes et clients choisissent un salon sur leur téléphone, souvent le soir, quand vous êtes fermé. Votre site doit montrer votre travail, afficher vos tarifs et prendre le rendez-vous à votre place.',
    needs: [
      { t: 'Des rendez-vous pris sans téléphone', d: 'La prise de rendez-vous en ligne fonctionne jour et nuit. Vous ne décrochez plus en pleine coupe, et vous ne perdez plus les demandes arrivées après la fermeture.' },
      { t: 'Vos prestations et vos tarifs, clairs', d: 'Coupe, couleur, soin, barbe, épilation : chaque prestation avec sa durée et son prix. C’est la première chose que l’on cherche avant de réserver.' },
      { t: 'Votre travail en photos', d: 'Une galerie de vos réalisations, facile à mettre à jour, qui donne envie avant même la première visite.' },
    ],
    includes: [
      'Prise de rendez-vous en ligne (votre outil actuel, comme Planity ou Calendly, ou un nouveau)',
      'Carte des prestations avec durées et tarifs',
      'Galerie photos de vos réalisations',
      'Horaires, adresse, plan d’accès et bouton d’appel',
      'Fiche Google Business reliée au site, pour apparaître sur Google Maps',
    ],
    pack: 'business',
    packWhy: 'La prise de rendez-vous en ligne et plusieurs pages (prestations, galerie, équipe) correspondent au pack Business. Pour une page unique avec vos tarifs et un bouton d’appel, le pack Vitrine suffit.',
    faq: [
      { q: 'Combien coûte un site web pour un salon de coiffure ?', a: `Un site d’une page avec vos tarifs, vos horaires et un bouton d’appel démarre à ${P.vitrine} €. Un site complet avec prise de rendez-vous en ligne, galerie et plusieurs pages démarre à ${P.business} €, payable en ${I.count} fois sans frais.` },
      { q: 'J’utilise déjà Planity ou un autre outil de réservation, ai-je besoin d’un site ?', a: 'Oui : l’outil de réservation gère l’agenda, mais c’est votre site qui vous fait apparaître sur Google sous votre propre nom et qui présente votre salon. Je relie le site à votre outil, vous ne changez rien à vos habitudes.' },
      { q: 'Pourrai-je changer mes tarifs et mes photos moi-même ?', a: `Oui, je vous mets en place une interface simple et je vous forme à la livraison. Vous pouvez aussi me confier les mises à jour avec la maintenance Suivi à ${OFFER_MAINTENANCE.suivi} € par mois.` },
    ],
  },
  {
    slug: 'site-web-restaurant',
    label: 'Restaurants, cafés et traiteurs',
    eyebrow: 'Site web · Restauration',
    h1: 'Site web pour restaurant, café et traiteur',
    title: 'Site web pour restaurant et café à Paris — Tene Coulibaly',
    description: `Création de site web pour restaurant, café et traiteur : carte lisible sur mobile, réservation en ligne, horaires, fiche Google. Dès ${P.vitrine} €.`,
    intro: 'Avant de venir, on regarde la carte, les prix, les horaires et quelques photos. Si ces informations ne sont que sur une plateforme de livraison ou un PDF illisible sur téléphone, une partie des clients va ailleurs.',
    needs: [
      { t: 'Une carte lisible sur téléphone', d: 'Votre carte en vraie page web, pas en PDF à zoomer : plats, prix, allergènes, et une mise à jour en quelques minutes quand le menu change.' },
      { t: 'Des réservations en direct', d: 'Un module de réservation ou un simple bouton d’appel, pour remplir la salle sans commission versée à une plateforme.' },
      { t: 'Les bonnes informations sur Google', d: 'Horaires, adresse, jours de fermeture et photos identiques sur votre site et sur votre fiche Google, pour que personne ne se déplace pour rien.' },
    ],
    includes: [
      'Carte et menus en page web, modifiables par vous',
      'Réservation en ligne ou bouton d’appel direct',
      'Photos de la salle et des plats',
      'Horaires, accès, privatisation et événements',
      'Fiche Google Business reliée au site',
    ],
    pack: 'business',
    packWhy: 'Carte, réservation et pages événements ou privatisation correspondent au pack Business. Pour un café ou un comptoir, une page unique avec carte, horaires et accès tient dans le pack Vitrine.',
    faq: [
      { q: 'Combien coûte un site web pour un restaurant ?', a: `Une page unique avec carte, horaires et accès démarre à ${P.vitrine} €. Un site complet avec réservation en ligne et plusieurs pages démarre à ${P.business} €, payable en ${I.count} fois sans frais.` },
      { q: 'Je suis déjà sur les plateformes de livraison et de réservation, pourquoi un site ?', a: 'Parce que ces plateformes prennent une commission et gardent la relation avec vos clients. Votre site vous amène des réservations et des appels en direct, et il vous appartient.' },
      { q: 'Comment mettre ma carte à jour quand elle change ?', a: 'Vous la modifiez vous-même depuis une interface simple, sans toucher au code. Je vous montre comment faire à la livraison.' },
    ],
  },
  {
    slug: 'site-web-garage',
    label: 'Garages et carrosseries',
    eyebrow: 'Site web · Automobile',
    h1: 'Site web pour garage et carrosserie',
    title: 'Site web pour garage et carrosserie en Île-de-France — Tene Coulibaly',
    description: `Création de site web pour garage, carrosserie et centre auto : demande de devis en ligne, prise de rendez-vous, SEO local. Dès ${P.vitrine} €.`,
    intro: 'Quand une voiture tombe en panne ou sort d’un accrochage, on cherche un garage proche et on appelle le premier qui inspire confiance. Votre site doit rassurer, puis transformer la visite en demande de devis ou en rendez-vous.',
    needs: [
      { t: 'Des demandes de devis en ligne', d: 'Un formulaire guidé où le client décrit son véhicule et son besoin. Vous recevez une demande complète au lieu d’un appel pendant que vous êtes sous une voiture.' },
      { t: 'Être trouvé dans votre ville', d: 'Des pages rédigées pour les recherches locales, comme « carrosserie Ivry-sur-Seine » ou « garage Montreuil », et une fiche Google à jour.' },
      { t: 'Inspirer confiance', d: 'Vos prestations expliquées simplement, vos agréments assurance, des photos de l’atelier et de réparations avant et après.' },
    ],
    includes: [
      'Formulaire de devis guidé, avec photos du véhicule',
      'Prise de rendez-vous en ligne',
      'Pages par prestation : carrosserie, mécanique, entretien, pare-brise',
      'Photos avant et après, agréments et garanties',
      'Référencement local et fiche Google Business',
    ],
    pack: 'business',
    packWhy: 'Plusieurs pages de prestations, le devis en ligne et la prise de rendez-vous correspondent au pack Business. Un devis automatique avec identification du véhicule par plaque relève du sur-mesure.',
    caseStudy: true,
    faq: [
      { q: 'Combien coûte un site web pour un garage ?', a: `Une page unique avec vos prestations et un bouton d’appel démarre à ${P.vitrine} €. Un site complet avec devis en ligne, rendez-vous et pages par prestation démarre à ${P.business} €, payable en ${I.count} fois sans frais.` },
      { q: 'Avez-vous déjà réalisé un site pour un garage ?', a: 'Oui : Autoomat, une carrosserie à Ivry-sur-Seine. Le site propose un parcours sinistre guidé, la prise de rendez-vous en ligne et un devis avec identification du véhicule par sa plaque d’immatriculation.' },
      { q: 'Le site peut-il m’amener des clients de ma ville ?', a: 'C’est son rôle principal. Je rédige les pages pour les recherches locales et je relie le site à votre fiche Google Business. Les premiers résultats arrivent en général en quelques semaines à quelques mois, selon la concurrence.' },
    ],
  },
  {
    slug: 'site-web-artisan',
    label: 'Artisans du bâtiment',
    eyebrow: 'Site web · Artisans',
    h1: 'Site web pour artisan du bâtiment',
    title: 'Site web pour artisan (plombier, électricien, peintre) — Tene Coulibaly',
    description: `Création de site web pour artisan du bâtiment : demandes de devis, photos de chantiers, zone d’intervention, SEO local. Dès ${P.vitrine} €.`,
    intro: 'Plombier, électricien, peintre, menuisier, maçon : vos clients comparent deux ou trois artisans avant d’appeler. Celui qui montre ses chantiers et répond vite à une demande de devis prend l’avantage.',
    needs: [
      { t: 'Recevoir des demandes de devis', d: 'Un formulaire court, avec photos, qui arrive directement dans votre boîte mail ou sur votre téléphone. Vous répondez quand vous quittez le chantier.' },
      { t: 'Montrer vos chantiers', d: 'Vos réalisations en photos, avant et après, classées par type de travaux. C’est ce qui convainc le plus.' },
      { t: 'Dire où vous intervenez', d: 'Votre zone d’intervention et vos spécialités affichées clairement, pour recevoir des demandes proches de chez vous et dans votre métier.' },
    ],
    includes: [
      'Formulaire de demande de devis avec envoi de photos',
      'Galerie de chantiers, avant et après',
      'Vos prestations, votre zone d’intervention, vos assurances et labels',
      'Bouton d’appel et WhatsApp en un clic',
      'Référencement local et fiche Google Business',
    ],
    pack: 'vitrine',
    packWhy: 'Une page claire avec vos prestations, vos chantiers et un formulaire de devis tient dans le pack Vitrine. Si vous voulez une page par métier ou par ville, on passe au pack Business.',
    faq: [
      { q: 'Combien coûte un site web pour un artisan ?', a: `Un site d’une page avec prestations, photos de chantiers et formulaire de devis démarre à ${P.vitrine} €, payable en ${I.count} fois sans frais. Un site de plusieurs pages démarre à ${P.business} €.` },
      { q: 'Je passe déjà par des plateformes de mise en relation, à quoi sert un site ?', a: 'Ces plateformes vendent le même contact à plusieurs artisans. Avec votre site, la demande arrive chez vous seul, sans commission, et le client vous a déjà choisi.' },
      { q: 'Je n’ai pas le temps de m’en occuper, est-ce un problème ?', a: `Non. Vous m’envoyez vos photos et quelques informations, je m’occupe du reste. Après la mise en ligne, la maintenance démarre à ${OFFER_MAINTENANCE.essentiel} € par mois, sans engagement.` },
    ],
  },
  {
    slug: 'site-web-auteur-artiste',
    label: 'Auteurs, artistes et créateurs',
    eyebrow: 'Site web · Création',
    h1: 'Site web pour auteur, artiste et créateur',
    title: 'Site web pour auteur, artiste et créateur — Tene Coulibaly',
    description: `Création de site web pour auteur, autrice, artiste, illustrateur ou créateur : présenter vos œuvres, annoncer vos dates, vendre en direct. Dès ${P.vitrine} €.`,
    intro: 'Les réseaux sociaux font connaître votre travail, mais ils ne vous appartiennent pas et ne le présentent jamais comme vous le voudriez. Un site à votre nom rassemble vos livres, vos œuvres et vos actualités au même endroit, durablement.',
    needs: [
      { t: 'Un lieu à votre nom', d: 'Quand un lecteur, un éditeur, un galeriste ou un journaliste tape votre nom, il tombe sur votre site, avec votre biographie et de quoi vous contacter.' },
      { t: 'Présenter vos œuvres comme il faut', d: 'Livres, séries, projets ou collections : chacun avec son texte, ses images et le lien pour l’acheter ou le commander.' },
      { t: 'Garder le lien avec votre public', d: 'Agenda des dédicaces, expositions et rencontres, et une lettre d’information pour prévenir vos lecteurs sans dépendre d’un algorithme.' },
    ],
    includes: [
      'Page de présentation et biographie',
      'Catalogue de vos livres ou portfolio de vos œuvres',
      'Agenda : dédicaces, expositions, ateliers',
      'Inscription à votre lettre d’information',
      'Liens d’achat, ou vente en direct selon le projet',
    ],
    pack: 'vitrine',
    packWhy: 'Une page à votre nom avec vos œuvres et un contact tient dans le pack Vitrine. Un catalogue de plusieurs pages, un blog ou un agenda correspondent au pack Business. La vente en direct avec paiement relève du sur-mesure.',
    faq: [
      { q: 'Combien coûte un site d’auteur ou d’artiste ?', a: `Un site d’une page à votre nom démarre à ${P.vitrine} €. Un site complet avec catalogue, agenda et blog démarre à ${P.business} €, payable en ${I.count} fois sans frais. Une boutique pour vendre en direct est chiffrée sur devis.` },
      { q: 'J’ai déjà Instagram, pourquoi un site ?', a: 'Instagram montre vos dernières publications à une partie de vos abonnés. Un site présente l’ensemble de votre travail, apparaît sur Google quand on cherche votre nom et reste en ligne quoi que décide la plateforme.' },
      { q: 'Pourrai-je ajouter moi-même un livre, une œuvre ou une date ?', a: 'Oui. Je mets en place une interface simple pour ajouter vos nouveautés, et je vous forme à la livraison.' },
    ],
  },
  {
    slug: 'site-web-association',
    label: 'Associations',
    eyebrow: 'Site web · Associations',
    h1: 'Site web pour association',
    title: 'Site web pour association en Île-de-France — Tene Coulibaly',
    description: `Création de site web pour association : présenter vos actions, recruter des bénévoles, recevoir adhésions et dons, annoncer vos événements. Dès ${P.vitrine} €.`,
    intro: 'Une association a besoin d’expliquer ce qu’elle fait, de trouver des adhérents, des bénévoles et des financeurs, et de tenir tout le monde informé. Un site clair fait ce travail en continu, y compris auprès des partenaires qui instruisent vos demandes de subvention.',
    needs: [
      { t: 'Expliquer votre action', d: 'Votre mission, vos projets, votre équipe et vos résultats, présentés simplement. C’est ce que regardent un futur bénévole comme un financeur.' },
      { t: 'Faciliter adhésions et dons', d: 'Des boutons d’adhésion et de don reliés à votre outil de collecte, comme HelloAsso, pour que l’envie d’aider ne se perde pas en route.' },
      { t: 'Annoncer vos événements', d: 'Un agenda et des actualités que les membres du bureau mettent à jour eux-mêmes, sans dépendre d’une seule personne.' },
    ],
    includes: [
      'Présentation de l’association, de ses actions et de son équipe',
      'Adhésion et don en ligne, reliés à votre outil de collecte',
      'Agenda des événements et actualités',
      'Page pour devenir bénévole, avec formulaire',
      'Espace partenaires et documents (rapports, statuts)',
    ],
    pack: 'business',
    packWhy: 'Plusieurs pages, des actualités et un agenda correspondent au pack Business. Une petite association qui veut seulement une page de présentation et un contact peut démarrer avec le pack Vitrine.',
    faq: [
      { q: 'Combien coûte un site web pour une association ?', a: `Une page de présentation avec contact démarre à ${P.vitrine} €. Un site complet avec actualités, agenda, adhésion et don en ligne démarre à ${P.business} €. Le paiement en ${I.count} fois sans frais est possible.` },
      { q: 'Plusieurs bénévoles pourront-ils mettre le site à jour ?', a: 'Oui. Je mets en place une interface simple avec plusieurs accès, et je forme les personnes concernées à la livraison.' },
      { q: 'Peut-on recevoir des dons et des adhésions depuis le site ?', a: 'Oui. Le site renvoie vers votre outil de collecte ou l’intègre directement dans la page, ce qui évite de gérer les paiements vous-même.' },
    ],
  },
]

export const OFFER_PAGE_PATH = (slug) => `/offre/${slug}`
export const findOfferPage = (slug) => OFFER_PAGES.find(p => p.slug === slug) ?? null
export const offerPagePack = (page) => ({
  name: PACK_LABEL[page.pack],
  price: OFFER_PRICES[page.pack],
  installment: OFFER_INSTALLMENTS[page.pack],
})
