<script setup>
import SkillsComponent from '@/components/SkillsComponent.vue';
import { useSeo } from '@/composables/useSeo'

useSeo('skills', '/skills')
</script>

<template>
  <main>
    <SkillsComponent />
  </main>
</template>
