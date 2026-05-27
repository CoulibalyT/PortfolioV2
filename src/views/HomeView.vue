<script setup>
import MeComponent from '../components/MeComponent.vue'
import { useSeo } from '@/composables/useSeo'

useSeo('home', '/')
</script>

<template>
  <main>
    <MeComponent />
  </main>
</template>
