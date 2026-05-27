<script setup>
import MeComponent from '../components/MeComponent.vue'
import { useSeo } from '@/composables/useSeo'
import { useHead } from '@unhead/vue'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr'

useSeo('home', '/')

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tene Coulibaly',
        url: SITE_URL,
        jobTitle: 'Développeuse Full Stack',
        description: 'Développeuse Full Stack à Paris, en recherche de CDI dès septembre 2026. Spécialisée Vue.js, React, Next.js, Node.js, NestJS, TypeScript, PostgreSQL.',
        knowsAbout: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Express', 'Symfony', 'PHP', 'PostgreSQL', 'Docker', 'Flutter', 'Prisma', 'Tailwind CSS'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paris',
          addressRegion: 'Île-de-France',
          addressCountry: 'FR'
        },
        alumniOf: [
          { '@type': 'Organization', name: 'ETNA' },
          { '@type': 'Organization', name: 'Epitech' },
          { '@type': 'Organization', name: 'INSEAD' }
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'INSEAD',
          description: 'Alternance Full Stack Developer'
        },
        sameAs: [
          'https://github.com/CoulibalyT',
          'https://www.linkedin.com/in/tenecoulibaly/'
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
