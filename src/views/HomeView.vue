<script setup>
import MeComponent from '../components/MeComponent.vue'
import { useSeo } from '@/composables/useSeo'
import { useHead } from '@unhead/vue'

useSeo('home', '/')

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tene Coulibaly',
        url: 'https://tenecoulibaly.com',
        jobTitle: 'Full Stack Developer',
        knowsAbout: ['Vue.js', 'React', 'Node.js', 'TypeScript', 'Docker', 'JavaScript'],
        sameAs: [
          'https://github.com/tenecoulibaly',
          'https://linkedin.com/in/tenecoulibaly'
        ]
      })
    }
  ]
})
</script>

<template>
  <main>
    <MeComponent />
  </main>
</template>
