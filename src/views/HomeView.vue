<script setup>
import MeComponent from '../components/MeComponent.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

useSeo('home', '/')

const route = useRoute()
const contactPath = computed(() => (route.meta?.locale === 'en' ? '/en/contact' : '/contact'))
</script>

<template>
  <main class="w-full flex flex-col items-center gap-6 md:gap-8">
    <!-- Accueil = recruteurs : CV et contact en premier. L'offre freelance reste dans la nav et le footer -->
    <div class="w-full max-w-3xl px-4 md:px-0 flex flex-wrap gap-2 text-left">
      <a href="/CV_Tene_Coulibaly.pdf" target="_blank" rel="noopener" class="offer-banner text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-100">
        <span>{{ $t('home_cta.cv') }}</span>
        <span aria-hidden="true">↓</span>
      </a>
      <router-link :to="contactPath" class="offer-banner text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-100">
        <span>{{ $t('home_cta.contact') }}</span>
        <span aria-hidden="true">→</span>
      </router-link>
    </div>
    <MeComponent />
  </main>
</template>

<style scoped>
.offer-banner {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  border-radius: 1.25rem; /* pill on one line, soft box when the text wraps on mobile */
  font-size: 0.8125rem;
  line-height: 1.4;
  text-align: left;
}

.offer-banner:hover {
  border-color: currentColor;
}

.offer-banner:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>
