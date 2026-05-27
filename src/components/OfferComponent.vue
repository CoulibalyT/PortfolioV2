<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'

// --- Configurable pricing (edit here to update) ---
const PRICES = {
  vitrine: 800,
  business: 1500,
  // premium = sur devis
}

const EMAIL = 'contact@tenecoulibaly.fr'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr'

// --- FAQ state ---
const openFaqIndex = ref(null)
const toggleFaq = (i) => {
  openFaqIndex.value = openFaqIndex.value === i ? null : i
}
const faqs = [
  {
    q: "Combien de temps ça prend de A à Z ?",
    a: "Entre 2 semaines (Pack Vitrine) et 4 semaines (Pack Business). Le Pack Premium dépend du périmètre, on en discute lors du premier appel.",
  },
  {
    q: "Je n'y connais rien en informatique, c'est un problème ?",
    a: "Pas du tout. Mon rôle est justement de m'occuper de toute la partie technique. On parle ensemble de votre commerce, de vos clients, de ce que vous voulez transmettre — je traduis ça en site web. Vous n'avez aucune ligne de code à voir.",
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
    a: "C'est tout ce qui fait que votre site apparaît dans les résultats Google quand un client tape \"coiffeur Paris 11\" ou \"garage Ivry\". Je configure ça à la livraison : titres, descriptions, fiche Google Business, balisage local. L'objectif : être trouvé par les bonnes personnes près de chez vous.",
  },
  {
    q: "Et si je veux des modifications après la livraison ?",
    a: "Les Packs Vitrine et Business incluent 15 jours de retouches gratuites après mise en ligne. Au-delà, je propose des forfaits maintenance (à partir de 50€/mois) ou des interventions à la demande (60€/h). Pas d'abonnement obligatoire.",
  },
]

// --- Calculator state ---
const calc = ref({
  pages: 1,
  blog: false,
  booking: false,
  multilingual: false,
  ecommerce: false,
})
const calcEstimate = computed(() => {
  let base = 800
  if (calc.value.pages > 1) base += (calc.value.pages - 1) * 200
  if (calc.value.blog) base += 300
  if (calc.value.booking) base += 250
  if (calc.value.multilingual) base += 400
  if (calc.value.ecommerce) base += 800
  return base
})

// --- Pre-built mailto URL ---
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

// --- IntersectionObserver fade-in ---
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

