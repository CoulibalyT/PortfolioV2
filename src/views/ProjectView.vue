<script setup>
import ProjectComponent from '@/components/ProjectComponent.vue';
import { useSeo } from '@/composables/useSeo'

useSeo('projects', '/projects')
</script>

<template>
  <ProjectComponent />
</template>
