<script setup>
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import '@/assets/offer-page.css'
import {
  OFFER_EMAIL as EMAIL,
  OFFER_PHONE as PHONE,
  OFFER_PHONE_HREF as PHONE_HREF,
  OFFER_SEO as SEO,
  AUTOOMAT_URL,
} from '@/data/offer.js'
import { OFFER_PAGES, OFFER_PAGE_PATH, offerPagePack } from '@/data/offerPages.js'

// One landing page per trade (/offre/<slug>). All copy lives in src/data/offerPages.js.
const props = defineProps({ page: { type: Object, required: true } })

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr'
const url = `${SITE_URL}${OFFER_PAGE_PATH(props.page.slug)}`
const pack = offerPagePack(props.page)
const others = OFFER_PAGES.filter(p => p.slug !== props.page.slug)

const mailtoUrl = computed(() => {
  const subject = encodeURIComponent(`Projet de site web — ${props.page.label}`)
  const body = encodeURIComponent(
    'Bonjour Tene,\n\n' +
    'Je m’intéresse à votre offre. Voici quelques infos sur mon projet :\n\n' +
    '- Activité : \n' +
    '- Localisation : \n' +
    '- J’ai déjà un site : oui / non\n' +
    '- Budget approximatif : \n' +
    '- Délai souhaité : \n\n' +
    'Cordialement,\n'
  )
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
})

const whatsappUrl = `https://wa.me/${PHONE.e164.replace('+', '')}?text=${encodeURIComponent(
  `Bonjour, je suis intéressé(e) par un site web (${props.page.label})`
)}`

onMounted(() => {
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
  title: props.page.title,
  htmlAttrs: { lang: 'fr' },
  meta: [
    { name: 'description', content: props.page.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: SEO.siteName },
    { property: 'og:title', content: props.page.title },
    { property: 'og:description', content: props.page.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: `${SITE_URL}/images/og-image.webp` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.page.title },
    { name: 'twitter:description', content: props.page.description },
    { name: 'twitter:image', content: `${SITE_URL}/images/og-image.webp` },
  ],
  link: [{ rel: 'canonical', href: url }],
})
</script>

