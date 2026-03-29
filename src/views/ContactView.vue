<script setup>
import ContactComponent from '@/components/ContactComponent.vue';
import { useSeo } from '@/composables/useSeo'

useSeo('contact', '/contact')
</script>

<template>
  <main>
    <ContactComponent />
  </main>
</template>
