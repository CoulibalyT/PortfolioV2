<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProjectComponent from '@/components/ProjectComponent.vue';
import { useSeo } from '@/composables/useSeo'
import { projects, projectSeo } from '@/data/projects.js'

// Same view for /projects and /projects/:slug: each project URL keeps its own
// title, description and canonical (otherwise Google sees it as a duplicate of /projects).
const route = useRoute()
const project = computed(() => projects.find(p => p.folder === route.params.slug) || null)

useSeo(
  'projects',
  () => (project.value ? `/projects/${project.value.folder}` : '/projects'),
  () => (project.value ? projectSeo(project.value, route.meta?.locale) : null),
)
</script>

<template>
  <ProjectComponent />
</template>
