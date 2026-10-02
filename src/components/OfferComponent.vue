<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import {
  OFFER_EMAIL as EMAIL,
  OFFER_PHONE as PHONE,
  OFFER_PHONE_HREF as PHONE_HREF,
  OFFER_WHATSAPP_URL as WHATSAPP_URL,
  OFFER_PRICES as PRICES,
  OFFER_INSTALLMENTS as INSTALLMENTS,
  OFFER_MAINTENANCE as MAINTENANCE,
  OFFER_HOURLY_RATE as HOURLY_RATE,
  OFFER_SEO as SEO,
  OFFER_FAQ_TOP as FAQ_TOP,
  AUTOOMAT_URL,
} from '@/data/offer.js'
import OfferFinder from '@/components/OfferFinder.vue'
import { OFFER_PAGES, OFFER_PAGE_PATH } from '@/data/offerPages.js'
import '@/assets/offer-page.css'

// Pricing, phone and SEO copy live in src/data/offer.js (shared with scripts/inject-meta.mjs).
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr'

// --- FAQ state ---
const openFaqIndex = ref(null)
const toggleFaq = (i) => {
  openFaqIndex.value = openFaqIndex.value === i ? null : i
}
const faqs = [
  ...FAQ_TOP,
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
    a: `Les Packs Vitrine et Business incluent 15 jours de retouches gratuites après mise en ligne. Au-delà, je propose des forfaits maintenance (à partir de ${MAINTENANCE.essentiel} €/mois) ou des interventions à la demande (${HOURLY_RATE} €/h). Pas d'abonnement obligatoire.`,
  },
]

const mailtoUrl = computed(() => {
  const subject = encodeURIComponent('Projet de site web — demande de devis')
  const body = encodeURIComponent(
    "Bonjour Tene,\n\n" +
    "Je m'intéresse à votre offre. Voici quelques infos sur mon projet :\n\n" +
    "- Activité : \n" +
    "- Localisation : \n" +
    "- J'ai déjà un site : oui / non\n" +
    "- Budget approximatif : \n" +
    "- Délai souhaité : \n\n" +
    "Cordialement,\n"
  )
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
})

onMounted(() => {
  if (typeof window === 'undefined') return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el))
})

