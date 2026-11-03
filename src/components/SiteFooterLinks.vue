<script setup>
// Footer links shared by every page (internal linking): home, website offer, the 6 trade pages, contact.
// No colors of its own — it inherits the text style of the footer it sits in.
// Recruiter pages: contact -> /contact (never the phone). /offre pages pass contact-href="#contact".
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { OFFER_PAGES, OFFER_PAGE_PATH } from '@/data/offerPages.js'

defineProps({
  contactHref: { type: String, default: null },
  align: { type: String, default: 'center' }, // 'center' | 'start'
})

const route = useRoute()
const isEn = computed(() => route.meta?.locale === 'en')
</script>

<template>
  <nav
    :aria-label="isEn ? 'Site links' : 'Liens du site'"
    class="site-footer-links"
    :class="align === 'start' ? 'justify-start' : 'justify-center'"
  >
    <router-link :to="isEn ? '/en' : '/'">{{ isEn ? 'Home' : 'Accueil' }}</router-link>
    <router-link to="/offre">{{ isEn ? 'Website creation (FR)' : 'Création de sites web' }}</router-link>
    <router-link v-for="p in OFFER_PAGES" :key="p.slug" :to="OFFER_PAGE_PATH(p.slug)">{{ p.label }}</router-link>
    <a v-if="contactHref" :href="contactHref">Contact</a>
    <router-link v-else :to="isEn ? '/en/contact' : '/contact'">Contact</router-link>
  </nav>
</template>

<style scoped>
.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
}

.site-footer-links a {
  color: inherit;
  text-underline-offset: 3px;
}

.site-footer-links a:hover,
.site-footer-links a:focus-visible {
  text-decoration: underline;
}
</style>