<template>
  <div class="offer-page bg-white text-black dark:bg-black dark:text-gray-100">
    <a href="#contact" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 dark:focus:bg-white dark:focus:text-black">
      Aller au contact
    </a>

    <header class="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
        <router-link to="/offre" class="text-sm md:text-base hover:opacity-60 transition-opacity">
          <span class="opacity-50">←</span> Toutes les offres
        </router-link>
        <a :href="mailtoUrl" class="text-sm underline underline-offset-4 hover:no-underline">Me contacter</a>
      </div>
    </header>

    <!-- HERO -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <div class="max-w-7xl mx-auto w-full fade-in-up">
        <p class="text-xs md:text-sm uppercase tracking-[0.25em] opacity-50 mb-10 md:mb-16">{{ page.eyebrow }}</p>
        <h1 class="font-thin tracking-tight leading-[1] text-4xl sm:text-5xl md:text-7xl lg:text-8xl max-w-5xl">{{ page.h1 }}</h1>
        <p class="mt-12 md:mt-16 max-w-2xl text-lg md:text-2xl font-thin leading-relaxed opacity-70">{{ page.intro }}</p>
        <div class="mt-12 md:mt-16 flex flex-col sm:flex-row sm:flex-wrap gap-6 md:gap-10 text-base md:text-lg">
          <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-[6px] decoration-1 hover:no-underline transition w-fit">
            Premier appel gratuit (15 min) <span aria-hidden="true">→</span>
          </a>
          <a :href="PHONE_HREF" class="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition w-fit">
            <span class="sr-only">Appeler le</span> {{ PHONE.display }}
          </a>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition w-fit">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>

    <!-- NEEDS -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="fade-in-up mb-16 md:mb-24 grid md:grid-cols-12 gap-8">
          <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Ce que votre site doit faire</p>
          <h2 class="md:col-span-9 text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">Un site pensé pour votre métier.</h2>
        </div>
        <ol class="divide-y divide-gray-100 dark:divide-gray-900">
          <li v-for="(need, i) in page.needs" :key="need.t" class="fade-in-up grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-12">
            <span class="md:col-span-2 text-xs md:text-sm uppercase tracking-[0.25em] opacity-30 font-mono pt-1">0{{ i + 1 }}</span>
            <h3 class="md:col-span-4 text-2xl md:text-3xl font-thin">{{ need.t }}</h3>
            <p class="md:col-span-6 text-base md:text-lg opacity-60 leading-relaxed">{{ need.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- INCLUDES + PACK -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 md:gap-8">
        <div class="md:col-span-6 fade-in-up">
          <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-8">Ce que je mets en place</p>
          <ul class="divide-y divide-gray-100 dark:divide-gray-900 text-base md:text-lg">
            <li v-for="item in page.includes" :key="item" class="py-4 flex gap-4">
              <span aria-hidden="true" class="opacity-30">—</span><span class="opacity-80">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="md:col-span-5 md:col-start-8 fade-in-up">
          <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-8">Formule conseillée</p>
          <h2 class="text-4xl md:text-6xl font-thin">{{ pack.name }}</h2>
          <p class="mt-6 text-xl md:text-2xl font-thin opacity-80">
            à partir de {{ pack.price.toLocaleString('fr-FR') }}&nbsp;€
          </p>
          <p class="mt-2 text-sm opacity-50">ou 3 × {{ pack.installment }}&nbsp;€ sans frais</p>
          <p class="mt-6 text-base md:text-lg opacity-70 leading-relaxed">{{ page.packWhy }}</p>
          <p class="mt-10 flex flex-col gap-4 text-base md:text-lg">
            <router-link :to="{ path: '/offre', hash: '#packs' }" class="underline underline-offset-[6px] decoration-1 hover:no-underline w-fit">
              Voir le détail des formules <span aria-hidden="true">→</span>
            </router-link>
            <router-link :to="{ path: '/offre', hash: '#trouver' }" class="opacity-60 hover:opacity-100 transition w-fit">
              Trouver ma formule en quelques questions <span aria-hidden="true">→</span>
            </router-link>
          </p>
        </div>
      </div>
    </section>

    <!-- CASE STUDY (only where a real one exists) -->
    <section v-if="page.caseStudy" class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 fade-in-up">
        <p class="md:col-span-3 text-xs uppercase tracking-[0.25em] opacity-50 pt-2">Cas client</p>
        <div class="md:col-span-9">
          <h2 class="text-3xl md:text-5xl font-thin leading-[1.05] mb-8">Autoomat, carrosserie à Ivry-sur-Seine.</h2>
          <p class="max-w-3xl text-base md:text-lg opacity-70 leading-relaxed mb-8">
            Parcours sinistre guidé, prise de rendez-vous en ligne, devis avec identification du véhicule par sa plaque d’immatriculation, et pages rédigées pour le référencement local.
          </p>
          <a :href="AUTOOMAT_URL" target="_blank" rel="noopener" class="underline underline-offset-[6px] decoration-1 hover:no-underline">
            Voir le site Autoomat <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ (always open: short, factual answers) -->
    <section class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-4xl mx-auto">
        <p class="fade-in-up text-xs uppercase tracking-[0.25em] opacity-50 mb-12">Questions fréquentes</p>
        <dl class="divide-y divide-gray-200 dark:divide-gray-800 fade-in-up">
          <div v-for="faq in page.faq" :key="faq.q" class="py-8 md:py-10">
            <dt><h2 class="text-xl md:text-2xl font-thin mb-4">{{ faq.q }}</h2></dt>
            <dd class="text-base md:text-lg opacity-70 leading-relaxed max-w-3xl">{{ faq.a }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-4xl mx-auto text-center fade-in-up">
        <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-8">Contact</p>
        <h2 class="text-4xl md:text-6xl lg:text-8xl font-thin leading-[0.95] mb-12">On en discute ?</h2>
        <p class="text-lg md:text-2xl font-thin opacity-70 leading-relaxed mb-16 max-w-2xl mx-auto">
          Premier appel de 15 minutes, gratuit et sans engagement.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xl md:text-3xl mb-8">
          <a :href="PHONE_HREF" class="underline underline-offset-[8px] decoration-1 hover:no-underline">
            <span class="sr-only">Appeler le</span> {{ PHONE.display }}
          </a>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="underline underline-offset-[8px] decoration-1 hover:no-underline">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
        <a :href="mailtoUrl" class="inline-block text-xl md:text-3xl underline underline-offset-[8px] decoration-1 hover:no-underline">
          {{ EMAIL }} →
        </a>
      </div>
    </section>

    <!-- OTHER TRADES -->
    <nav aria-label="Autres métiers" class="px-6 md:px-12 lg:px-20 py-16 border-t border-gray-100 dark:border-gray-900">
      <div class="max-w-7xl mx-auto">
        <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-8">Aussi pour</p>
        <ul class="flex flex-wrap gap-x-8 gap-y-4 text-base md:text-lg">
          <li v-for="p in others" :key="p.slug">
            <router-link :to="OFFER_PAGE_PATH(p.slug)" class="opacity-60 hover:opacity-100 underline underline-offset-4 decoration-1 transition">{{ p.label }}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <footer class="px-6 md:px-12 lg:px-20 py-12 border-t border-gray-100 dark:border-gray-900 text-xs opacity-40">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:gap-6 md:items-center md:justify-between">
        <p>Tene Coulibaly · Développeuse Full Stack freelance · Paris</p>
        <p>Auto-entrepreneuse — TVA non applicable, art. 293 B du CGI</p>
      </div>
    </footer>
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
</style>