useHead({
  title: SEO.title,
  htmlAttrs: { lang: 'fr' },
  meta: [
    { name: 'description', content: SEO.description },
    { name: 'keywords', content: SEO.keywords },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: SEO.siteName },
    { property: 'og:title', content: SEO.socialTitle },
    { property: 'og:description', content: SEO.description },
    { property: 'og:url', content: `${SITE_URL}/offre` },
    { property: 'og:image', content: `${SITE_URL}/images/og-image.webp` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: SEO.socialTitle },
    { name: 'twitter:description', content: SEO.description },
    { name: 'twitter:image', content: `${SITE_URL}/images/og-image.webp` },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/offre` }],
})
</script>

<template>
  <div class="offer-page bg-white text-black dark:bg-black dark:text-gray-100">
    <a href="#contact" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 dark:focus:bg-white dark:focus:text-black">
      Aller au contact
    </a>

    <!-- ============================== HEADER ============================== -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
        <router-link to="/" class="text-sm md:text-base hover:opacity-60 transition-opacity">
          <span class="opacity-50">←</span> Tene Coulibaly
        </router-link>
        <div class="flex items-center gap-6 md:gap-10 text-sm">
          <router-link to="/projects" class="hidden sm:inline opacity-60 hover:opacity-100 transition-opacity">
            Projets
          </router-link>
          <a :href="mailtoUrl" class="underline underline-offset-4 hover:no-underline">
            Me contacter
          </a>
        </div>
      </div>
    </header>

    <!-- ============================== HERO ============================== -->
    <section class="min-h-[85vh] flex items-center px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <div class="max-w-7xl mx-auto w-full fade-in-up">
        <p class="text-xs md:text-sm uppercase tracking-[0.25em] opacity-50 mb-10 md:mb-16">
          Création de sites web · Paris
        </p>
        <h1 class="font-thin tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem]">
          Votre activité<br>
          mérite d'exister<br>
          en ligne.
        </h1>
        <p class="mt-12 md:mt-20 max-w-2xl text-lg md:text-2xl font-thin leading-relaxed opacity-70">
          Je crée des sites modernes, rapides et optimisés pour les indépendants, commerces, artisans, associations et créateurs.
          De la maquette à la mise en ligne, je m'occupe de tout.
        </p>
        <div class="mt-12 md:mt-16 flex flex-col sm:flex-row gap-6 md:gap-10 text-base md:text-lg">
          <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-[6px] decoration-1 hover:no-underline transition w-fit">
            Premier appel gratuit (15 min) <span aria-hidden="true">→</span>
          </a>
          <a href="#trouver" class="inline-flex items-center gap-3 opacity-50 hover:opacity-100 transition w-fit">
            Trouver ma formule <span aria-hidden="true">↓</span>
          </a>
          <a href="#packs" class="inline-flex items-center gap-3 opacity-50 hover:opacity-100 transition w-fit">
            Voir les tarifs <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p class="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-8 gap-y-4 text-base md:text-lg">
          <span class="opacity-50">Plus simple de vive voix&nbsp;?</span>
          <a :href="PHONE_HREF" class="inline-flex items-center gap-3 underline underline-offset-[6px] decoration-1 hover:no-underline transition w-fit">
            <span class="sr-only">Appeler le</span> {{ PHONE.display }}
          </a>
          <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="inline-flex items-center gap-3 underline underline-offset-[6px] decoration-1 hover:no-underline transition w-fit">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </section>

    <!-- ============================== GUIDED FINDER ============================== -->
    <OfferFinder />

    <!-- ============================== PROBLEM ============================== -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Le constat</p>
          <h2 class="md:col-span-9 text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
            Vos clients vous cherchent.<br>
            <span class="opacity-50">Est-ce qu'ils vous trouvent ?</span>
          </h2>
        </div>

        <ol class="divide-y divide-gray-100 dark:divide-gray-900">
          <li class="fade-in-up grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-12">
            <span class="md:col-span-2 text-xs md:text-sm uppercase tracking-[0.25em] opacity-30 font-mono pt-1">01</span>
            <h3 class="md:col-span-4 text-2xl md:text-3xl font-thin">Invisibles sur Google</h3>
            <p class="md:col-span-6 text-base md:text-lg opacity-60 leading-relaxed">
              Vos futurs clients tapent &laquo;&nbsp;coiffeur près de chez moi&nbsp;&raquo; ou &laquo;&nbsp;garage Paris 12&nbsp;&raquo; — et atterrissent chez vos concurrents.
            </p>
          </li>
          <li class="fade-in-up grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-12">
            <span class="md:col-span-2 text-xs md:text-sm uppercase tracking-[0.25em] opacity-30 font-mono pt-1">02</span>
            <h3 class="md:col-span-4 text-2xl md:text-3xl font-thin">Un site qui date</h3>
            <p class="md:col-span-6 text-base md:text-lg opacity-60 leading-relaxed">
              Votre site existant ne s'affiche pas sur mobile, charge en 8 secondes, et donne une image vieillotte de votre activité.
            </p>
          </li>
          <li class="fade-in-up grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-12">
            <span class="md:col-span-2 text-xs md:text-sm uppercase tracking-[0.25em] opacity-30 font-mono pt-1">03</span>
            <h3 class="md:col-span-4 text-2xl md:text-3xl font-thin">Otage des réseaux</h3>
            <p class="md:col-span-6 text-base md:text-lg opacity-60 leading-relaxed">
              Vous postez sur Instagram ou Facebook mais l'algorithme décide qui vous voit. Demain, il change — vous perdez votre audience.
            </p>
          </li>
          <li class="fade-in-up grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-12">
            <span class="md:col-span-2 text-xs md:text-sm uppercase tracking-[0.25em] opacity-30 font-mono pt-1">04</span>
            <h3 class="md:col-span-4 text-2xl md:text-3xl font-thin">Pas le temps pour ça</h3>
            <p class="md:col-span-6 text-base md:text-lg opacity-60 leading-relaxed">
              Vous avez une activité à faire tourner. WordPress, hébergement, HTML — c'est pas votre métier.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ============================== PACKS ============================== -->
    <section id="packs" class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Tarifs</p>
          <div class="md:col-span-9">
            <h2 class="text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
              Trois packs, <span class="opacity-50">aucune surprise.</span>
            </h2>
            <p class="mt-6 max-w-xl text-sm md:text-base opacity-60 leading-relaxed">
              Auto-entrepreneuse, TVA non applicable (art. 293 B du CGI). Hébergement inclus la première année, puis maintenance optionnelle dès {{ MAINTENANCE.essentiel }}&nbsp;€/mois.
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 fade-in-up">
          <article class="border-t border-gray-200 dark:border-gray-800 md:border-r pt-10 md:pt-16 pb-10 md:pr-10 lg:pr-14">
            <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-4">Pack 01</p>
            <h3 class="text-3xl md:text-4xl font-thin mb-8">Vitrine</h3>
            <p class="text-5xl md:text-6xl font-thin mb-2">{{ PRICES.vitrine }}€</p>
            <p class="text-xs opacity-50 mb-2">à partir de</p>
            <p class="text-sm opacity-80 mb-10">ou {{ INSTALLMENTS.count }}&nbsp;×&nbsp;{{ INSTALLMENTS.vitrine }}&nbsp;€ sans frais</p>
            <ul class="space-y-3 text-sm md:text-base opacity-80 mb-12">
              <li>— Site one-page moderne et responsive</li>
              <li>— Design sur mesure (pas de template)</li>
              <li>— Optimisé Google (SEO de base)</li>
              <li>— Formulaire de contact</li>
              <li>— Mise en ligne incluse</li>
              <li class="opacity-60">— Livraison en 2 semaines</li>
            </ul>
            <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-4 hover:no-underline">
              Demander un devis <span aria-hidden="true">→</span>
            </a>
          </article>

          <article class="border-t border-gray-900 dark:border-gray-100 md:border-r pt-10 md:pt-16 pb-10 md:px-10 lg:px-14 relative">
            <p class="text-xs uppercase tracking-[0.25em] mb-4">★ Recommandé</p>
            <h3 class="text-3xl md:text-4xl font-thin mb-8">Business</h3>
            <p class="text-5xl md:text-6xl font-thin mb-2">{{ PRICES.business }}€</p>
            <p class="text-xs opacity-50 mb-2">à partir de</p>
            <p class="text-sm opacity-80 mb-10">ou {{ INSTALLMENTS.count }}&nbsp;×&nbsp;{{ INSTALLMENTS.business }}&nbsp;€ sans frais</p>
            <ul class="space-y-3 text-sm md:text-base opacity-80 mb-12">
              <li>— Site multi-pages (jusqu'à 5 pages)</li>
              <li>— Tout le Pack Vitrine, en plus complet</li>
              <li>— Blog intégré</li>
              <li>— Fiche Google Business optimisée</li>
              <li>— Intégration réservation (Calendly, etc.)</li>
              <li class="opacity-60">— Livraison en 3 à 4 semaines</li>
            </ul>
            <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-4 hover:no-underline">
              Choisir ce pack <span aria-hidden="true">→</span>
            </a>
          </article>

          <article class="border-t border-gray-200 dark:border-gray-800 pt-10 md:pt-16 pb-10 md:pl-10 lg:pl-14">
            <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-4">Pack 03</p>
            <h3 class="text-3xl md:text-4xl font-thin mb-8">Premium</h3>
            <p class="text-5xl md:text-6xl font-thin mb-2">Sur devis</p>
            <p class="text-xs opacity-50 mb-2">selon périmètre</p>
            <!-- Empty line mirroring the installment line of the two other packs, so the feature lists stay aligned -->
            <p class="text-sm mb-10" aria-hidden="true">&nbsp;</p>
            <ul class="space-y-3 text-sm md:text-base opacity-80 mb-12">
              <li>— Application web sur mesure</li>
              <li>— Tout le Pack Business, plus loin</li>
              <li>— Espace client, paiement, API…</li>
              <li>— Accompagnement SEO 3 mois</li>
              <li>— Maintenance incluse 6 mois</li>
              <li class="opacity-60">— Délai discuté ensemble</li>
            </ul>
            <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-4 hover:no-underline">
              Discutons-en <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>

        <!-- Maintenance & hébergement (abonnement mensuel optionnel) -->
        <div class="fade-in-up mt-16 md:mt-32 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Après la mise en ligne</p>
          <div class="md:col-span-9">
            <h3 class="text-2xl md:text-4xl font-thin leading-[1.1]">
              Maintenance &amp; hébergement — <span class="opacity-50">à partir de {{ MAINTENANCE.essentiel }}&nbsp;€/mois</span>
            </h3>
            <div class="mt-10 grid sm:grid-cols-2 gap-10 md:gap-14">
              <article class="border-t border-gray-200 dark:border-gray-800 pt-8">
                <h4 class="text-xs uppercase tracking-[0.25em] opacity-50 mb-4">Essentiel</h4>
                <p class="text-3xl md:text-4xl font-thin mb-6">{{ MAINTENANCE.essentiel }}&nbsp;€<span class="text-base opacity-50">&nbsp;/mois</span></p>
                <ul class="space-y-3 text-sm md:text-base opacity-80">
                  <li>— Hébergement</li>
                  <li>— Nom de domaine</li>
                  <li>— Certificat SSL</li>
                  <li>— Sauvegardes</li>
                  <li>— Surveillance</li>
                  <li>— Petites corrections</li>
                </ul>
              </article>
              <article class="border-t border-gray-900 dark:border-gray-100 pt-8">
                <h4 class="text-xs uppercase tracking-[0.25em] mb-4">Suivi</h4>
                <p class="text-3xl md:text-4xl font-thin mb-6">{{ MAINTENANCE.suivi }}&nbsp;€<span class="text-base opacity-50">&nbsp;/mois</span></p>
                <ul class="space-y-3 text-sm md:text-base opacity-80">
                  <li>— Tout l'Essentiel</li>
                  <li>— 1&nbsp;h de modifications par mois (horaires, photos, promos, nouvelles prestations)</li>
                  <li>— Mise à jour de la fiche Google Business</li>
                </ul>
              </article>
            </div>
            <p class="mt-10 text-sm opacity-60">Sans engagement, résiliable à tout moment.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== CASE STUDY ============================== -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Cas client</p>
          <h2 class="md:col-span-9 text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
            Autoomat<br>
            <span class="opacity-50">Garage à Ivry-sur-Seine.</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-12 gap-12 md:gap-16 fade-in-up">
          <div class="md:col-span-7 order-2 md:order-1">
            <!-- Desktop screenshot + phone mockup: stacked on mobile, overlapping from md up.
                 Regenerate with `npm run screenshots:offre`. width/height reserve the space (no layout shift). -->
            <div class="relative flex flex-col items-center gap-8 md:block md:pr-10 md:pb-14">
              <img
                src="/images/offre/autoomat-desktop.webp"
                alt="Site Autoomat sur ordinateur : page d'accueil du garage de carrosserie à Ivry-sur-Seine"
                width="1440"
                height="900"
                loading="lazy"
                decoding="async"
                class="w-full h-auto border border-gray-200 dark:border-gray-800"
              />
              <img
                src="/images/offre/autoomat-devis-mobile.webp"
                alt="Site Autoomat sur mobile : devis en ligne avec identification du véhicule par plaque d'immatriculation"
                width="780"
                height="1688"
                loading="lazy"
                decoding="async"
                class="w-[56%] max-w-[240px] h-auto md:absolute md:right-0 md:bottom-0 md:w-[25%] md:max-w-none rounded-[1.25rem] border-[5px] border-gray-900 dark:border-gray-700 bg-gray-900"
              />
            </div>
          </div>
          <div class="md:col-span-5 order-1 md:order-2 space-y-10">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-3">Le besoin</p>
              <p class="text-base md:text-lg leading-relaxed opacity-80">
                Aucune présence en ligne. Des clients potentiels passaient devant le garage sans savoir qu'il existait, et ne le trouvaient pas sur Google.
              </p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-3">Livré</p>
              <ul class="space-y-2 text-base md:text-lg opacity-80 leading-relaxed">
                <li>— Site moderne, optimisé mobile</li>
                <li>— SEO local sur les bonnes requêtes</li>
                <li>— Prise de RDV en ligne</li>
                <li>— Blog SEO + fiche Google Business</li>
                <li>— Devis automatique via API plaque</li>
              </ul>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-3">Résultat</p>
              <p class="text-base md:text-lg leading-relaxed opacity-80">
                Un site professionnel qui donne confiance dès la première visite, visible sur Google quand les automobilistes du coin cherchent un carrossier.
              </p>
            </div>
            <a
              :href="AUTOOMAT_URL"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-3 underline underline-offset-4 hover:no-underline pt-2"
            >
              Voir le site Autoomat <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== PROCESS ============================== -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Méthode</p>
          <h2 class="md:col-span-9 text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
            Simple, transparent,<br>
            <span class="opacity-50">sans surprise.</span>
          </h2>
        </div>

        <ol class="grid md:grid-cols-4 gap-12 md:gap-6 fade-in-up">
          <li>
            <p class="text-xs uppercase tracking-[0.25em] opacity-30 font-mono mb-6">01</p>
            <h3 class="text-xl md:text-2xl font-thin mb-3">Appel découverte</h3>
            <p class="text-sm md:text-base opacity-60 leading-relaxed">
              15 minutes gratuites pour comprendre votre projet et vos besoins. Sans engagement.
            </p>
          </li>
          <li>
            <p class="text-xs uppercase tracking-[0.25em] opacity-30 font-mono mb-6">02</p>
            <h3 class="text-xl md:text-2xl font-thin mb-3">Maquette</h3>
            <p class="text-sm md:text-base opacity-60 leading-relaxed">
              Je vous montre le design avant de coder. Vous validez, on ajuste.
            </p>
          </li>
          <li>
            <p class="text-xs uppercase tracking-[0.25em] opacity-30 font-mono mb-6">03</p>
            <h3 class="text-xl md:text-2xl font-thin mb-3">Développement</h3>
            <p class="text-sm md:text-base opacity-60 leading-relaxed">
              Je construis votre site. Vous suivez l'avancement et donnez votre avis.
            </p>
          </li>
          <li>
            <p class="text-xs uppercase tracking-[0.25em] opacity-30 font-mono mb-6">04</p>
            <h3 class="text-xl md:text-2xl font-thin mb-3">Mise en ligne</h3>
            <p class="text-sm md:text-base opacity-60 leading-relaxed">
              Votre site est live. Je vous forme pour le gérer en toute autonomie.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ============================== WHY ME ============================== -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Pourquoi moi</p>
          <h2 class="md:col-span-9 text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
            Pas une agence.<br>
            <span class="opacity-50">Pas un thème acheté 50€.</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-12 md:gap-x-20 md:gap-y-16 fade-in-up">
          <div>
            <h3 class="text-xl md:text-2xl font-thin mb-4">Vous parlez à la développeuse</h3>
            <p class="text-base md:text-lg opacity-60 leading-relaxed">
              Pas de chef de projet, pas de sous-traitance. La personne qui code votre site est celle avec qui vous discutez.
            </p>
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-thin mb-4">Basée à Paris</h3>
            <p class="text-base md:text-lg opacity-60 leading-relaxed">
              J'habite à Paris et je fréquente les commerces du quartier. Je comprends vos clients parce que j'en suis une.
            </p>
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-thin mb-4">Site codé sur mesure</h3>
            <p class="text-base md:text-lg opacity-60 leading-relaxed">
              Pas un WordPress avec un thème générique. Votre site est unique, rapide, et fait pour durer.
            </p>
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-thin mb-4">Vous êtes propriétaire</h3>
            <p class="text-base md:text-lg opacity-60 leading-relaxed">
              Pas d'abonnement obligatoire, pas de plateforme qui vous tient en otage. Le code et le contenu vous appartiennent.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== FAQ ============================== -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-4xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24">
          <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-6">Questions</p>
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
            Les questions qu'on me pose<br>
            <span class="opacity-50">le plus souvent.</span>
          </h2>
        </div>

        <ul class="divide-y divide-gray-200 dark:divide-gray-800 fade-in-up">
          <li v-for="(faq, i) in faqs" :key="i">
            <button
              @click="toggleFaq(i)"
              class="w-full py-6 md:py-8 flex items-center justify-between text-left gap-6 group"
              :aria-expanded="openFaqIndex === i"
              :aria-controls="`faq-answer-${i}`"
            >
              <span class="text-lg md:text-xl font-thin">{{ faq.q }}</span>
              <span
                class="text-2xl font-thin opacity-60 transition-transform shrink-0"
                :class="openFaqIndex === i ? 'rotate-45' : ''"
                aria-hidden="true"
              >+</span>
            </button>
            <div
              v-show="openFaqIndex === i"
              :id="`faq-answer-${i}`"
              class="pb-8 md:pb-10 pr-12 text-base md:text-lg opacity-70 leading-relaxed max-w-3xl"
            >
              {{ faq.a }}
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ============================== BY TRADE ============================== -->
    <nav aria-label="Offres par métier" class="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto fade-in-up grid md:grid-cols-12 gap-8">
        <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Par métier</p>
        <ul class="md:col-span-9 divide-y divide-gray-100 dark:divide-gray-900">
          <li v-for="p in OFFER_PAGES" :key="p.slug">
            <router-link :to="OFFER_PAGE_PATH(p.slug)" class="py-5 flex items-center justify-between gap-6 text-xl md:text-3xl font-thin opacity-70 hover:opacity-100 transition">
              <span>{{ p.label }}</span><span aria-hidden="true" class="opacity-30">→</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- ============================== CONTACT ============================== -->
    <section id="contact" class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-4xl mx-auto text-center fade-in-up">
        <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-8">Contact</p>
        <h2 class="text-4xl md:text-6xl lg:text-8xl font-thin leading-[0.95] mb-12">
          On en discute ?
        </h2>
        <p class="text-lg md:text-2xl font-thin opacity-70 leading-relaxed mb-16 max-w-2xl mx-auto">
          Premier appel de 15 minutes, gratuit et sans engagement.<br class="hidden md:block">
          On parle de votre projet, je vous dis ce que je peux faire.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xl md:text-3xl mb-8">
          <a :href="PHONE_HREF" class="underline underline-offset-[8px] decoration-1 hover:no-underline">
            <span class="sr-only">Appeler le</span> {{ PHONE.display }}
          </a>
          <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="underline underline-offset-[8px] decoration-1 hover:no-underline">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>

        <a
          :href="mailtoUrl"
          class="inline-block text-xl md:text-3xl underline underline-offset-[8px] decoration-1 hover:no-underline mb-12"
        >
          {{ EMAIL }} →
        </a>

        <div class="flex justify-center gap-8 text-sm opacity-50">
          <a href="https://www.linkedin.com/in/tenecoulibaly/" target="_blank" rel="noopener" class="hover:opacity-100 transition-opacity">
            LinkedIn ↗
          </a>
          <a href="https://github.com/CoulibalyT" target="_blank" rel="noopener" class="hover:opacity-100 transition-opacity">
            GitHub ↗
          </a>
          <router-link to="/" class="hover:opacity-100 transition-opacity">
            Portfolio
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============================== FOOTER ============================== -->
    <footer class="px-6 md:px-12 lg:px-20 pt-12 pb-28 md:pb-12 border-t border-gray-100 dark:border-gray-900 text-xs opacity-40">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:gap-6 md:items-center md:justify-between">
        <p>Tene Coulibaly · Développeuse Full Stack freelance · Paris</p>
        <p>Auto-entrepreneuse — TVA non applicable, art. 293 B du CGI</p>
      </div>
    </footer>

    <!-- ============================== STICKY CALL BAR (mobile only) ============================== -->
    <nav
      aria-label="Contact rapide"
      class="offer-call-bar md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 text-base border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
    >
      <a :href="PHONE_HREF" class="py-4 text-center bg-black text-white dark:bg-white dark:text-black">
        Appeler
      </a>
      <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="py-4 text-center text-black dark:text-gray-100">
        WhatsApp
      </a>
    </nav>
  </div>
</template>

<style scoped>
.offer-page {
  font-feature-settings: 'ss01', 'cv01';
}

.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.fade-in-up.in-view {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

input[type='range'] {
  height: 1px;
  background: rgba(128, 128, 128, 0.3);
  appearance: none;
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: currentColor;
  border-radius: 50%;
  cursor: pointer;
}
input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: currentColor;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

input[type='checkbox'] {
  accent-color: currentColor;
}

/* Sticky call bar: keep clear of the iOS home indicator, and show keyboard focus
   inside the bar (an outside outline would be clipped by the viewport edge). */
.offer-call-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
.offer-call-bar a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -4px;
}
</style>
