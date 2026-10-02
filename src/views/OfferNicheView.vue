<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import OfferNichePage from '@/components/OfferNichePage.vue'
import { findOfferPage } from '@/data/offerPages.js'

const route = useRoute()
const page = computed(() => findOfferPage(route.params.slug))
</script>

<template>
  <main>
    <OfferNichePage v-if="page" :key="page.slug" :page="page" />
  </main>
</template>