// --- SEO meta (title/description handled at runtime for SPA navigation;
//     JSON-LD schemas are injected at prerender time by scripts/inject-meta.mjs to be visible to non-JS crawlers) ---
useHead({
  title: 'Création de sites web pour commerces et artisans à Paris — Tene Coulibaly',
  htmlAttrs: { lang: 'fr' },
  meta: [
    {
      name: 'description',
      content: "Sites web sur mesure pour commerçants, artisans et entrepreneurs locaux. Design moderne, SEO local, à partir de 800€. Premier appel gratuit.",
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:title', content: 'Création de sites web pour commerces et artisans — Tene Coulibaly' },
    {
      property: 'og:description',
      content: "Sites web sur mesure pour commerçants, artisans et entrepreneurs locaux. Design moderne, SEO local, à partir de 800€.",
    },
    { property: 'og:url', content: `${SITE_URL}/offre` },
    { property: 'og:image', content: `${SITE_URL}/images/og-image.webp` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Création de sites web pour commerces et artisans — Tene Coulibaly' },
    {
      name: 'twitter:description',
      content: "Sites web sur mesure pour commerçants, artisans et entrepreneurs locaux. À partir de 800€.",
    },
    { name: 'twitter:image', content: `${SITE_URL}/images/og-image.webp` },
  ],
  link: [
    { rel: 'canonical', href: `${SITE_URL}/offre` },
  ],
})
</script>

<template>
  <div class="offer-page h-screen overflow-y-auto overflow-x-hidden scroll-smooth bg-[#08080a] text-[#f0ece4]">
    <a href="#contact" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#c8ff00] focus:text-black focus:px-4 focus:py-2 focus:rounded">
      Aller au contact
    </a>

    <!-- Mini header -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-[#08080a]/80 border-b border-white/5">
      <div class="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <router-link to="/" class="text-sm md:text-base font-medium tracking-tight hover:text-[#c8ff00] transition-colors">
          ← Tene Coulibaly
        </router-link>
        <div class="flex items-center gap-4 text-sm">
          <router-link to="/projects" class="hidden sm:inline text-white/60 hover:text-white transition-colors">
            Mes projets
          </router-link>
          <a
            :href="mailtoUrl"
            class="bg-[#c8ff00] text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium hover:bg-[#d4ff33] transition-colors text-xs md:text-sm"
          >
            Me contacter
          </a>
        </div>
      </div>
    </header>

    <!-- ============================== HERO ============================== -->
    <section class="relative px-4 md:px-8 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div class="max-w-4xl mx-auto text-center fade-in-up">
        <p class="text-[#c8ff00] text-sm md:text-base font-medium tracking-widest uppercase mb-6">
          Création de sites web · Paris &amp; Île-de-France
        </p>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-thin leading-[1.1] tracking-tight mb-6 md:mb-8">
          Votre commerce mérite<br>
          <span class="font-medium">d'exister en ligne.</span>
        </h1>
        <p class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
          Je crée des sites modernes, rapides et optimisés pour les commerces et artisans.
          De la maquette à la mise en ligne, je m'occupe de tout.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            :href="mailtoUrl"
            class="w-full sm:w-auto bg-[#c8ff00] text-black px-8 py-4 rounded-xl font-medium text-base hover:bg-[#d4ff33] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Premier appel gratuit (15 min)
          </a>
          <a
            href="#packs"
            class="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-base border border-white/15 hover:bg-white/5 transition-colors"
          >
            Voir les tarifs
          </a>
        </div>

        <!-- Trust strip -->
        <div class="mt-12 md:mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/40">
          <span>✓ Devis transparent</span>
          <span>✓ Sans abonnement caché</span>
          <span>✓ Vous êtes propriétaire du site</span>
        </div>
      </div>
    </section>

    <!-- ============================== PROBLEM ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <h2 class="text-3xl md:text-5xl font-thin leading-tight mb-4">
            Vos clients vous cherchent.
          </h2>
          <p class="text-xl md:text-2xl text-white/50">Est-ce qu'ils vous trouvent ?</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <div class="text-3xl mb-4" aria-hidden="true">🔍</div>
            <h3 class="text-lg md:text-xl font-medium mb-2">Invisibles sur Google</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Vos futurs clients tapent &laquo;&nbsp;coiffeur près de chez moi&nbsp;&raquo; ou &laquo;&nbsp;garage Ivry&nbsp;&raquo; — et atterrissent chez vos concurrents.
            </p>
          </div>

          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <div class="text-3xl mb-4" aria-hidden="true">📱</div>
            <h3 class="text-lg md:text-xl font-medium mb-2">Un site qui date</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Votre site existant ne s'affiche pas sur mobile, charge en 8 secondes, et donne une image vieillotte de votre commerce.
            </p>
          </div>

          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <div class="text-3xl mb-4" aria-hidden="true">📉</div>
            <h3 class="text-lg md:text-xl font-medium mb-2">Otage des réseaux sociaux</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Vous postez sur Instagram ou Facebook mais l'algorithme décide qui vous voit. Demain, il change — vous perdez votre audience.
            </p>
          </div>

          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <div class="text-3xl mb-4" aria-hidden="true">⏰</div>
            <h3 class="text-lg md:text-xl font-medium mb-2">Pas le temps pour ça</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Vous avez un commerce à faire tourner. Comprendre WordPress, gérer un hébergement, coder du HTML — c'est pas votre métier.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== PACKS ============================== -->
    <section id="packs" class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">Mes offres</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight mb-4">
            Un pack pour chaque projet
          </h2>
          <p class="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
            Prix HT, TVA non applicable (art. 293 B du CGI). Tous les packs incluent l'hébergement la première année.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <!-- Pack Vitrine -->
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col hover:border-white/10 transition-colors">
            <div class="mb-6">
              <h3 class="text-2xl font-medium mb-2">Vitrine</h3>
              <p class="text-white/50 text-sm">Pour démarrer en ligne simplement</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-thin">{{ PRICES.vitrine }}€</span>
              <span class="text-white/40 text-sm ml-1">à partir de</span>
            </div>
            <ul class="flex-1 space-y-3 mb-8 text-sm md:text-base">
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Site one-page moderne et responsive</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Design sur mesure (pas de template)</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Optimisé Google (SEO de base)</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Formulaire de contact</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Mise en ligne incluse</span>
              </li>
              <li class="flex gap-3 text-white/50">
                <span class="shrink-0" aria-hidden="true">⏱</span>
                <span>Livraison en 2 semaines</span>
              </li>
            </ul>
            <a
              :href="mailtoUrl"
              class="block text-center w-full px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition-colors font-medium"
            >
              Demander un devis
            </a>
          </div>

          <!-- Pack Business (featured) -->
          <div class="fade-in-up relative bg-[#111113] border-2 border-[#c8ff00] rounded-2xl p-6 md:p-8 flex flex-col md:scale-105 md:shadow-[0_0_40px_-12px_rgba(200,255,0,0.3)]">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8ff00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Populaire
            </div>
            <div class="mb-6">
              <h3 class="text-2xl font-medium mb-2">Business</h3>
              <p class="text-white/50 text-sm">Pour développer votre activité en ligne</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-thin">{{ PRICES.business }}€</span>
              <span class="text-white/40 text-sm ml-1">à partir de</span>
            </div>
            <ul class="flex-1 space-y-3 mb-8 text-sm md:text-base">
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Site multi-pages (jusqu'à 5 pages)</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Tout le Pack Vitrine, en plus complet</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Blog intégré</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Fiche Google Business optimisée</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Intégration réservation (Calendly ou similaire)</span>
              </li>
              <li class="flex gap-3 text-white/50">
                <span class="shrink-0" aria-hidden="true">⏱</span>
                <span>Livraison en 3 à 4 semaines</span>
              </li>
            </ul>
            <a
              :href="mailtoUrl"
              class="block text-center w-full px-6 py-3 rounded-xl bg-[#c8ff00] text-black font-medium hover:bg-[#d4ff33] transition-colors"
            >
              Choisir ce pack
            </a>
          </div>

          <!-- Pack Premium -->
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col hover:border-white/10 transition-colors">
            <div class="mb-6">
              <h3 class="text-2xl font-medium mb-2">Premium</h3>
              <p class="text-white/50 text-sm">Pour des besoins sur mesure</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-thin">Sur devis</span>
            </div>
            <ul class="flex-1 space-y-3 mb-8 text-sm md:text-base">
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Application web sur mesure</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Tout le Pack Business, plus loin</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Espace client, paiement en ligne, API…</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Accompagnement SEO 3 mois</span>
              </li>
              <li class="flex gap-3">
                <span class="text-[#c8ff00] shrink-0" aria-hidden="true">✓</span>
                <span>Maintenance incluse 6 mois</span>
              </li>
              <li class="flex gap-3 text-white/50">
                <span class="shrink-0" aria-hidden="true">⏱</span>
                <span>Délai discuté ensemble</span>
              </li>
            </ul>
            <a
              :href="mailtoUrl"
              class="block text-center w-full px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition-colors font-medium"
            >
              Discutons-en
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== CASE STUDY ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">Cas client</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight">
            Autoomat <span class="text-white/40">— Garage à Ivry-sur-Seine</span>
          </h2>
        </div>

        <div class="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden fade-in-up">
          <div class="grid md:grid-cols-2">
            <!-- Screenshot -->
            <div class="bg-[#08080a] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/5">
              <img
                src="/images/projects/autoomat/home.webp"
                alt="Capture d'écran du site Autoomat — garage de carrosserie à Ivry-sur-Seine"
                width="800"
                height="600"
                loading="lazy"
                class="rounded-lg w-full h-auto shadow-2xl"
              />
            </div>

            <!-- Content -->
            <div class="p-6 md:p-10 flex flex-col justify-center">
              <h3 class="text-sm font-medium text-[#c8ff00] uppercase tracking-widest mb-3">Le besoin</h3>
              <p class="text-white/70 mb-6 leading-relaxed">
                Aucune présence en ligne. Des clients potentiels passaient devant le garage sans savoir qu'il existait, et ne le trouvaient pas sur Google.
              </p>

              <h3 class="text-sm font-medium text-[#c8ff00] uppercase tracking-widest mb-3">Ce que j'ai fait</h3>
              <ul class="space-y-2 text-white/70 mb-6 leading-relaxed">
                <li class="flex gap-3"><span class="text-[#c8ff00] shrink-0" aria-hidden="true">→</span>Site moderne, optimisé mobile</li>
                <li class="flex gap-3"><span class="text-[#c8ff00] shrink-0" aria-hidden="true">→</span>SEO local (ranking sur &laquo;&nbsp;carrosserie Ivry-sur-Seine&nbsp;&raquo;)</li>
                <li class="flex gap-3"><span class="text-[#c8ff00] shrink-0" aria-hidden="true">→</span>Prise de RDV en ligne (Calendly)</li>
                <li class="flex gap-3"><span class="text-[#c8ff00] shrink-0" aria-hidden="true">→</span>Blog SEO + fiche Google Business liée</li>
                <li class="flex gap-3"><span class="text-[#c8ff00] shrink-0" aria-hidden="true">→</span>Devis automatique via API plaque d'immatriculation</li>
              </ul>

              <h3 class="text-sm font-medium text-[#c8ff00] uppercase tracking-widest mb-3">Résultat</h3>
              <p class="text-white/70 leading-relaxed mb-6">
                Un site professionnel qui donne confiance dès la première visite, visible sur Google quand les automobilistes du coin cherchent un carrossier, avec des prises de RDV qui tombent toutes seules.
              </p>

              <a
                href="https://autoomat.vercel.app"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-[#c8ff00] hover:underline font-medium w-fit"
              >
                Voir le site Autoomat
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== PROCESS ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">Comment ça marche</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight">
            Simple, transparent, sans surprise
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6 md:gap-4">
          <div class="fade-in-up relative">
            <div class="text-[#c8ff00] text-5xl font-thin mb-4">01</div>
            <h3 class="text-lg font-medium mb-2">Appel découverte</h3>
            <p class="text-white/60 text-sm leading-relaxed">
              15 minutes gratuites pour comprendre votre projet et vos besoins. Sans engagement.
            </p>
          </div>
          <div class="fade-in-up relative">
            <div class="text-[#c8ff00] text-5xl font-thin mb-4">02</div>
            <h3 class="text-lg font-medium mb-2">Maquette</h3>
            <p class="text-white/60 text-sm leading-relaxed">
              Je vous montre le design avant de coder. Vous validez, on ajuste.
            </p>
          </div>
          <div class="fade-in-up relative">
            <div class="text-[#c8ff00] text-5xl font-thin mb-4">03</div>
            <h3 class="text-lg font-medium mb-2">Développement</h3>
            <p class="text-white/60 text-sm leading-relaxed">
              Je construis votre site. Vous suivez l'avancement et donnez votre avis.
            </p>
          </div>
          <div class="fade-in-up relative">
            <div class="text-[#c8ff00] text-5xl font-thin mb-4">04</div>
            <h3 class="text-lg font-medium mb-2">Mise en ligne</h3>
            <p class="text-white/60 text-sm leading-relaxed">
              Votre site est live. Je vous forme pour le gérer en toute autonomie.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== WHY ME ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">Pourquoi moi</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight">
            Pas une agence. Pas un thème acheté 50€.
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-4 md:gap-6">
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8">
            <div class="text-2xl mb-3" aria-hidden="true">👋</div>
            <h3 class="text-lg font-medium mb-2">Vous parlez directement à la développeuse</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Pas de chef de projet, pas de sous-traitance offshore. La personne qui code votre site est celle avec qui vous discutez.
            </p>
          </div>
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8">
            <div class="text-2xl mb-3" aria-hidden="true">📍</div>
            <h3 class="text-lg font-medium mb-2">Basée à Paris, je connais les commerces locaux</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              J'habite en Île-de-France et je fréquente les commerces du quartier. Je comprends vos clients parce que j'en suis une.
            </p>
          </div>
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8">
            <div class="text-2xl mb-3" aria-hidden="true">⚙️</div>
            <h3 class="text-lg font-medium mb-2">Site codé sur mesure</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Pas un WordPress avec un thème générique. Votre site est unique, rapide, et fait pour durer.
            </p>
          </div>
          <div class="fade-in-up bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8">
            <div class="text-2xl mb-3" aria-hidden="true">🔓</div>
            <h3 class="text-lg font-medium mb-2">Vous êtes propriétaire</h3>
            <p class="text-white/60 leading-relaxed text-sm md:text-base">
              Pas d'abonnement obligatoire, pas de plateforme qui vous tient en otage. Le code et le contenu vous appartiennent.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== CALCULATOR (bonus) ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 md:mb-12 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">Estimation rapide</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight mb-4">
            Combien coûterait votre site ?
          </h2>
          <p class="text-base md:text-lg text-white/50">
            Quelques questions pour avoir un ordre de grandeur. Le vrai devis est gratuit et sur mesure.
          </p>
        </div>

        <div class="bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 fade-in-up">
          <div class="space-y-6 mb-8">
            <!-- Pages -->
            <div>
              <label class="block text-sm font-medium mb-3">
                Combien de pages ? <span class="text-white/40 font-normal">({{ calc.pages }})</span>
              </label>
              <input
                v-model.number="calc.pages"
                type="range"
                min="1"
                max="10"
                class="w-full accent-[#c8ff00]"
                aria-label="Nombre de pages"
              />
              <div class="flex justify-between text-xs text-white/40 mt-1">
                <span>1 page</span>
                <span>10 pages</span>
              </div>
            </div>

            <!-- Toggles -->
            <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
              <label class="flex items-center gap-3 p-3 md:p-4 bg-[#08080a] rounded-xl cursor-pointer hover:bg-[#0a0a0c] transition-colors">
                <input
                  v-model="calc.blog"
                  type="checkbox"
                  class="w-4 h-4 accent-[#c8ff00] shrink-0"
                />
                <span class="text-sm">Blog intégré</span>
              </label>
              <label class="flex items-center gap-3 p-3 md:p-4 bg-[#08080a] rounded-xl cursor-pointer hover:bg-[#0a0a0c] transition-colors">
                <input
                  v-model="calc.booking"
                  type="checkbox"
                  class="w-4 h-4 accent-[#c8ff00] shrink-0"
                />
                <span class="text-sm">Réservation en ligne</span>
              </label>
              <label class="flex items-center gap-3 p-3 md:p-4 bg-[#08080a] rounded-xl cursor-pointer hover:bg-[#0a0a0c] transition-colors">
                <input
                  v-model="calc.multilingual"
                  type="checkbox"
                  class="w-4 h-4 accent-[#c8ff00] shrink-0"
                />
                <span class="text-sm">Bilingue (FR + EN)</span>
              </label>
              <label class="flex items-center gap-3 p-3 md:p-4 bg-[#08080a] rounded-xl cursor-pointer hover:bg-[#0a0a0c] transition-colors">
                <input
                  v-model="calc.ecommerce"
                  type="checkbox"
                  class="w-4 h-4 accent-[#c8ff00] shrink-0"
                />
                <span class="text-sm">Boutique en ligne</span>
              </label>
            </div>
          </div>

          <!-- Result -->
          <div class="bg-[#08080a] rounded-xl p-6 text-center border border-[#c8ff00]/20">
            <p class="text-white/50 text-sm mb-2">Estimation</p>
            <p class="text-4xl md:text-5xl font-thin mb-1">
              à partir de <span class="text-[#c8ff00] font-medium">{{ calcEstimate }}€</span>
            </p>
            <p class="text-xs text-white/40">HT, TVA non applicable</p>
          </div>

          <a
            :href="mailtoUrl"
            class="block text-center w-full mt-6 px-6 py-4 rounded-xl bg-[#c8ff00] text-black font-medium hover:bg-[#d4ff33] transition-colors"
          >
            Obtenir un devis précis
          </a>
        </div>
      </div>
    </section>

    <!-- ============================== FAQ ============================== -->
    <section class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12 md:mb-16 fade-in-up">
          <p class="text-[#c8ff00] text-xs md:text-sm font-medium tracking-widest uppercase mb-3">FAQ</p>
          <h2 class="text-3xl md:text-5xl font-thin leading-tight">
            Les questions que vous vous posez
          </h2>
        </div>

        <div class="space-y-3 fade-in-up">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="bg-[#111113] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
          >
            <button
              @click="toggleFaq(i)"
              class="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors"
              :aria-expanded="openFaqIndex === i"
              :aria-controls="`faq-answer-${i}`"
            >
              <span class="font-medium text-sm md:text-base">{{ faq.q }}</span>
              <span
                class="text-[#c8ff00] text-xl transition-transform shrink-0"
                :class="openFaqIndex === i ? 'rotate-45' : ''"
                aria-hidden="true"
              >+</span>
            </button>
            <div
              v-show="openFaqIndex === i"
              :id="`faq-answer-${i}`"
              class="px-5 md:px-6 pb-5 md:pb-6 text-white/60 leading-relaxed text-sm md:text-base"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== CONTACT ============================== -->
    <section id="contact" class="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
      <div class="max-w-3xl mx-auto text-center fade-in-up">
        <h2 class="text-3xl md:text-5xl font-thin leading-tight mb-4">
          Prêt à passer en ligne ?
        </h2>
        <p class="text-lg md:text-xl text-white/60 mb-10 md:mb-12">
          Premier appel de 15 minutes, gratuit et sans engagement.<br>
          On parle de votre projet, je vous dis ce que je peux faire.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            :href="mailtoUrl"
            class="bg-[#c8ff00] text-black px-8 py-4 rounded-xl font-medium text-base hover:bg-[#d4ff33] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Écrivez-moi
          </a>
        </div>

        <div class="text-white/50 text-sm mb-10">
          Ou écrivez directement à
          <a :href="`mailto:${EMAIL}`" class="text-[#c8ff00] hover:underline font-medium">
            {{ EMAIL }}
          </a>
        </div>

        <div class="flex justify-center gap-6 text-sm text-white/40">
          <a
            href="https://www.linkedin.com/in/tenecoulibaly/"
            target="_blank"
            rel="noopener"
            class="hover:text-white/80 transition-colors"
          >LinkedIn ↗</a>
          <a
            href="https://github.com/CoulibalyT"
            target="_blank"
            rel="noopener"
            class="hover:text-white/80 transition-colors"
          >GitHub ↗</a>
          <router-link to="/" class="hover:text-white/80 transition-colors">Portfolio</router-link>
        </div>
      </div>
    </section>

    <!-- ============================== FOOTER ============================== -->
    <footer class="px-4 md:px-8 py-8 border-t border-white/5 text-center text-xs text-white/30">
      <p>
        Tene Coulibaly · Développeuse Full Stack freelance · Paris
        <br class="md:hidden">
        <span class="hidden md:inline"> · </span>
        Auto-entrepreneuse — TVA non applicable, art. 293 B du CGI
      </p>
    </footer>
  </div>
</template>

<style scoped>
.offer-page {
  font-feature-settings: 'ss01', 'cv01';
}

/* Scroll-triggered fade-in */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
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

/* Range slider visual tweaks */
input[type='range'] {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #c8ff00;
  border-radius: 50%;
  cursor: pointer;
}
input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #c8ff00;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
